"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ExperienceItem } from "@/content/site-profile";

type ExperienceTimelineProps = {
  /** 经历列表 */
  items: ExperienceItem[];
};

/**
 * 时间轴列表：子项依次淡入，带轻微模糊与位移；滚出视口时可回落。
 */
export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      className="relative mt-12 list-none space-y-12 pl-0 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-cyan-500/50 before:via-violet-500/30 before:to-emerald-500/40 md:before:left-[9px]"
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.12, margin: "0px 0px -10% 0px", once: false }}
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
          className="relative pl-8 md:pl-10"
          variants={{
            hidden: reduce
              ? { opacity: 0.65 }
              : { opacity: 0.18, y: 36, filter: "blur(10px)" },
            show: reduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 ring-2 ring-cyan-400/80 md:top-1.5" />
          <p className="text-sm font-medium text-cyan-300/90">{item.period}</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {item.role}
            <span className="font-normal text-zinc-500"> · {item.org}</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-zinc-400 md:text-base md:leading-8">
            {item.bullets.map((b, j) => (
              <li key={`${item.period}-${j}`} className="flex gap-3">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </motion.ol>
  );
}
