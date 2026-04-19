import type { SiteProfile } from "@/content/site-profile";
import { TagStrip } from "@/components/home/tag-strip";

type AboutMeSectionProps = {
  /** 站点文案：正文与标签（头像与账号名在首屏右侧） */
  profile: Pick<SiteProfile, "intro" | "mediaLine" | "tags">;
};

/**
 * 第二页「框」：大字标题「关于我」+ 简介、自媒体说明与方向标签。
 */
export function AboutMeSection({ profile }: AboutMeSectionProps) {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">关于我</h2>

      <div className="flex flex-col gap-6">
        <p className="text-base leading-relaxed text-zinc-400 md:text-lg md:leading-8">{profile.intro}</p>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 leading-relaxed text-zinc-300 md:p-7">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">自媒体</p>
          <p className="mt-3 text-sm md:text-base">{profile.mediaLine}</p>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">方向标签</p>
          <TagStrip tags={profile.tags} />
        </div>
      </div>
    </div>
  );
}
