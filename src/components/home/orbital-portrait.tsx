import Image from "next/image";

type OrbitalPortraitProps = {
  /** `/public` 下的图片路径 */
  src: string;
  /** 无障碍说明 */
  alt: string;
};

/**
 * 圆形头像 + 外圈细轨道线（参考简约同心圆装饰，非医学用途）。
 */
export function OrbitalPortrait({ src, alt }: OrbitalPortraitProps) {
  return (
    <div className="relative mx-auto flex aspect-square w-[min(100%,280px)] max-w-[280px] items-center justify-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute aspect-square w-[118%] rounded-full border border-violet-400/25 shadow-[0_0_40px_-10px_rgba(167,139,250,0.35)]" />
        <div className="absolute aspect-square w-[138%] rounded-full border border-cyan-400/20" />
        <div className="absolute aspect-square w-[158%] rounded-full border border-white/12" />
      </div>
      <div className="relative aspect-square w-[72%] overflow-hidden rounded-full bg-zinc-800 ring-2 ring-white/20 ring-offset-4 ring-offset-zinc-950">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="200px"
          className="object-cover object-[center_22%]"
        />
      </div>
    </div>
  );
}
