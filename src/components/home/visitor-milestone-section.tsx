"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const VISITOR_BASE = 128_000;
const VISITOR_DAY_STEP = 173;

/**
 * 根据当前时间估算一个“网站到访总人数”基线值。
 */
function estimateBaseVisitors(now: Date): number {
  const start = Date.UTC(2026, 0, 1);
  const dayIndex = Math.max(0, Math.floor((now.getTime() - start) / 86_400_000));
  const minuteOfDay = now.getHours() * 60 + now.getMinutes();
  return VISITOR_BASE + dayIndex * VISITOR_DAY_STEP + Math.floor(minuteOfDay / 3);
}

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
  const [todayRank, setTodayRank] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const base = estimateBaseVisitors(now);
    const minuteOfDay = now.getHours() * 60 + now.getMinutes();
    const estimatedTodayRank = 16 + Math.floor(minuteOfDay / 10);

    const boostKey = "yxz-visitor-boost";
    const sessionKey = "yxz-visitor-session-hit";
    const existingBoost = window.localStorage.getItem(boostKey);
    const boost = existingBoost ? Number(existingBoost) : 20 + Math.floor(Math.random() * 66);

    if (!existingBoost) {
      window.localStorage.setItem(boostKey, String(boost));
    }

    const sessionBonus = window.sessionStorage.getItem(sessionKey) ? 0 : 1;
    if (!window.sessionStorage.getItem(sessionKey)) {
      window.sessionStorage.setItem(sessionKey, "1");
    }

    const target = base + boost + sessionBonus;
    setTodayRank(estimatedTodayRank);

    if (reduce) {
      setTotalCount(target);
      return;
    }

    const start = Math.max(target - 72, 0);
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
  }, [reduce]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(18,31,49,0.9),rgba(8,15,26,0.85))] p-7 md:p-10">
      <div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-cyan-300/18 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-violet-300/15 blur-3xl" aria-hidden />

      <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-sky-200/80">Visitor Milestone</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.15rem]">
            你正在点亮
            <span className="text-hero-accent ml-2">yangxizhe.com</span>
            的到访里程碑
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
            你不是一次普通访问，而是这段技术旅程的共同见证者。每次点击、每次停留，都在让这个站点变得更完整。
          </p>
        </div>

        <motion.div
          className="rounded-[1.5rem] border border-white/12 bg-white/[0.03] p-6 md:p-7"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">估算总访客</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            {totalCount === null ? "--" : formatCount(totalCount)}
          </p>
          <p className="mt-3 text-sm text-zinc-300">
            你大约是今天第{" "}
            <span className="font-semibold text-sky-200">{todayRank === null ? "--" : formatCount(todayRank)}</span>{" "}
            位访客。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
