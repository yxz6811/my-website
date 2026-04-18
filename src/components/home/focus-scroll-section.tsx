"use client";

import { useReducedMotion } from "framer-motion";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

type FocusScrollSectionProps = {
  /** 对应锚点与顶栏高亮 */
  id: string;
  /** 区块内容 */
  children: ReactNode;
  /** 追加在 section 上的 class */
  className?: string;
  /** 是否使用统一玻璃面板容器 */
  panel?: boolean;
  /** 面板内额外 class（如 `space-y-6`） */
  panelClassName?: string;
};

/**
 * 滚动时以视口垂直中心为「焦点」：靠近中心的不透明度与缩放更高，
 * 远离的区块淡出、略缩小，形成上下推拉时的自然过渡（无需抄袭特定站点）。
 */
export function FocusScrollSection({
  id,
  children,
  className = "",
  panel = true,
  panelClassName = "",
}: FocusScrollSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [visual, setVisual] = useState({ opacity: 0.22, scale: 0.978 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion === true) return;

    let raf = 0;

    /** 根据区块中心与视口中心的距离计算焦点强度 */
    const tick = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const sectionMid = rect.top + rect.height / 2;
      const viewportCenter = vh * 0.5;
      const t = (sectionMid - viewportCenter) / (vh * 0.38);
      const focus = Math.exp(-t * t * 2.35);
      const opacity = 0.1 + 0.9 * focus;
      const scale = 0.978 + 0.022 * focus;
      setVisual((prev) =>
        Math.abs(prev.opacity - opacity) < 0.004 && Math.abs(prev.scale - scale) < 0.0008
          ? prev
          : { opacity, scale },
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const style =
    reduceMotion === true
      ? undefined
      : {
          opacity: visual.opacity,
          transform: `scale(${visual.scale})`,
          transition: "opacity 0.14s ease-out, transform 0.14s ease-out",
        };

  const inner = panel ? (
    <div
      className={`rounded-3xl border border-white/[0.08] bg-zinc-900/30 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md md:p-9 ${panelClassName}`}
    >
      {children}
    </div>
  ) : (
    children
  );

  return (
    <section
      ref={ref}
      id={id}
      style={style}
      className={`scroll-mt-32 will-change-[opacity,transform] ${className}`}
    >
      {inner}
    </section>
  );
}
