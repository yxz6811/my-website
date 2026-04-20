import type { SiteProfile } from "@/content/site-profile";
import { TagStrip } from "@/components/home/tag-strip";

type AboutMeSectionProps = {
  /** 站点文案：第二页左栏内容与标签（头像与账号名在首屏右侧） */
  profile: Pick<SiteProfile, "intro" | "tags">;
};

const VIBE_CODING_QUOTE =
  "有句话说的很好：vibe coding 时代几乎去掉了编程所有的门槛，真正限制你的，只有你的想象力。";

/**
 * 第二页「框」：按手稿布局分为两栏（左「关于我」，右「我会什么」）。
 */
export function AboutMeSection({ profile }: AboutMeSectionProps) {
  return (
    <div className="grid gap-14 md:grid-cols-2 md:gap-16 lg:gap-24">
      <section className="flex h-full flex-col gap-9 py-3 md:gap-10 md:py-4">
        <h2 className="mb-2 text-4xl font-semibold tracking-tight text-white md:mb-4 md:text-5xl lg:text-6xl">关于我</h2>
        <p className="mt-5 max-w-[28ch] text-base leading-8 text-zinc-200/95 italic tracking-[0.012em] md:mt-7 md:max-w-[30ch] md:text-lg md:leading-9">
          {profile.intro}
        </p>
        <p className="max-w-[30ch] text-base leading-8 text-zinc-200/90 md:text-lg md:leading-9">{VIBE_CODING_QUOTE}</p>
      </section>

      <section className="flex flex-col gap-7 md:gap-8">
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">我会什么</h2>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-5 md:p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">方向标签</p>
          <TagStrip tags={profile.tags} />
        </div>
      </section>
    </div>
  );
}
