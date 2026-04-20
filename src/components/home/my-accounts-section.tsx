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
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
      <div className="flex flex-col gap-5">
        <div>
          <span className="block h-px w-14 bg-gradient-to-r from-rose-200/70 to-transparent" />
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
            我的账号
          </h2>
        </div>

        <div className="soft-card rounded-[1.75rem] p-6 leading-relaxed text-zinc-300 md:p-7">
          <p className="text-base leading-8 md:text-lg md:leading-9">{profile.mediaLine}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(155deg,rgba(18,25,40,0.88),rgba(8,12,22,0.86))] p-5 shadow-[0_22px_54px_-34px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-1 hover:border-sky-200/24 hover:bg-[linear-gradient(155deg,rgba(20,28,44,0.94),rgba(9,13,24,0.92))]"
          >
            <span className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-white/8 blur-2xl transition group-hover:bg-sky-200/10" />
            <p className="relative text-lg font-semibold text-white">{link.label}</p>
            <p className="relative mt-2 text-sm leading-7 text-zinc-400 transition group-hover:text-zinc-300">
              {link.blurb}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
