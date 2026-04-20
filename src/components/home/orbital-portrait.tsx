import Image from "next/image";

type OrbitalPortraitProps = {
  /** `/public` 下的图片路径 */
  src: string;
  /** 无障碍说明 */
  alt: string;
};

/**
 * 圆形头像：外层不透明白底挡住玻璃面板后的彩色背景光斑，避免边缘看起来像「彩环」；
 * 内圈细线仅为中性灰白描边，不使用 `ring`（易与 backdrop 叠出杂色）。
 */
export function OrbitalPortrait({ src, alt }: OrbitalPortraitProps) {
  return (
    <div className="relative mx-auto aspect-square w-[min(100%,284px)] max-w-[284px] shrink-0">
      <div className="absolute inset-[-10%] rounded-full bg-sky-300/10 blur-[36px]" aria-hidden />
      <div className="absolute inset-0 rounded-full border border-white/8" aria-hidden />
      <div className="animate-pulse-ring absolute inset-[-6%] rounded-full border border-sky-200/15" aria-hidden />
      <div className="absolute inset-[6%] rounded-full border border-white/8" aria-hidden />
      <span className="absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.85)]" aria-hidden />
      <span className="absolute bottom-[14%] right-[11%] h-2.5 w-2.5 rounded-full bg-emerald-200/80 shadow-[0_0_14px_rgba(167,243,208,0.8)]" aria-hidden />
      <div className="relative h-full w-full rounded-full bg-slate-950/80 p-3 shadow-[0_28px_70px_-36px_rgba(0,0,0,0.9)]">
        <div className="relative h-full w-full overflow-hidden rounded-full border border-white/15 bg-zinc-800">
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.16),transparent_34%),linear-gradient(to_top,rgba(5,8,15,0.22),transparent_42%)]" />
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) min(284px, 85vw), 284px"
            className="object-cover object-[center_22%]"
          />
        </div>
      </div>
    </div>
  );
}
