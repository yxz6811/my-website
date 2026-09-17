"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { AiWallCard, AiWallMode } from "@/lib/ai-wall-types";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type FormState = {
  name: string;
  message: string;
  mode: AiWallMode;
  /** 蜜罐 */
  website: string;
};

/**
 * AI 夸夸/吐槽墙：审核通过后展示访客原话，机器人回复为附注。
 */
export function AiWallSection() {
  const reduce = useReducedMotion();
  const [cards, setCards] = useState<AiWallCard[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState<FormState>({
    name: "",
    message: "",
    mode: "praise",
    website: "",
  });

  /**
   * 拉取墙上卡片列表。
   */
  const loadCards = useCallback(async () => {
    try {
      const res = await fetch("/api/ai-wall", { cache: "no-store" });
      const data = (await res.json()) as { cards?: AiWallCard[]; configured?: boolean };
      setCards(Array.isArray(data.cards) ? data.cards : []);
      setConfigured(data.configured !== false);
    } catch {
      setFeedback("卡片墙加载失败，可刷新重试。");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadCards();
  }, [loadCards]);

  /**
   * 提交访客一句话，生成卡片并贴墙。
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    if (!form.name.trim() || !form.message.trim()) {
      setSubmitStatus("error");
      setFeedback("请填写昵称和一句话。");
      return;
    }

    try {
      setSubmitStatus("submitting");
      const res = await fetch("/api/ai-wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          message: form.message,
          mode: form.mode,
          website: form.website,
        }),
      });
      const data = (await res.json()) as { message?: string; card?: AiWallCard };
      if (!res.ok) {
        throw new Error(data.message ?? "生成失败，请稍后再试。");
      }
      if (data.card && data.card.id !== "decoy") {
        setCards((prev) => [data.card!, ...prev.filter((c) => c.id !== data.card!.id)]);
      }
      setSubmitStatus("success");
      setFeedback("已贴上墙。");
      setForm((prev) => ({ ...prev, message: "", website: "" }));
    } catch (error) {
      setSubmitStatus("error");
      setFeedback(error instanceof Error ? error.message : "生成失败，请稍后再试。");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[rgba(12,16,24,0.92)] p-4 md:p-9">
      <div className="relative">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">AI WALL</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white md:text-[2.05rem]">
              AI 夸夸 / 吐槽墙
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
              丢下一句话。通过安全审核后，墙上展示的是你的原话；无意义或违规内容会被拒绝。机器人会在旁边夸夸或吐槽。
            </p>
          </div>
          {!configured ? (
            <p className="rounded-2xl border border-amber-200/20 bg-amber-200/5 px-3 py-2 text-xs text-amber-100/90">
              站长尚未配置 AI_API_KEY，生成暂不可用。
            </p>
          ) : null}
        </div>

        <form className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
          <label
            className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
            aria-hidden="true"
          >
            <span>网站</span>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-300">昵称</span>
              <input
                className="rounded-2xl border border-white/12 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)]/45"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                maxLength={24}
                placeholder="怎么称呼你"
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-300">一句话</span>
              <input
                className="rounded-2xl border border-white/12 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)]/45"
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                maxLength={200}
                placeholder="例如：薯医是怎么想到的？"
                required
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div
              className="inline-flex rounded-full border border-white/12 p-1"
              role="group"
              aria-label="互动模式"
            >
              <button
                type="button"
                className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  form.mode === "praise"
                    ? "bg-white text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                onClick={() => setForm((prev) => ({ ...prev, mode: "praise" }))}
              >
                夸夸
              </button>
              <button
                type="button"
                className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  form.mode === "roast"
                    ? "bg-white text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                onClick={() => setForm((prev) => ({ ...prev, mode: "roast" }))}
              >
                吐槽
              </button>
            </div>
            <button
              type="submit"
              disabled={submitStatus === "submitting" || !configured}
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/14 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitStatus === "submitting" ? "审核中…" : "贴上墙"}
            </button>
          </div>

          {feedback ? (
            <p
              className={`md:col-span-2 text-sm ${
                submitStatus === "success" ? "text-emerald-300/90" : "text-rose-300/90"
              }`}
            >
              {feedback}
            </p>
          ) : null}
        </form>

        <div className="mt-8">
          {loadingList ? (
            <p className="text-sm text-zinc-500">加载卡片墙…</p>
          ) : cards.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/12 px-4 py-8 text-center text-sm text-zinc-500">
              墙上还空着——通过审核的原话会贴在这里。
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {cards.map((card) => (
                  <motion.li
                    key={card.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="surface-panel flex flex-col rounded-[1.5rem] p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ${
                          card.mode === "praise"
                            ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                            : "bg-white/8 text-zinc-300"
                        }`}
                      >
                        {card.mode === "praise" ? "夸夸" : "吐槽"}
                      </span>
                      <time className="text-[11px] text-zinc-600" dateTime={card.createdAt}>
                        {formatCardTime(card.createdAt)}
                      </time>
                    </div>
                    <p className="mt-3 text-base font-medium leading-7 tracking-tight text-white">
                      {card.visitorMessage}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-zinc-500">
                      {card.visitorName}
                    </p>
                    {card.reply ? (
                      <p className="mt-4 border-t border-white/8 pt-3 text-sm leading-6 text-zinc-400">
                        <span className="mr-2 text-[11px] tracking-wide text-zinc-600">
                          {card.mode === "praise" ? "机器人夸夸" : "机器人吐槽"}
                        </span>
                        {card.reply}
                      </p>
                    ) : null}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * 卡片时间展示（本地时区短格式）。
 */
function formatCardTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
