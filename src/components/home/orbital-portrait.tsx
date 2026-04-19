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
    <div className="relative mx-auto aspect-square w-[min(100%,248px)] max-w-[248px] shrink-0 rounded-full bg-zinc-950 p-[3px]">
      <div className="relative h-full w-full overflow-hidden rounded-full border border-white/15 bg-zinc-800">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) min(248px, 85vw), 248px"
          className="object-cover object-[center_22%]"
        />
      </div>
    </div>
  );
}
