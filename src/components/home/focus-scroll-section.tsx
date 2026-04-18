import type { ReactNode } from "react";

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
 * 页面大区块：玻璃面板 + 锚点 id。亮度由 `ViewportReadingBand` 按视口位置统一控制。
 */
export function FocusScrollSection({
  id,
  children,
  className = "",
  panel = true,
  panelClassName = "",
}: FocusScrollSectionProps) {
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
    <section id={id} className={`scroll-mt-32 ${className}`}>
      {inner}
    </section>
  );
}
