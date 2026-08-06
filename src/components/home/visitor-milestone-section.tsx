"use client";

import { useEffect, useRef, useState } from "react";
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
  const rafRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
        if (!mountedRef.current) return;
        const progress = Math.min(1, (ts - beginAt) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setTotalCount(Math.floor(start + (target - start) * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
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

        setVisitSequence(data.value);
        animateTo(data.value);
      } catch (err) {
        console.error("访问计数获取失败:", err);
        setTotalCount(null);
        setVisitSequence(null);
      }
    };

    fetchRealCount();
    // Only run on mount — reduce changes are handled inside animateTo via the
    // closure over the latest reduce value, and we cancel any running RAF.
  }, []);

  return (
    <section className="surface-panel relative overflow-hidden rounded-2xl p-4 md:p-9">
      <div className="relative grid gap-5 md:grid-cols-[1.08fr_0.92fr] md:items-center md:gap-8">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">VISITORS</p>
          <h2 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.04em] text-white md:text-[2.1rem]">
            到访里程碑
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            每一次打开，都记一笔。谢谢你来到 yangxizhe.com。
          </p>
        </div>

        <motion.div
          className="rounded-xl border border-white/10 bg-black/20 p-4 md:p-6"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs tracking-[0.18em] text-zinc-500">页面访问次数</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            {totalCount === null ? "--" : formatCount(totalCount)}
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            {visitSequence === null ? (
              <>实时计数加载中。</>
            ) : (
              <>
                你是第{" "}
                <span className="font-semibold text-[var(--accent)]">{formatCount(visitSequence)}</span>{" "}
                次访问。
              </>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
