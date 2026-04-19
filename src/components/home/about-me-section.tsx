import type { SiteProfile } from "@/content/site-profile";
import { OrbitalPortrait } from "@/components/home/orbital-portrait";
import { TagStrip } from "@/components/home/tag-strip";

type AboutMeSectionProps = {
  /** 站点文案子集 */
  profile: Pick<
    SiteProfile,
    "intro" | "mediaLine" | "tags" | "personaTitle" | "personaSubtitle"
  >;
};

/**
 * 「关于我」独立区块：环形头像、账号昵称与正文（原首屏右侧内容）。
 */
export function AboutMeSection({ profile }: AboutMeSectionProps) {
  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">关于我</h2>

      <OrbitalPortrait src="/profile-presentation.jpg" alt="杨曦哲在活动上演讲与分享" />

      <div className="flex w-full flex-col items-center gap-2 text-center">
        <p className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{profile.personaTitle}</p>
        <p className="text-sm tracking-wide text-zinc-500">{profile.personaSubtitle}</p>
      </div>

      <div className="flex flex-col gap-6 border-t border-white/10 pt-10">
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
