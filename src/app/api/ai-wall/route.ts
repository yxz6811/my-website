import { randomUUID } from "node:crypto";

import {
  checkAndRecordAttempt,
  getClientIp,
  precheckSuccess,
  recordSuccessfulGeneration,
} from "@/lib/ai-wall-guard";
import {
  AiWallConfigError,
  AiWallRejectedError,
  generateAiWallReply,
} from "@/lib/ai-wall-generate";
import { moderateAiWallContent } from "@/lib/ai-wall-moderate";
import { prependAiWallCard, prependAiWallRejection, readAiWallCards } from "@/lib/ai-wall-store";
import {
  AI_WALL_LIST_LIMIT,
  AI_WALL_MAX_BODY_SIZE,
  type AiWallCard,
  type AiWallMode,
} from "@/lib/ai-wall-types";

/**
 * 列出墙上卡片（新→旧）。
 */
export async function GET() {
  const cards = await readAiWallCards();
  return Response.json({
    cards: cards.slice(0, AI_WALL_LIST_LIMIT),
    configured: Boolean(process.env.AI_API_KEY?.trim()),
  });
}

/**
 * 上墙：先审访客原话；通过后写入原话。AI 回复仅为附注，失败不影响原话上墙。
 */
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json({ message: "仅支持 JSON 格式的请求。" }, { status: 415 });
  }

  const contentLength = parseInt(req.headers.get("content-length") ?? "0", 10);
  if (contentLength > AI_WALL_MAX_BODY_SIZE) {
    return Response.json({ message: "请求体过大。" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "请求格式不正确。" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ message: "请提供有效的 JSON 对象。" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;

  /** 蜜罐：非空则假成功 */
  if (typeof payload.website === "string" && payload.website.trim()) {
    return Response.json({
      ok: true,
      card: buildDecoyCard(),
    });
  }

  const clientIp = getClientIp(req);
  const attempt = checkAndRecordAttempt(clientIp);
  if (!attempt.ok) {
    return Response.json(
      { message: attempt.message },
      {
        status: 429,
        headers: { "Retry-After": String(attempt.retryAfterSec) },
      },
    );
  }

  const visitorName = sanitize(typeof payload.name === "string" ? payload.name : "", 24);
  const visitorMessage = sanitize(
    typeof payload.message === "string" ? payload.message : "",
    200,
  );
  const mode = payload.mode === "roast" ? "roast" : payload.mode === "praise" ? "praise" : null;

  if (!visitorName || !visitorMessage || !mode) {
    return Response.json(
      { message: "请填写昵称、一句话，并选择夸夸或吐槽。" },
      { status: 400 },
    );
  }

  const sendOk = precheckSuccess(clientIp);
  if (!sendOk.ok) {
    return Response.json(
      { message: sendOk.message },
      {
        status: 429,
        headers: { "Retry-After": String(sendOk.retryAfterSec) },
      },
    );
  }

  try {
    /** 关卡：只审访客原话；未通过则不上墙 */
    await moderateAiWallContent({
      visitorName,
      visitorMessage,
      mode,
    });

    const { title, reply } = await generateOptionalReply({
      visitorName,
      visitorMessage,
      mode,
    });

    const card: AiWallCard = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      visitorName,
      visitorMessage,
      mode,
      title,
      reply,
    };

    await prependAiWallCard(card);
    recordSuccessfulGeneration(clientIp);

    return Response.json({ ok: true, card });
  } catch (err) {
    if (err instanceof AiWallConfigError) {
      return Response.json({ message: err.message }, { status: 503 });
    }
    if (err instanceof AiWallRejectedError) {
      await recordRejectedSubmission({
        visitorName,
        visitorMessage,
        mode,
        reason: err.reason,
        source: err.source,
      });
      return Response.json({ message: err.reason }, { status: 422 });
    }
    console.error("AI 墙生成失败:", err);
    return Response.json(
      {
        message: err instanceof Error ? err.message : "生成失败，请稍后再试。",
      },
      { status: 500 },
    );
  }
}

const FALLBACK_TITLE = "原话";
const FALLBACK_REPLY = "";

/**
 * 把被拒原话写入日志，失败只记控制台，不影响给访客的拒绝响应。
 */
async function recordRejectedSubmission(input: {
  visitorName: string;
  visitorMessage: string;
  mode: AiWallMode;
  reason: string;
  source: "heuristic" | "llm";
}): Promise<void> {
  try {
    await prependAiWallRejection({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      visitorName: input.visitorName,
      visitorMessage: input.visitorMessage,
      mode: input.mode,
      reason: input.reason,
      source: input.source,
    });
  } catch (err) {
    console.error("记录 AI 墙拒绝原文失败:", err);
  }
}

/**
 * 尽力生成附注回复；失败或回复未过审时返回空回复，不阻断原话上墙。
 */
async function generateOptionalReply(input: {
  visitorName: string;
  visitorMessage: string;
  mode: AiWallMode;
}): Promise<{ title: string; reply: string }> {
  try {
    const generated = await generateAiWallReply(input);
    await moderateAiWallContent({
      ...input,
      title: generated.title,
      reply: generated.reply,
    });
    return generated;
  } catch (err) {
    if (err instanceof AiWallRejectedError || err instanceof AiWallConfigError) {
      console.error("AI 墙附注回复未采用:", err.message);
    } else {
      console.error("AI 墙附注回复生成失败:", err);
    }
    return { title: FALLBACK_TITLE, reply: FALLBACK_REPLY };
  }
}

/**
 * 限制长度并去掉换行控制符。
 */
function sanitize(value: string, maxLen: number): string {
  return value.trim().replace(/[\r\n]+/g, " ").slice(0, maxLen);
}

/**
 * 蜜罐命中时返回的假卡片（不上墙）。
 */
function buildDecoyCard(): AiWallCard {
  return {
    id: "decoy",
    createdAt: new Date().toISOString(),
    visitorName: "访客",
    visitorMessage: "…",
    mode: "praise" satisfies AiWallMode,
    title: "收到",
    reply: "谢谢来访。",
  };
}
