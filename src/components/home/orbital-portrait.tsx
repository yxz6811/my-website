import Image from "next/image";

type OrbitalPortraitProps = {
  /** `/public` 下的图片路径 */
  src: string;
  /** 无障碍说明 */
  alt: string;
};

/**
 * 圆形头像（细白边），尺寸适配首屏右栏且不溢出面板。
 */
export function OrbitalPortrait({ src, alt }: OrbitalPortraitProps) {
  return (
    <div className="relative mx-auto aspect-square w-[min(100%,240px)] max-w-[240px] shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-white/20">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) min(240px, 85vw), 240px"
        className="object-cover object-[center_22%]"
      />
    </div>
  );
}
