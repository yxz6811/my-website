/**
 * 留言板接口防护：按客户端 IP 限制请求频率，减轻恶意刷信与 SMTP 滥用。
 *
 * 说明：依赖进程内 Map，在单机/常驻 Node 进程中有效；Serverless 多实例下为「每实例各自计数」，
 * 仍能削弱轰炸强度。若需全局一致限流，可后续接入 Redis（如 Upstash）。
 */

/** 统计尝试次数的时间窗（例如滚动 10 分钟内最多若干次 POST） */
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
/** 时间窗内允许的最大尝试次数（含校验失败，减轻畸形请求轰炸） */
const MAX_ATTEMPTS_PER_WINDOW = 18;
/** 成功发信计数的时间窗（1 小时） */
const SUCCESS_WINDOW_MS = 60 * 60 * 1000;
/** 每 IP 每小时最多成功送达邮件数 */
const MAX_SUCCESS_PER_WINDOW = 6;
/** 两次成功发信之间的最短间隔（秒） */
const MIN_SECONDS_BETWEEN_SUCCESS = 40;

type IpStats = {
  /** 每次「有效 POST」（已过蜜罐且 JSON 合法）的时间戳 */
  attempts: number[];
  /** 每次成功调用 SMTP 的时间戳 */
  successes: number[];
};

const globalStore = globalThis as typeof globalThis & {
  __messageBoardGuardStore?: Map<string, IpStats>;
};

const store: Map<string, IpStats> =
  globalStore.__messageBoardGuardStore ?? new Map<string, IpStats>();
globalStore.__messageBoardGuardStore = store;

/**
 * 从请求头解析客户端 IP（兼容常见反向代理与 CDN）。
 */
export function getClientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf?.trim()) return cf.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  return "unknown";
}

/**
 * 修剪时间戳数组，只保留窗口内的记录。
 */
function pruneTimestamps(timestamps: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs;
  return timestamps.filter((t) => t > cutoff);
}

function getOrCreateStats(ip: string): IpStats {
  let rec = store.get(ip);
  if (!rec) {
    rec = { attempts: [], successes: [] };
    store.set(ip, rec);
  }
  return rec;
}

export type AttemptResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number; message: string };

/**
 * 记录一次合法 POST 尝试；超过频率则拒绝。
 */
export function checkAndRecordAttempt(ip: string): AttemptResult {
  const now = Date.now();
  const rec = getOrCreateStats(ip);
  rec.attempts = pruneTimestamps(rec.attempts, ATTEMPT_WINDOW_MS, now);
  if (rec.attempts.length >= MAX_ATTEMPTS_PER_WINDOW) {
    const oldest = rec.attempts[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((ATTEMPT_WINDOW_MS - (now - oldest)) / 1000),
    );
    return {
      ok: false,
      retryAfterSec,
      message: "提交过于频繁，请稍后再试。",
    };
  }
  rec.attempts.push(now);
  return { ok: true };
}

export type SuccessPrecheckResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number; message: string };

/**
 * 在准备发信前检查：小时额度与两次成功之间的最短间隔。
 */
export function precheckSuccessSend(ip: string): SuccessPrecheckResult {
  const now = Date.now();
  const rec = getOrCreateStats(ip);
  rec.successes = pruneTimestamps(rec.successes, SUCCESS_WINDOW_MS, now);

  if (rec.successes.length >= MAX_SUCCESS_PER_WINDOW) {
    const oldest = rec.successes[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((SUCCESS_WINDOW_MS - (now - oldest)) / 1000),
    );
    return {
      ok: false,
      retryAfterSec,
      message: "本小时留言次数已达上限，请稍后再试。",
    };
  }

  const lastSuccess = rec.successes[rec.successes.length - 1];
  if (lastSuccess !== undefined) {
    const delta = now - lastSuccess;
    const minMs = MIN_SECONDS_BETWEEN_SUCCESS * 1000;
    if (delta < minMs) {
      const retryAfterSec = Math.max(1, Math.ceil((minMs - delta) / 1000));
      return {
        ok: false,
        retryAfterSec,
        message: "发送间隔太短，请稍后再试。",
      };
    }
  }

  return { ok: true };
}

/**
 * SMTP 发送成功后记录时间戳。
 */
export function recordSuccessfulSend(ip: string): void {
  const now = Date.now();
  const rec = getOrCreateStats(ip);
  rec.successes = pruneTimestamps(rec.successes, SUCCESS_WINDOW_MS, now);
  rec.successes.push(now);
}
