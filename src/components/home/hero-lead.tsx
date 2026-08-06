"use client";

import { motion, useReducedMotion } from "framer-motion";

type HeroLeadProps = {
  /** 顶栏小字 */
  eyebrow: string;
  /** 主标题上行 */
  headlineLead: string;
  /** 主标题下行（强调色） */
  headlineAccent: string;
  /** 主按钮下方标语 */
  tagline: string;
  /** 首屏能力标签 */
  tags: string[];
};

/**
 * 首屏标题与主行动按钮。
 */
export function HeroLead({ eyebrow, headlineLead, headlineAccent, tagline, tags }: HeroLeadProps) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col items-start">
      <motion.p
        className="text-sm font-medium tracking-[0.02em] text-zinc-400 md:text-[15px]"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className="mt-5 max-w-[10ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white md:mt-7 md:text-7xl lg:text-[5.2rem]"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="block text-zinc-100">{headlineLead}</span>
        <span className="text-hero-accent mt-3 block">{headlineAccent}</span>
      </motion.h1>
      <motion.p
        className="mt-6 max-w-lg border-l border-white/12 pl-4 text-sm leading-7 text-zinc-400 md:mt-8 md:text-base"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.45 }}
      >
        {tagline}
      </motion.p>
      <motion.div
        className="mt-7 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.28, duration: 0.4 }}
      >
        <a
          href="#links"
          className="interactive-ring group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 sm:w-auto"
        >
          浏览作品与链接
          <span className="text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-zinc-900" aria-hidden>
            ↗
          </span>
        </a>
        <a
          href="#timeline"
          className="interactive-ring group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-white/14 bg-transparent px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/28 hover:bg-white/[0.04] sm:w-auto"
        >
          查看经历
          <span className="text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-zinc-200" aria-hidden>
            →
          </span>
        </a>
      </motion.div>
      <motion.ul
        className="mt-7 flex flex-wrap gap-2 md:mt-9"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 md:text-sm"
          >
            {tag}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
