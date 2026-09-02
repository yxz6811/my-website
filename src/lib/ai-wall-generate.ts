import { buildAiWallContext } from "@/content/site-profile";
import { chatCompletion, parseJsonObject } from "@/lib/ai-wall-llm";
import type { AiWallMode } from "@/lib/ai-wall-types";

export { AiWallConfigError, AiWallRejectedError } from "@/lib/ai-wall-errors";

type LlmCardPayload = {
  title: string;
  reply: string;
};

/**
 * 调用 OpenAI 兼容 Chat Completions，生成墙上的附注回复（主内容仍是访客原话）。
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
    "访客不是站长。禁止把杨曦哲的年龄、奖项、粉丝数、作品或履历说成访客的。",
    "夸夸/吐槽的对象是访客写下的那句话，以及它与本站内容的关系；第二人称只指访客。",
    "你必须严格依据提供的「站长画像」提及站长经历，不得编造。",
    "输出必须是合法 JSON 对象，不要 Markdown，不要代码围栏。字段：title（不超过 16 个汉字）、reply（60～120 字）。",
    "语气：中文、有网感、具体；引用站长真实作品时点到为止。",
    "夸夸：回应访客原话，真诚具体，避免空洞鸡汤。",
    "吐槽：善意调侃访客原话或站长设定，不人身攻击、不歧视、不辱骂。",
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
