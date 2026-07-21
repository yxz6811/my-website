"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ExperienceMoreItem } from "@/content/site-profile";

type ExperienceTimelineProps = {
  /** 更多经历列表 */
  items: ExperienceMoreItem[];
  /**
   * 紧凑模式：用于折叠区内的次要条目。
   */
  compact?: boolean;
};

/**
 * 时间轴列表：用于「更多经历」；条目为轻量结构（标题 + 场合 + 可选一句）。
 */
export function ExperienceTimeline({ items, compact = false }: ExperienceTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      className={`relative list-none space-y-6 pl-0 before:absolute before:left-[15px] before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-sky-300/40 before:via-white/14 before:to-emerald-300/30 md:before:left-[19px] ${
        compact ? "mt-6" : "mt-12 space-y-8"
      }`}
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.08, margin: "0px 0px -5% 0px", once: false }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.08, delayChildren: 0.04 },
        },
      }}
    >
      {items.map((item) => (
        <motion.li
          key={`${item.period}-${item.headline}-${item.context}`}
          className="relative pl-10 md:pl-14"
          variants={{
            hidden: reduce
              ? { opacity: 0.65 }
              : { opacity: 0.18, y: 20, filter: "blur(3px)" },
            show: reduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="absolute left-0 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-sky-200/20 bg-slate-950 shadow-[0_0_0_6px_rgba(5,11,21,0.95)]">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-300/90 shadow-[0_0_14px_rgba(125,211,252,0.7)]" />
          </span>
          <article className="rounded-[1.35rem] border border-white/8 bg-white/[0.025] px-5 py-4 md:px-6 md:py-5">
            <p className="inline-flex rounded-full border border-sky-200/10 bg-sky-300/6 px-2.5 py-0.5 text-xs font-medium text-sky-200/80">
              {item.period}
            </p>
            <p className="mt-3 text-base font-semibold text-white md:text-lg">{item.headline}</p>
            <p className="mt-1 text-sm text-zinc-500">{item.context}</p>
            {item.note ? (
              <p className="mt-1.5 text-sm leading-6 text-zinc-400">{item.note}</p>
            ) : null}
          </article>
        </motion.li>
      ))}
    </motion.ol>
  );
}
