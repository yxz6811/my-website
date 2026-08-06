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
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">MEDIA</p>
          <h2 className="mt-2 text-[2.1rem] font-semibold tracking-[-0.04em] text-white md:text-5xl lg:text-[3.4rem]">
            我的账号
          </h2>
        </div>

        <p className="max-w-xl text-base leading-8 text-zinc-300 md:text-lg md:leading-9">
          {profile.mediaLine}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group surface-panel cursor-pointer rounded-xl p-4 transition hover:border-white/20 md:p-5"
          >
            <p className="text-lg font-semibold text-white">{link.label}</p>
            <p className="mt-2 text-sm leading-7 text-zinc-400 transition group-hover:text-zinc-300">
              {link.blurb}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
