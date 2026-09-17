import { promises as fs } from "node:fs";
import path from "node:path";

import {
  AI_WALL_MAX_CARDS,
  AI_WALL_MAX_REJECTIONS,
  type AiWallCard,
  type AiWallRejection,
} from "@/lib/ai-wall-types";

const globalStore = globalThis as typeof globalThis & {
  __aiWallWriteChain?: Promise<unknown>;
  __aiWallRejectionWriteChain?: Promise<unknown>;
};

/**
 * 解析卡片持久化路径（可用环境变量覆盖，便于 VPS 写到可写目录）。
 */
function resolveStorePath(): string {
  if (process.env.AI_WALL_DATA_PATH?.trim()) {
    return process.env.AI_WALL_DATA_PATH.trim();
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "ai-wall.json");
}

/**
 * 解析拒绝日志路径。
 */
function resolveRejectionPath(): string {
  if (process.env.AI_WALL_REJECTIONS_PATH?.trim()) {
    return process.env.AI_WALL_REJECTIONS_PATH.trim();
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "ai-wall-rejections.json");
}

/**
 * 确保目录存在。
 */
async function ensureParentDir(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

/**
 * 读取墙上全部卡片（新→旧）。文件不存在时返回空数组。
 */
export async function readAiWallCards(): Promise<AiWallCard[]> {
  const filePath = resolveStorePath();
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAiWallCard);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    console.error("读取 AI 墙失败:", err);
    return [];
  }
}

/**
 * 写入新卡片到墙顶，并裁剪到上限。通过写链串行化，避免并发覆盖。
 */
export async function prependAiWallCard(card: AiWallCard): Promise<AiWallCard[]> {
  const prev = globalStore.__aiWallWriteChain ?? Promise.resolve();
  const next = prev.then(async () => {
    const existing = await readAiWallCards();
    const cards = [card, ...existing].slice(0, AI_WALL_MAX_CARDS);
    const filePath = resolveStorePath();
    await ensureParentDir(filePath);
    await fs.writeFile(filePath, `${JSON.stringify(cards, null, 2)}\n`, "utf8");
    return cards;
  });
  globalStore.__aiWallWriteChain = next.catch(() => undefined);
  return next;
}

/**
 * 读取拒绝日志（新→旧）。
 */
export async function readAiWallRejections(): Promise<AiWallRejection[]> {
  const filePath = resolveRejectionPath();
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAiWallRejection);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    console.error("读取 AI 墙拒绝日志失败:", err);
    return [];
  }
}

/**
 * 追加一条拒绝记录，供站长事后核对误判。
 */
export async function prependAiWallRejection(
  record: AiWallRejection,
): Promise<void> {
  const prev = globalStore.__aiWallRejectionWriteChain ?? Promise.resolve();
  const next = prev.then(async () => {
    const existing = await readAiWallRejections();
    const records = [record, ...existing].slice(0, AI_WALL_MAX_REJECTIONS);
    const filePath = resolveRejectionPath();
    await ensureParentDir(filePath);
    await fs.writeFile(filePath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  });
  globalStore.__aiWallRejectionWriteChain = next.catch((err) => {
    console.error("写入 AI 墙拒绝日志失败:", err);
  });
  await next;
}

/**
 * 运行时校验卡片结构。
 */
function isAiWallCard(value: unknown): value is AiWallCard {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.createdAt === "string" &&
    typeof c.visitorName === "string" &&
    typeof c.visitorMessage === "string" &&
    (c.mode === "praise" || c.mode === "roast") &&
    typeof c.title === "string" &&
    typeof c.reply === "string"
  );
}

/**
 * 运行时校验拒绝记录结构。
 */
function isAiWallRejection(value: unknown): value is AiWallRejection {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.createdAt === "string" &&
    typeof c.visitorName === "string" &&
    typeof c.visitorMessage === "string" &&
    (c.mode === "praise" || c.mode === "roast") &&
    typeof c.reason === "string" &&
    (c.source === "heuristic" || c.source === "llm")
  );
}
