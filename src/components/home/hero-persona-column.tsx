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
 * 首屏右侧：环形头像 + 账号昵称（淡冰青单色，与左侧强调名同色）+ 说明行（白字）。
 */
export function HeroPersonaColumn({
  personaTitle,
  personaSubtitle,
  portraitSrc,
  portraitAlt,
}: HeroPersonaColumnProps) {
  return (
    <div className="relative flex flex-col items-center gap-6 md:gap-8">
      <div className="glass-panel w-full max-w-[30rem] rounded-[2rem] px-6 py-8 md:px-8 md:py-10">
        <div className="relative">
          <div className="animate-float-soft absolute inset-x-10 top-6 h-24 rounded-full bg-sky-300/10 blur-[42px]" aria-hidden />
          <OrbitalPortrait src={portraitSrc} alt={portraitAlt} />
        </div>
        <div className="mt-7 flex flex-col items-center gap-4 text-center">
          <p className="w-full whitespace-nowrap text-center text-[clamp(1.85rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.055em] text-cyan-50 drop-shadow-[0_0_26px_rgba(186,230,253,0.16)]">
            {personaTitle}
          </p>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200 md:text-base">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(167,243,208,0.9)]" />
            {personaSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
