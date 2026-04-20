"use client";

import { useMemo, useState } from "react";
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
  /** 首屏能力标签 */
  tags: string[];
};

const INTERACTIVE_QUOTES = [
  "我们被称为 AI 原住民，是因为 AI 对我们来说，就像水和空气一样自然。",
  "代码有报错的时候，人生也有；但只要还在运行，就总能跑通。",
  "人工智能已经读懂了全世界的知识，而你要做的就是站在它的肩膀上，去看更远的风景。",
  "现在我们写的每一行代码，在将来都有可能改变世界。",
  "在这个时代，最强大的算力不是GPU，而是‘你+AI’的无限可能。",
  "让人工智能让你的超级副驾驶，人生的赛道同样在你的掌握之中，但一次，我们可以开得更快、更远。",
];

/**
 * 从候选语句里随机取一条，并尽量避开当前这条。
 */
function pickNextQuote(quotes: readonly string[], current: string): string {
  if (quotes.length <= 1) {
    return current;
  }

  let next = current;
  while (next === current) {
    next = quotes[Math.floor(Math.random() * quotes.length)];
  }
  return next;
}

/**
 * 首屏标题与主行动按钮（滚动至外链区）。
 */
export function HeroLead({ eyebrow, headlineLead, headlineAccent, tagline, tags }: HeroLeadProps) {
  const reduce = useReducedMotion();
  const quotePool = useMemo(
    () => (INTERACTIVE_QUOTES.includes(eyebrow) ? INTERACTIVE_QUOTES : [eyebrow, ...INTERACTIVE_QUOTES]),
    [eyebrow],
  );
  const [currentQuote, setCurrentQuote] = useState(quotePool[0]);

  return (
    <div className="flex flex-col items-start">
      <motion.div
        className="soft-card relative max-w-xl rounded-[1.75rem] px-5 py-4 md:px-6"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.9)]" />
            <p className="text-sm font-medium leading-7 tracking-[0.01em] text-zinc-300 md:text-[15px]">
              {currentQuote}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentQuote((prev) => pickNextQuote(quotePool, prev))}
            className="interactive-ring interactive-sheen shrink-0 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-zinc-100 transition hover:border-sky-200/40 hover:bg-white/[0.1] hover:text-white"
          >
            换一句
          </button>
        </div>
      </motion.div>
      <motion.h1
        className="mt-8 max-w-[10ch] text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white md:mt-10 md:text-7xl lg:text-[5.4rem]"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="block text-zinc-100">{headlineLead}</span>
        <span className="text-hero-accent mt-3 block">
          {headlineAccent}
        </span>
      </motion.h1>
      <motion.div
        className="mt-8 flex flex-wrap gap-3"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.45 }}
      >
        <motion.a
          href="#links"
          className="interactive-ring interactive-sheen group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_18px_40px_-20px_rgba(186,230,253,0.55)] transition hover:bg-sky-50"
          whileHover={reduce ? undefined : { scale: 1.03 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          <span className="h-2 w-2 rounded-full bg-sky-500 transition duration-300 group-hover:scale-125 group-hover:bg-cyan-400 group-hover:shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
          浏览全部链接
          <span
            className="text-zinc-500 transition duration-300 group-hover:translate-x-0.5 group-hover:text-zinc-900"
            aria-hidden
          >
            ↗
          </span>
        </motion.a>
        <motion.a
          href="#timeline"
          className="interactive-ring interactive-sheen group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/[0.08]"
          whileHover={reduce ? undefined : { scale: 1.03 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          <span className="h-2 w-2 rounded-full bg-white/45 transition duration-300 group-hover:scale-125 group-hover:bg-emerald-300 group-hover:shadow-[0_0_14px_rgba(110,231,183,0.75)]" />
          查看经历
          <span
            className="text-zinc-500 transition duration-300 group-hover:translate-x-0.5 group-hover:text-zinc-200"
            aria-hidden
          >
            →
          </span>
        </motion.a>
      </motion.div>
      <motion.p
        className="mt-8 max-w-lg border-l border-white/10 pl-4 text-sm leading-7 text-zinc-400 md:mt-10 md:text-base lg:mt-12"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        {tagline}
      </motion.p>
      <motion.ul
        className="mt-8 flex flex-wrap gap-2.5 md:mt-10"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:text-sm"
          >
            {tag}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
