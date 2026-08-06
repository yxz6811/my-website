/**
 * AI 墙相关错误类型。
 */

/** 配置缺失（如未设置 API Key） */
export class AiWallConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiWallConfigError";
  }
}

/** 审核未通过，内容不上墙 */
export class AiWallRejectedError extends Error {
  /** 可展示给访客的原因（已脱敏、简短） */
  readonly reason: string;

  constructor(reason: string) {
    super(reason);
    this.name = "AiWallRejectedError";
    this.reason = reason;
  }
}
