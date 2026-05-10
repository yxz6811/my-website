import nodemailer from "nodemailer";

import {
  checkAndRecordAttempt,
  getClientIp,
  precheckSuccessSend,
  recordSuccessfulSend,
} from "@/lib/message-board-guard";

type MessagePayload = {
  name?: string;
  project?: string;
  idea?: string;
  /**
   * 蜜罐字段：正常用户应保持为空；服务端若发现非空则不发信并返回假成功，用于干扰自动化脚本。
   */
  website?: string;
};

/**
 * 限制输入长度，避免异常超长内容进入邮件。
 */
function trimTo(value: string, maxLen: number): string {
  return value.trim().slice(0, maxLen);
}

/**
 * 进行最小 HTML 转义，避免用户输入被当成标签解析。
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * 构建留言板邮件 HTML，便于邮箱直接阅读。
 */
function buildHtml(payload: { name: string; project: string; idea: string }): string {
  const safeName = escapeHtml(payload.name);
  const safeProject = escapeHtml(payload.project || "（未填写）");
  const safeIdea = escapeHtml(payload.idea);
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #111827;">
      <h2 style="margin: 0 0 12px;">yangxizhe.com 新留言</h2>
      <p style="margin: 0 0 6px;"><strong>昵称：</strong>${safeName}</p>
      <p style="margin: 0 0 6px;"><strong>项目：</strong>${safeProject}</p>
      <p style="margin: 0 0 6px;"><strong>创意想法：</strong></p>
      <pre style="margin: 0; padding: 12px; background: #f3f4f6; border-radius: 8px; white-space: pre-wrap;">${safeIdea}</pre>
    </div>
  `;
}

/**
 * 处理留言提交并发送至站长邮箱。
 */
export async function POST(req: Request) {
  try {
    let body: MessagePayload;
    try {
      body = (await req.json()) as MessagePayload;
    } catch {
      return Response.json({ message: "请求格式不正确。" }, { status: 400 });
    }

    /** 蜜罐命中：假装成功，避免向站长邮箱发信，也不暴露拦截逻辑 */
    if (trimTo(body.website ?? "", 80)) {
      return Response.json({ ok: true });
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

    const name = trimTo(body.name ?? "", 40);
    const project = trimTo(body.project ?? "", 80);
    const idea = trimTo(body.idea ?? "", 1200);

    if (!name || !idea) {
      return Response.json({ message: "请填写昵称和创意想法。" }, { status: 400 });
    }

    const sendOk = precheckSuccessSend(clientIp);
    if (!sendOk.ok) {
      return Response.json(
        { message: sendOk.message },
        {
          status: 429,
          headers: { "Retry-After": String(sendOk.retryAfterSec) },
        },
      );
    }

    const user = process.env.QQ_SMTP_USER;
    const pass = process.env.QQ_SMTP_PASS;
    const to = process.env.MESSAGE_BOARD_TO ?? "3978401510@qq.com";

    if (!user || !pass) {
      return Response.json(
        { message: "服务器未配置邮箱发送能力，请联系站长配置 QQ_SMTP_USER / QQ_SMTP_PASS。" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"yangxizhe.com 留言板" <${user}>`,
      to,
      subject: `【留言板】${name} 提交了新想法`,
      text: `昵称：${name}\n项目：${project || "（未填写）"}\n\n创意想法：\n${idea}`,
      html: buildHtml({ name, project, idea }),
    });

    recordSuccessfulSend(clientIp);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: "留言发送失败，请稍后重试。" }, { status: 500 });
  }
}
