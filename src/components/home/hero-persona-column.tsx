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
 * 首屏右侧：环形头像 + 账号昵称（渐变大字，与左侧「杨曦哲」一致）+ 说明行（沿用原昵称的白字规格）。
 */
export function HeroPersonaColumn({
  personaTitle,
  personaSubtitle,
  portraitSrc,
  portraitAlt,
}: HeroPersonaColumnProps) {
  return (
    <div className="flex flex-col items-center gap-6 md:gap-8">
      <OrbitalPortrait src={portraitSrc} alt={portraitAlt} />
      <div className="flex w-full max-w-xl flex-col items-center gap-3 text-center md:max-w-2xl md:gap-4">
        <p className="bg-gradient-to-r from-cyan-200 via-violet-200 to-emerald-200 bg-clip-text text-4xl font-semibold leading-[1.08] tracking-tight text-transparent md:text-6xl md:leading-[1.06]">
          {personaTitle}
        </p>
        <p className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{personaSubtitle}</p>
      </div>
    </div>
  );
}
