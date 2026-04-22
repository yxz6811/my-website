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
    <div className="grid gap-9 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
      <section className="flex h-full flex-col gap-7 md:gap-8">
        <div>
          <span className="block h-px w-14 bg-gradient-to-r from-sky-300/70 to-transparent" />
          <h2 className="mt-5 text-[2.1rem] font-semibold tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
            关于我
          </h2>
        </div>
        <div className="soft-card rounded-[1.75rem] p-4 md:p-7">
          <p className="text-base leading-8 text-zinc-200/95 md:text-lg md:leading-9">
            {profile.intro}
          </p>
        </div>
        <blockquote className="rounded-[1.75rem] border border-sky-200/10 bg-[linear-gradient(135deg,rgba(11,21,35,0.96),rgba(10,18,30,0.84))] p-4 shadow-[0_26px_70px_-40px_rgba(8,47,73,0.75)] md:p-7">
          <span className="block h-px w-14 bg-gradient-to-r from-sky-200/70 to-transparent" />
          <p className="mt-5 text-base leading-8 text-zinc-100/90 md:text-lg md:leading-9">
            {VIBE_CODING_QUOTE}
          </p>
        </blockquote>
      </section>

      <section className="flex flex-col gap-7 md:gap-8">
        <div>
          <span className="block h-px w-14 bg-gradient-to-r from-amber-200/70 to-transparent" />
          <h2 className="mt-5 text-[2.1rem] font-semibold tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
            我会什么
          </h2>
        </div>
        <div className="soft-card rounded-[2rem] p-4 md:p-6">
          <TagStrip tags={profile.tags} />
        </div>
      </section>
    </div>
  );
}
