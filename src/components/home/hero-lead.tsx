"use client";

import { motion, useReducedMotion } from "framer-motion";

type HeroLeadProps = {
  /** 顶栏小字 */
  eyebrow: string;
  /** 主标题上行 */
  headlineLead: string;
  /** 主标题下行（渐变） */
  headlineAccent: string;
  /** 主按钮下方标语 */
  tagline: string;
};

/**
 * 首屏标题与主行动按钮（滚动至外链区）。
 */
export function HeroLead({ eyebrow, headlineLead, headlineAccent, tagline }: HeroLeadProps) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-6">
      <motion.p
        className="-mt-2 text-xs font-medium tracking-[0.35em] text-zinc-500 md:-mt-4 lg:-mt-5"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className="text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl md:leading-[1.06]"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        {headlineLead}
        <span className="mt-3 block bg-gradient-to-r from-cyan-200 via-violet-200 to-emerald-200 bg-clip-text text-transparent">
          {headlineAccent}
        </span>
      </motion.h1>
      <motion.div
        className="flex flex-wrap gap-3 pt-2"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.45 }}
      >
        <motion.a
          href="#links"
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-lg shadow-cyan-500/15 transition hover:bg-zinc-100"
          whileHover={reduce ? undefined : { scale: 1.03 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          浏览全部链接
        </motion.a>
        <motion.a
          href="#timeline"
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition hover:border-white/35 hover:bg-white/10"
          whileHover={reduce ? undefined : { scale: 1.03 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          查看经历
        </motion.a>
      </motion.div>
      <motion.p
        className="mt-10 max-w-md pt-1 text-xs leading-relaxed text-zinc-500 md:mt-14 md:text-sm lg:mt-16"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        {tagline}
      </motion.p>
    </div>
  );
}
