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
import { prependAiWallCard, readAiWallCards } from "@/lib/ai-wall-store";
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
 * 生成数字卡片：先审访客输入 → 生成 → 再审卡片全文 → 通过后上墙。
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
    /** 第一关：审核访客提交，违规则不调用生成 */
    await moderateAiWallContent({
      visitorName,
      visitorMessage,
      mode,
    });

    const generated = await generateAiWallReply({
      visitorName,
      visitorMessage,
      mode,
    });

    /** 第二关：审核即将上墙的卡片全文 */
    await moderateAiWallContent({
      visitorName,
      visitorMessage,
      mode,
      title: generated.title,
      reply: generated.reply,
    });

    const card: AiWallCard = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      visitorName,
      visitorMessage,
      mode,
      title: generated.title,
      reply: generated.reply,
    };

    await prependAiWallCard(card);
    recordSuccessfulGeneration(clientIp);

    return Response.json({ ok: true, card });
  } catch (err) {
    if (err instanceof AiWallConfigError) {
      return Response.json({ message: err.message }, { status: 503 });
    }
    if (err instanceof AiWallRejectedError) {
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
