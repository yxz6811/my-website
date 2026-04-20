import type { ReactNode } from "react";
import { ScrollReveal } from "./scroll-reveal";

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
  /** 是否套用滚动淡入（时间轴等可关闭，改用独立动画） */
  scrollReveal?: boolean;
};

/**
 * 页面大区块：玻璃面板 + 锚点 id；可选滚动淡入。亮度由 `ViewportReadingBand` 控制。
 */
export function FocusScrollSection({
  id,
  children,
  className = "",
  panel = true,
  panelClassName = "",
  scrollReveal = true,
}: FocusScrollSectionProps) {
  const content = scrollReveal ? <ScrollReveal>{children}</ScrollReveal> : children;

  const inner = panel ? (
    <div
      className={`glass-panel rounded-[2rem] p-6 md:p-9 ${panelClassName}`}
    >
      <div className="relative">{content}</div>
    </div>
  ) : (
    content
  );

  return (
    <section id={id} className={`scroll-mt-32 ${className}`}>
      {inner}
    </section>
  );
}
