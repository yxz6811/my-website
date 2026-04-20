"use client";

/**
 * 背景光斑：纯 CSS 动画 + blur，不依赖外部素材。
 */
export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(125,211,252,0.18),transparent_0_28%),radial-gradient(circle_at_82%_16%,rgba(45,212,191,0.14),transparent_0_24%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.12),transparent_0_34%)]"
        aria-hidden
      />
      <div
        className="animate-ambient-blob absolute -left-[16%] top-[-6%] h-[min(84vw,580px)] w-[min(84vw,580px)] rounded-full bg-sky-300/26 blur-[120px]"
        aria-hidden
      />
      <div
        className="animate-ambient-blob-slow absolute -right-[14%] top-[18%] h-[min(74vw,520px)] w-[min(74vw,520px)] rounded-full bg-teal-300/20 blur-[120px]"
        aria-hidden
      />
      <div
        className="animate-ambient-blob-reverse absolute bottom-[-8%] left-[26%] h-[min(66vw,460px)] w-[min(66vw,460px)] rounded-full bg-amber-200/16 blur-[110px]"
        style={{ animationDelay: "-6s" }}
        aria-hidden
      />
      <div
        className="animate-ambient-sweep absolute left-1/2 top-[-28%] h-[92vh] w-[92vw] -translate-x-1/2 rounded-full bg-[conic-gradient(from_210deg_at_50%_50%,rgba(255,255,255,0)_0deg,rgba(125,211,252,0.08)_70deg,rgba(255,255,255,0)_150deg,rgba(251,191,36,0.07)_220deg,rgba(255,255,255,0)_300deg)] blur-[110px] opacity-80"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(5,11,22,0.3)_76%,rgba(4,8,15,0.6)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,20,34,0.26)_0%,transparent_24%,transparent_78%,rgba(6,12,22,0.52)_100%)]"
        aria-hidden
      />
    </div>
  );
}
