/**
 * AI 墙接口防护：按 IP 限制调用频率，控制费用与滥用。
 *
 * 进程内 Map；单机 PM2 有效。多实例可后续换 Redis。
 */

const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 12;
const SUCCESS_WINDOW_MS = 60 * 60 * 1000;
const MAX_SUCCESS_PER_WINDOW = 4;
const MIN_SECONDS_BETWEEN_SUCCESS = 25;

type IpStats = {
  attempts: number[];
  successes: number[];
};

const globalStore = globalThis as typeof globalThis & {
  __aiWallGuardStore?: Map<string, IpStats>;
};

const store: Map<string, IpStats> =
  globalStore.__aiWallGuardStore ?? new Map<string, IpStats>();
globalStore.__aiWallGuardStore = store;

/**
 * 从请求头解析客户端 IP。
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
 * 修剪时间戳数组。
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
 * 记录一次合法 POST 尝试。
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
 * 生成卡片前检查额度与间隔。
 */
export function precheckSuccess(ip: string): SuccessPrecheckResult {
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
      message: "本小时互动次数已达上限，请稍后再试。",
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
        message: "生成间隔太短，请稍后再试。",
      };
    }
  }

  return { ok: true };
}

/**
 * 生成成功后记录。
 */
export function recordSuccessfulGeneration(ip: string): void {
  const now = Date.now();
  const rec = getOrCreateStats(ip);
  rec.successes = pruneTimestamps(rec.successes, SUCCESS_WINDOW_MS, now);
  rec.successes.push(now);
}
