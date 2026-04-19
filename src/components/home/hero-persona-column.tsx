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
 * 首屏右侧：环形头像 + 账号主副标题（与左侧「你好，我是…」同一页/同一框）。
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
      <div className="flex w-full max-w-sm flex-col items-center gap-2 text-center">
        <p className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{personaTitle}</p>
        <p className="text-sm tracking-wide text-zinc-500">{personaSubtitle}</p>
      </div>
    </div>
  );
}
