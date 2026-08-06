import type { SiteProfile } from "@/content/site-profile";
import { TagStrip } from "@/components/home/tag-strip";

type AboutMeSectionProps = {
  /** 站点文案：关于我与标签 */
  profile: Pick<SiteProfile, "intro" | "mediaLine" | "tags">;
};

/**
 * 「关于我」杂志式双栏：左叙事，右能力标签。
 */
export function AboutMeSection({ profile }: AboutMeSectionProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      <section className="flex h-full flex-col gap-6 md:gap-8">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">ABOUT</p>
          <h2 className="mt-3 text-[2.1rem] font-semibold tracking-[-0.04em] text-white md:text-5xl lg:text-[3.4rem]">
            关于我
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-zinc-300 md:text-lg md:leading-9">
          {profile.intro}
        </p>
        <p className="max-w-2xl border-l border-[var(--accent)]/35 pl-4 text-sm leading-7 text-zinc-400 md:text-base md:leading-8">
          {profile.mediaLine}
        </p>
      </section>

      <section className="flex flex-col gap-6 md:gap-8">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">FOCUS</p>
          <h2 className="mt-3 text-[2.1rem] font-semibold tracking-[-0.04em] text-white md:text-5xl lg:text-[3.4rem]">
            我会什么
          </h2>
        </div>
        <div className="surface-panel rounded-2xl p-4 md:p-6">
          <TagStrip tags={profile.tags} />
        </div>
      </section>
    </div>
  );
}
