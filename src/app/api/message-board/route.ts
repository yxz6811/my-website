import nodemailer from "nodemailer";

import {
  checkAndRecordAttempt,
  getClientIp,
  precheckSuccessSend,
  recordSuccessfulSend,
} from "@/lib/message-board-guard";

type MessagePayload = {
  name?: unknown;
  project?: unknown;
  idea?: unknown;
  /**
   * 蜜罐字段：正常用户应保持为空；服务端若发现非空则不发信并返回假成功，用于干扰自动化脚本。
   */
  website?: unknown;
};

const MAX_BODY_SIZE = 32 * 1024; // 32 KB

/**
 * 限制输入长度，并移除换行等控制字符，避免异常内容进入邮件。
 */
function trimTo(value: string, maxLen: number): string {
  return value.trim().slice(0, maxLen);
}

function sanitize(value: string, maxLen: number): string {
  return value.trim().replace(/[\r\n]/g, "").slice(0, maxLen);
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

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const user = process.env.QQ_SMTP_USER;
    const pass = process.env.QQ_SMTP_PASS;
    if (!user || !pass) return null;
    transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

/**
 * 处理留言提交并发送至站长邮箱。
 */
export async function POST(req: Request) {
  // Content-Type 校验
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json(
      { message: "仅支持 JSON 格式的请求。" },
      { status: 415 },
    );
  }

  // 请求体大小限制
  const contentLength = parseInt(req.headers.get("content-length") ?? "0", 10);
  if (contentLength > MAX_BODY_SIZE) {
    return Response.json(
      { message: "请求体过大。" },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "请求格式不正确。" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { message: "请提供有效的 JSON 对象。" },
      { status: 400 },
    );
  }

  const payload = body as Record<string, unknown>;

  /** 蜜罐命中：假装成功，避免向站长邮箱发信，也不暴露拦截逻辑 */
  if (typeof payload.website === "string" && trimTo(payload.website, 80)) {
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

  const rawName = payload.name;
  const rawProject = payload.project;
  const rawIdea = payload.idea;

  if (typeof rawName !== "string" || typeof rawIdea !== "string") {
    return Response.json(
      { message: "请填写昵称和创意想法。" },
      { status: 400 },
    );
  }

  const name = sanitize(rawName, 40);
  const project = sanitize(
    typeof rawProject === "string" ? rawProject : "",
    80,
  );
  const idea = sanitize(rawIdea, 1200);

  if (!name || !idea) {
    return Response.json(
      { message: "请填写昵称和创意想法。" },
      { status: 400 },
    );
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

  const transport = getTransporter();
  if (!transport) {
    return Response.json(
      {
        message:
          "服务器未配置邮箱发送能力，请联系站长配置 QQ_SMTP_USER / QQ_SMTP_PASS。",
      },
      { status: 500 },
    );
  }

  const to = process.env.MESSAGE_BOARD_TO;
  if (!to) {
    console.error("MESSAGE_BOARD_TO 环境变量未设置");
    return Response.json(
      { message: "留言发送失败，请稍后重试。" },
      { status: 500 },
    );
  }

  const user = process.env.QQ_SMTP_USER!;

  try {
    await transport.sendMail({
      from: `"yangxizhe.com 留言板" <${user}>`,
      to,
      subject: `【留言板】${name} 提交了新想法`,
      text: `昵称：${name}\n项目：${project || "（未填写）"}\n\n创意想法：\n${idea}`,
      html: buildHtml({ name, project, idea }),
    });

    recordSuccessfulSend(clientIp);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("邮件发送失败:", err);
    return Response.json(
      { message: "留言发送失败，请稍后重试。" },
      { status: 500 },
    );
  }
}
