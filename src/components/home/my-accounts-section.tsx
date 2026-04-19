import type { SiteProfile } from "@/content/site-profile";

type MyAccountsSectionProps = {
  /** 自媒体账号文案与链接 */
  profile: Pick<SiteProfile, "mediaLine" | "primaryLinks">;
};

const SOCIAL_VARIANTS = new Set(["douyin", "xiaohongshu"]);

/**
 * 独立账号页：大标题「我的账号」+ 自媒体简介 + 账号入口。
 */
export function MyAccountsSection({ profile }: MyAccountsSectionProps) {
  const socialLinks = profile.primaryLinks.filter((link) => SOCIAL_VARIANTS.has(link.variant));

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <h2 className="text-center text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
        我的账号
      </h2>

      <div className="rounded-2xl border border-white/10 bg-black/25 p-6 leading-relaxed text-zinc-300 md:p-7">
        <p className="text-base md:text-lg">{profile.mediaLine}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 transition hover:border-cyan-300/40 hover:bg-zinc-900/70"
          >
            <p className="text-lg font-semibold text-white">{link.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{link.blurb}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
