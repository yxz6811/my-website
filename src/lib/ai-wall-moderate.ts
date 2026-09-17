import { AiWallRejectedError } from "@/lib/ai-wall-errors";
import { chatCompletion, parseJsonObject } from "@/lib/ai-wall-llm";
import type { AiWallMode } from "@/lib/ai-wall-types";

type ModerateInput = {
  visitorName: string;
  visitorMessage: string;
  mode: AiWallMode;
  /** 若已有生成结果，一并送审 */
  title?: string;
  reply?: string;
};

type ModerateResult = {
  allowed: boolean;
  /** 拒绝时给访客看的短原因；通过时忽略 */
  reason?: string;
};

const FALLBACK_REJECT_REASON = "内容未通过安全审核，请换一句话再试。";
const MEANINGLESS_REASON = "这句话太短或没有实际内容，请写完整一点再试。";

/**
 * 上墙前审核：先拦无意义碎片，再交给模型审安全与是否有完整意思。
 */
export async function moderateAiWallContent(input: ModerateInput): Promise<void> {
  const hasGenerated = Boolean(input.title && input.reply);
  if (!hasGenerated) {
    rejectIfMeaningless(input.visitorMessage);
  }

  const modeLabel = input.mode === "praise" ? "夸夸" : "吐槽";

  const system = [
    "你是个人官网「AI 夸夸/吐槽墙」的内容安全审核员。",
    "任务：判断待上墙内容是否可公开展示。",
    "必须拒绝：色情低俗、赌博毒品、暴力恐怖、仇恨歧视、人身攻击与辱骂、自残教唆、未成年人不当内容、诈骗与钓鱼、垃圾广告刷屏、泄露他人隐私、明显违法政治煽动。",
    "必须拒绝无意义内容：单字母/数字、乱敲键盘、纯测试（如 test、aaa、123、asdf）、没有完整意思的碎片。",
    "应当放行：正常提问、夸赞、关于作品/学习/黑客松的讨论、善意吐槽与轻松调侃（不涉及人身攻击）。",
    "应当放行：短但有明确意思的中文（如「加油」「赞」）。",
    "输出合法 JSON，不要 Markdown。字段：",
    "allowed（boolean）、reason（string，仅当 allowed=false；中文，一句，不超过 40 字，语气克制，不复述违规原文）。",
  ].join("\n");

  const userParts = [
    `模式：${modeLabel}`,
    `访客昵称：${input.visitorName}`,
    `访客原话：${input.visitorMessage}`,
  ];
  if (hasGenerated) {
    userParts.push(`卡片标题：${input.title}`);
    userParts.push(`AI 回复：${input.reply}`);
    userParts.push("请只审核这段 AI 回复是否可公开展示；访客原话已通过审核。");
  } else {
    userParts.push("请审核访客提交的昵称与原话：安全、且有完整意思才允许。");
  }

  const raw = await chatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: userParts.join("\n") },
    ],
    temperature: 0,
  });

  const obj = parseJsonObject(raw);
  const allowed = obj.allowed === true;
  if (allowed) return;

  const reason =
    typeof obj.reason === "string" && obj.reason.trim()
      ? obj.reason.trim().slice(0, 80)
      : FALLBACK_REJECT_REASON;
  throw new AiWallRejectedError(reason, "llm");
}

/**
 * 规则拦截明显无意义输入，避免浪费模型调用。
 */
function rejectIfMeaningless(message: string): void {
  const text = message.trim();
  const compact = text.replace(/\s+/g, "");
  const lettersAndDigits = compact.replace(/[^\p{L}\p{N}]/gu, "");
  const hasHan = /\p{Script=Han}/u.test(compact);

  if (lettersAndDigits.length === 0) {
    throw new AiWallRejectedError(MEANINGLESS_REASON, "heuristic");
  }

  if (/^[\d.,]+$/u.test(compact)) {
    throw new AiWallRejectedError(MEANINGLESS_REASON, "heuristic");
  }

  if (!hasHan && lettersAndDigits.length < 4) {
    throw new AiWallRejectedError(MEANINGLESS_REASON, "heuristic");
  }

  if (/^(.)\1{2,}$/u.test(compact)) {
    throw new AiWallRejectedError(MEANINGLESS_REASON, "heuristic");
  }

  const unique = new Set([...compact]).size;
  if (compact.length >= 4 && unique <= 2) {
    throw new AiWallRejectedError(MEANINGLESS_REASON, "heuristic");
  }
}

export type { ModerateResult };
