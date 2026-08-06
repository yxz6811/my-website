import Image from "next/image";

type OrbitalPortraitProps = {
  /** `/public` 下的图片路径 */
  src: string;
  /** 无障碍说明 */
  alt: string;
};

/**
 * 头像：简洁圆形裁切，去掉脉冲环与装饰粒子。
 */
export function OrbitalPortrait({ src, alt }: OrbitalPortraitProps) {
  return (
    <div className="relative mx-auto aspect-square w-[min(100%,280px)] max-w-[280px] shrink-0">
      <div className="relative h-full w-full overflow-hidden rounded-full border border-white/12 bg-zinc-900 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.85)]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) min(280px, 85vw), 280px"
          className="object-cover object-[center_22%]"
        />
      </div>
    </div>
  );
}
