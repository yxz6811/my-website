"use client";

/**
 * 背景光斑：纯 CSS 动画 + blur，不依赖外部素材。
 */
export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="animate-ambient-blob absolute -left-1/4 top-0 h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full bg-cyan-500/25 blur-[100px]"
        aria-hidden
      />
      <div
        className="animate-ambient-blob-slow absolute -right-1/4 top-1/3 h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full bg-violet-600/25 blur-[100px]"
        aria-hidden
      />
      <div
        className="animate-ambient-blob-reverse absolute bottom-0 left-1/3 h-[min(60vw,400px)] w-[min(60vw,400px)] rounded-full bg-emerald-500/20 blur-[90px]"
        style={{ animationDelay: "-6s" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(9,9,11,0.4)_50%,rgb(9,9,11)_100%)]"
        aria-hidden
      />
    </div>
  );
}
