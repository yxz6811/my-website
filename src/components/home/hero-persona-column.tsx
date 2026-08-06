import { OrbitalPortrait } from "@/components/home/orbital-portrait";

type HeroPersonaColumnProps = {
  /** 大号账号昵称 */
  personaTitle: string;
  /** 小号说明（如「我的账号」） */
  personaSubtitle: string;
  /** `/public` 下头像路径 */
  portraitSrc: string;
  /** 头像无障碍说明 */
  portraitAlt: string;
};

/**
 * 首屏右侧：头像 + 账号昵称（杂志式冷静排版）。
 */
export function HeroPersonaColumn({
  personaTitle,
  personaSubtitle,
  portraitSrc,
  portraitAlt,
}: HeroPersonaColumnProps) {
  return (
    <div className="relative flex flex-col items-center gap-5 md:gap-7">
      <div className="surface-panel w-full max-w-[30rem] rounded-2xl px-4 py-6 md:px-8 md:py-9">
        <OrbitalPortrait src={portraitSrc} alt={portraitAlt} />
        <div className="mt-6 flex flex-col items-center gap-2.5 text-center">
          <p className="w-full text-center text-[clamp(1.35rem,6.5vw,2.75rem)] font-semibold leading-none tracking-[-0.04em] text-white">
            {personaTitle}
          </p>
          <p className="text-sm font-medium text-zinc-400 md:text-base">{personaSubtitle}</p>
        </div>
      </div>
    </div>
  );
}
