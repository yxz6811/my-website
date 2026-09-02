/**
 * OpenAI 兼容 Chat Completions 公共调用。
 */

import { AiWallConfigError } from "@/lib/ai-wall-errors";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatCompletionOptions = {
  messages: ChatMessage[];
  temperature?: number;
  /** 是否强制 JSON object（部分兼容接口可能不支持） */
  jsonObject?: boolean;
};

/**
 * 读取 AI 环境配置；缺 key 时抛配置错误。
 */
export function getAiClientConfig(): { apiKey: string; baseUrl: string; model: string } {
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!apiKey) {
    throw new AiWallConfigError(
      "服务器未配置 AI_API_KEY，请联系站长完成配置后再试。",
    );
  }
  const baseUrl = (
    process.env.AI_BASE_URL?.trim() || "https://open.bigmodel.cn/api/paas/v4"
  ).replace(/\/$/, "");
  const model = process.env.AI_MODEL?.trim() || "GLM-4-Flash-250414";
  return { apiKey, baseUrl, model };
}

/**
 * 调用 chat/completions，返回助手文本内容。
 */
export async function chatCompletion(options: ChatCompletionOptions): Promise<string> {
  const { apiKey, baseUrl, model } = getAiClientConfig();

  const body: Record<string, unknown> = {
    model,
    temperature: options.temperature ?? 0.4,
    messages: options.messages,
  };
  if (options.jsonObject !== false) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("AI API 失败:", res.status, detail.slice(0, 500));
    throw new Error("AI 暂时忙不过来，请稍后再试。");
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("AI 返回为空，请稍后再试。");
  }
  return content;
}

/**
 * 解析模型返回的 JSON 对象；允许从文本中提取首个对象。
 */
export function parseJsonObject(content: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI 返回格式异常，请稍后再试。");
    parsed = JSON.parse(match[0]);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("AI 返回格式异常，请稍后再试。");
  }
  return parsed as Record<string, unknown>;
}
