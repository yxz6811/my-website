"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COUNTER_NAMESPACE = "yxz-portfolio-official";
const COUNTER_KEY = "page-visits-v1";
const SESSION_KEY = "yxz-visit-counted";
// countapi.xyz was permanently shut down in 2023; abacus.jasoncameron.dev is a
// drop-in replacement that returns the same `{ value: number }` response shape.
const HIT_API = `https://abacus.jasoncameron.dev/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;
const GET_API = `https://abacus.jasoncameron.dev/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;

/**
 * 计数 API 返回体。
 */
type CounterResponse = { value: number };
type SubmitStatus = "idle" | "submitting" | "success" | "error";
type MessageForm = {
  name: string;
  project: string;
  idea: string;
};

/**
 * 格式化大数字，提升展示可读性。
 */
function formatCount(value: number): string {
  return new Intl.NumberFormat("zh-CN").format(value);
}

/**
 * 首页中段的创意到访页：展示访客位次与动态数字。
 */
export function VisitorMilestoneSection() {
  const reduce = useReducedMotion();
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [visitSequence, setVisitSequence] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState<MessageForm>({
    name: "",
    project: "",
    idea: "",
  });

  useEffect(() => {
    /**
     * 更新展示值：保留数字滚动观感，但数据源为真实计数。
     */
    const animateTo = (target: number) => {
      if (reduce) {
        setTotalCount(target);
        return;
      }

      // Keep the "roll up" feel for larger targets, but avoid jumping from 0
      // to a tiny number (1–5) which looked abrupt on a fresh counter.
      const runway = target <= 20 ? Math.min(target, 5) : 72;
      const start = Math.max(target - runway, 0);
      const duration = 950;
      const beginAt = performance.now();

      const animate = (ts: number) => {
        const progress = Math.min(1, (ts - beginAt) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setTotalCount(Math.floor(start + (target - start) * eased));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    /**
     * 拉取真实访问计数：同一会话首次进入递增，后续仅查询。
     */
    const fetchRealCount = async () => {
      try {
        const shouldIncrement = !window.sessionStorage.getItem(SESSION_KEY);
        const endpoint = shouldIncrement ? HIT_API : GET_API;
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Counter API failed: ${res.status}`);
        }

        const data = (await res.json()) as CounterResponse;
        if (typeof data.value !== "number" || Number.isNaN(data.value)) {
          throw new Error("Invalid counter response");
        }

        if (shouldIncrement) {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        }

        // Always surface the current sequence — previously this only ran on
        // the HIT branch, so a same-session refresh left the copy stuck on
        // "实时计数加载中" forever even after totalCount animated in.
        setVisitSequence(data.value);
        animateTo(data.value);
      } catch {
        setTotalCount(null);
        setVisitSequence(null);
      }
    };

    fetchRealCount();
  }, [reduce]);

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

      <div className="relative grid gap-5 md:grid-cols-[1.08fr_0.92fr] md:items-center md:gap-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-sky-200/80">Visitor Milestone</p>
          <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.04em] text-white md:text-[2.1rem]">
            你正在点亮
            <span className="text-hero-accent ml-2">yangxizhe.com</span>
            的到访里程碑
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
            你不是一次普通访问，而是这段技术旅程的共同见证者。每次点击、每次停留，都在让这个站点变得更完整。
          </p>
        </div>

        <motion.div
          className="rounded-[1.5rem] border border-white/12 bg-white/[0.03] p-4 md:p-7"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">页面访问次数</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            {totalCount === null ? "--" : formatCount(totalCount)}
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            {visitSequence === null ? (
              <>实时计数加载中。</>
            ) : (
              <>
                你是这个页面记录到的第{" "}
                <span className="font-semibold text-sky-200">{formatCount(visitSequence)}</span> 次访问。
              </>
            )}
          </p>
        </motion.div>
      </div>

      <div className="relative mt-6 rounded-[1.5rem] border border-white/12 bg-white/[0.03] p-4 md:mt-8 md:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">Message Board</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white md:text-2xl">
          留言你的项目与创意想法
        </h3>
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
              placeholder="例如：小杨"
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

          <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
