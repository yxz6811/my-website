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

/**
 * 上墙前 AI 审核：拦截违法、色情、仇恨、人身攻击、隐私泄露、刷屏广告等。
 * 善意吐槽、正常调侃应放行。
 */
export async function moderateAiWallContent(input: ModerateInput): Promise<void> {
  const modeLabel = input.mode === "praise" ? "夸夸" : "吐槽";
  const hasGenerated = Boolean(input.title && input.reply);

  const system = [
    "你是个人官网「AI 夸夸/吐槽墙」的内容安全审核员。",
    "任务：判断待上墙内容是否可公开展示。",
    "必须拒绝：色情低俗、赌博毒品、暴力恐怖、仇恨歧视、人身攻击与辱骂、自残教唆、未成年人不当内容、诈骗与钓鱼、垃圾广告刷屏、泄露他人隐私、明显违法政治煽动。",
    "应当放行：正常提问、夸赞、关于作品/学习/黑客松的讨论、善意吐槽与轻松调侃（不涉及人身攻击）。",
    "输出合法 JSON，不要 Markdown。字段：",
    'allowed（boolean）、reason（string，仅当 allowed=false；中文，一句，不超过 40 字，语气克制，不复述违规原文）。',
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
    userParts.push("请只审核访客提交的昵称与原话是否可公开展示。");
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
  throw new AiWallRejectedError(reason);
}

export type { ModerateResult };
