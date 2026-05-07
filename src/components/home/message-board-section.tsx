"use client";

import { useState, type FormEvent } from "react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";
type MessageForm = {
  name: string;
  project: string;
  idea: string;
};

/**
 * 首页留言板：收集项目与创意想法并提交到邮件接口。
 */
export function MessageBoardSection() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState<MessageForm>({
    name: "",
    project: "",
    idea: "",
  });

  /**
   * 更新留言板表单字段。
   */
  const handleFieldChange = (field: keyof MessageForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * 提交留言：将项目与创意想法发送到站长邮箱。
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    if (!form.name.trim() || !form.idea.trim()) {
      setSubmitStatus("error");
      setFeedback("请至少填写昵称和创意想法。");
      return;
    }

    try {
      setSubmitStatus("submitting");
      const res = await fetch("/api/message-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? "发送失败，请稍后再试。");
      }

      setSubmitStatus("success");
      setFeedback("留言已送达，感谢你的分享！");
      setForm({ name: "", project: "", idea: "" });
    } catch (error) {
      setSubmitStatus("error");
      setFeedback(error instanceof Error ? error.message : "发送失败，请稍后再试。");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(18,31,49,0.9),rgba(8,15,26,0.85))] p-4 md:p-10">
      <div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-cyan-300/18 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-violet-300/15 blur-3xl" aria-hidden />

      <div className="relative rounded-[1.5rem] border border-white/12 bg-white/[0.03] p-4 md:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">Message Board</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white md:text-[2.1rem]">
          留言你的项目与创意想法
        </h2>
        <p className="mt-2 text-sm leading-7 text-zinc-300">
          你的留言会直接发送到站长邮箱，欢迎分享你正在做的项目、想尝试的点子或合作想法。
        </p>

        <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-200">你的昵称</span>
            <input
              className="rounded-xl border border-white/12 bg-slate-950/45 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/45"
              value={form.name}
              onChange={(event) => handleFieldChange("name", event.target.value)}
              maxLength={40}
              placeholder="例如：yxz"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-200">你的项目（可选）</span>
            <input
              className="rounded-xl border border-white/12 bg-slate-950/45 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/45"
              value={form.project}
              onChange={(event) => handleFieldChange("project", event.target.value)}
              maxLength={80}
              placeholder="例如：AI 学习助手"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm text-zinc-200">创意想法</span>
            <textarea
              className="min-h-28 rounded-xl border border-white/12 bg-slate-950/45 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/45"
              value={form.idea}
              onChange={(event) => handleFieldChange("idea", event.target.value)}
              maxLength={1200}
              placeholder="写下你的项目方向、灵感来源，或希望交流的话题..."
              required
            />
          </label>

          <div className="flex flex-col gap-2 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitStatus === "submitting"}
              className="inline-flex w-fit items-center rounded-full border border-cyan-200/35 bg-cyan-200/10 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitStatus === "submitting" ? "发送中..." : "提交留言"}
            </button>
            {feedback ? (
              <p className={submitStatus === "success" ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
                {feedback}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
