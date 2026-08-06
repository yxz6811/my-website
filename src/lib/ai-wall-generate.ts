import { buildAiWallContext } from "@/content/site-profile";
import { chatCompletion, parseJsonObject } from "@/lib/ai-wall-llm";
import type { AiWallMode } from "@/lib/ai-wall-types";

export { AiWallConfigError, AiWallRejectedError } from "@/lib/ai-wall-errors";

type LlmCardPayload = {
  title: string;
  reply: string;
};

/**
 * 调用 OpenAI 兼容 Chat Completions，生成夸夸/吐槽卡片文案。
 */
export async function generateAiWallReply(input: {
  visitorName: string;
  visitorMessage: string;
  mode: AiWallMode;
}): Promise<LlmCardPayload> {
  const modeLabel = input.mode === "praise" ? "夸夸" : "吐槽";
  const context = buildAiWallContext();

  const system = [
    "你是杨曦哲个人官网墙上的互动机器人。",
    "你必须严格依据提供的「站长画像」回答，不得编造站长没有的经历、奖项或粉丝数据。",
    "输出必须是合法 JSON 对象，不要 Markdown，不要代码围栏。字段：title（不超过 16 个汉字）、reply（80～160 字）。",
    "语气：中文、有网感、具体；引用站长真实作品或经历时点到为止。",
    "夸夸：真诚、具体、有温度，避免空洞鸡汤。",
    "吐槽：善意调侃，不人身攻击、不歧视、不辱骂；可吐槽「AI 万能论」「卷年龄」等，但要对访客原话有回应。",
    "不要输出色情、暴力、仇恨或违法内容。",
  ].join("\n");

  const user = [
    `模式：${modeLabel}`,
    `访客昵称：${input.visitorName}`,
    `访客原话：${input.visitorMessage}`,
    "",
    "站长画像：",
    context,
  ].join("\n");

  const content = await chatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: input.mode === "roast" ? 0.85 : 0.7,
  });

  return parseCardPayload(content);
}

/**
 * 解析卡片 JSON。
 */
function parseCardPayload(content: string): LlmCardPayload {
  const obj = parseJsonObject(content);
  const title = typeof obj.title === "string" ? obj.title.trim().slice(0, 24) : "";
  const reply = typeof obj.reply === "string" ? obj.reply.trim().slice(0, 280) : "";
  if (!title || !reply) {
    throw new Error("AI 返回不完整，请稍后再试。");
  }
  return { title, reply };
}
