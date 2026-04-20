"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  /** 子节点 */
  children: ReactNode;
  /** 外层 class */
  className?: string;
  /** 进入视口后的延迟（秒） */
  delay?: number;
};

/**
 * 滚动进入视口时淡入并略带位移与模糊；离开视口后回落，形成类似高级落地页的呼吸感。
 * 视口判定略宽、可见比例略低，让内容更早切入清晰态，缩小「还带模糊」的滚动区间。
 * 尊重系统「减少动态效果」。
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0.24, y: 34, filter: "blur(6px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ amount: 0.18, margin: "0px 0px -8% 0px", once: true }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
