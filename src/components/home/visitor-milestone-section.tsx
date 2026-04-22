"use client";

import { useEffect, useState } from "react";
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
    </section>
  );
}
