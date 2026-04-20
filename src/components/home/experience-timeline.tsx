"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ExperienceItem } from "@/content/site-profile";

type ExperienceTimelineProps = {
  /** 经历列表 */
  items: ExperienceItem[];
};

/**
 * 时间轴列表：子项依次淡入，带轻微模糊与位移；滚出视口时可回落。
 * 视口判定偏宽，减轻长时间停留在模糊过渡带的感觉。
 */
export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      className="relative mt-12 list-none space-y-8 pl-0 before:absolute before:left-[15px] before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-sky-300/50 before:via-white/18 before:to-emerald-300/35 md:before:left-[19px]"
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.08, margin: "0px 0px -5% 0px", once: false }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.085, delayChildren: 0.06 },
        },
      }}
    >
      {items.map((item) => (
        <motion.li
          key={`${item.period}-${item.org}-${item.role}`}
          className="relative pl-10 md:pl-14"
          variants={{
            hidden: reduce
              ? { opacity: 0.65 }
              : { opacity: 0.18, y: 24, filter: "blur(4px)" },
            show: reduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduce ? undefined : { y: -4 }}
        >
          <span className="absolute left-0 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-sky-200/20 bg-slate-950 shadow-[0_0_0_6px_rgba(5,11,21,0.95)] md:top-6">
            <span className="h-3 w-3 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.85)]" />
          </span>
          <article className="soft-card rounded-[1.75rem] p-6 md:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="inline-flex rounded-full border border-sky-200/12 bg-sky-300/8 px-3 py-1 text-sm font-medium text-sky-200/90">
                  {item.period}
                </p>
                <p className="mt-4 text-lg font-semibold text-white md:text-xl">
                  {item.role}
                </p>
                <p className="mt-1 text-sm text-zinc-500 md:text-base">{item.org}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm leading-7 text-zinc-400 md:text-base md:leading-8">
              {item.bullets.map((b, j) => (
                <li key={`${item.period}-${j}`} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        </motion.li>
      ))}
    </motion.ol>
  );
}
