/**
 * AI 夸夸/吐槽墙：卡片类型与常量。
 */

/** 互动模式：夸夸或吐槽 */
export type AiWallMode = "praise" | "roast";

/** 墙上数字卡片 */
export type AiWallCard = {
  /** 稳定唯一 id */
  id: string;
  /** ISO 时间 */
  createdAt: string;
  /** 访客昵称 */
  visitorName: string;
  /** 访客原话 */
  visitorMessage: string;
  /** 夸夸 / 吐槽 */
  mode: AiWallMode;
  /** 卡片短标题 */
  title: string;
  /** AI 回复正文 */
  reply: string;
};

/** 单次请求体上限 */
export const AI_WALL_MAX_BODY_SIZE = 16 * 1024;
/** 墙上最多保留卡片数（超出丢弃最旧） */
export const AI_WALL_MAX_CARDS = 80;
/** 列表接口最多返回条数 */
export const AI_WALL_LIST_LIMIT = 36;
