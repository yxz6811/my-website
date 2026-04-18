"use client";

import { motion, useReducedMotion } from "framer-motion";

type TagStripProps = {
  /** 标签文案 */
  tags: string[];
};

/**
 * 可悬停微抬升的技能标签行。
 */
export function TagStrip({ tags }: TagStripProps) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-wrap gap-2.5">
      {tags.map((tag, i) => (
        <motion.span
          key={tag}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduce ? undefined : { y: -3, scale: 1.04 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          className="cursor-default rounded-full border border-white/15 bg-gradient-to-br from-white/[0.09] to-transparent px-4 py-2 text-sm text-zinc-200 shadow-sm ring-1 ring-white/5 transition-colors hover:border-cyan-400/35 hover:text-white"
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}
