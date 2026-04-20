import { siteProfile } from "@/content/site-profile";
import { AboutMeSection } from "@/components/home/about-me-section";
import { AmbientBackdrop } from "@/components/home/ambient-backdrop";
import { FocusScrollSection } from "@/components/home/focus-scroll-section";
import { ViewportReadingBand } from "@/components/home/viewport-reading-band";
import { HeroLead } from "@/components/home/hero-lead";
import { HeroPersonaColumn } from "@/components/home/hero-persona-column";
import { MyAccountsSection } from "@/components/home/my-accounts-section";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { LinkBento } from "@/components/home/link-bento";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SiteHeader } from "@/components/home/site-header";

const NAV_ITEMS = [
  { href: "#about-me", label: "关于" },
  { href: "#my-accounts", label: "账号" },
  { href: "#links", label: "链接" },
  { href: "#timeline", label: "经历" },
  { href: "#skills", label: "技能" },
] as const;

/**
 * 首页：第一框为左右分栏（左问候与按钮，右头像与账号）；第二框为大字「关于我」与正文。
 */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-zinc-100">
      <AmbientBackdrop />
      <ViewportReadingBand />
      <SiteHeader items={NAV_ITEMS} />

      <main className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 pb-24 pt-8 sm:px-8 sm:pt-10 md:gap-[4.5rem] lg:gap-20">
          <FocusScrollSection
            id="top"
            panelClassName="!px-5 !py-14 sm:!px-8 md:!px-10 md:!py-[4.5rem] lg:!py-20"
          >
            <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-14 lg:gap-16">
              <HeroLead
                eyebrow={siteProfile.eyebrow}
                headlineLead={siteProfile.headlineLead}
                headlineAccent={siteProfile.headlineAccent}
                tagline={siteProfile.heroTagline}
                tags={siteProfile.tags}
              />
              <HeroPersonaColumn
                personaTitle={siteProfile.personaTitle}
                personaSubtitle={siteProfile.personaSubtitle}
                portraitSrc="/profile-presentation.jpg"
                portraitAlt="杨曦哲在活动上演讲与分享"
              />
            </div>
          </FocusScrollSection>

          <FocusScrollSection id="about-me" panelClassName="!px-7 !py-8 md:!px-12 md:!py-12 lg:!px-14 lg:!py-14">
            <AboutMeSection profile={siteProfile} />
          </FocusScrollSection>

          <FocusScrollSection id="my-accounts" panelClassName="!p-7 md:!p-10 lg:!p-12">
            <MyAccountsSection profile={siteProfile} />
          </FocusScrollSection>

          <FocusScrollSection
            id="links"
            panelClassName="space-y-10 !p-7 md:space-y-12 md:!p-10 lg:!p-12"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.15rem]">
                  链接与作品
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                  GitHub、邮箱、薯医与社交平台；卡片可直接打开新标签页。
                </p>
              </div>
              <p className="text-xs text-zinc-600">仅视口上下缘约 3cm 渐暗</p>
            </div>
            <LinkBento links={siteProfile.primaryLinks} />
          </FocusScrollSection>

          <FocusScrollSection id="timeline" panelClassName="!p-7 md:!p-10" scrollReveal={false}>
            <ScrollReveal>
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.15rem]">
                  经历与活动
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  公开分享、竞赛与黑客松项目，按时间从早到晚排列。
                </p>
              </div>
            </ScrollReveal>
            <ExperienceTimeline items={siteProfile.experience} />
          </FocusScrollSection>

          <FocusScrollSection id="skills" panelClassName="!p-7 md:!p-10">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.15rem]">技能</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
              <div className="soft-card rounded-[1.75rem] p-6 md:p-7">
                <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/90">
                  已熟练掌握
                </h3>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-300 md:text-base">
                  {siteProfile.skills.mastered.map((s) => (
                    <li key={s} className="flex gap-3 border-b border-white/6 pb-4 last:border-0 last:pb-0">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="soft-card rounded-[1.75rem] p-6 md:p-7">
                <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300/90">
                  正在加强
                </h3>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-300 md:text-base">
                  {siteProfile.skills.learning.map((s) => (
                    <li key={s} className="flex gap-3 border-b border-white/6 pb-4 last:border-0 last:pb-0">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FocusScrollSection>

          <FocusScrollSection id="colophon" panel={false} className="scroll-mt-24">
            <footer className="glass-panel rounded-[1.75rem] px-6 py-8 text-center text-sm text-zinc-500">
              © {new Date().getFullYear()} 杨曦哲 · yangxizhe.com
            </footer>
          </FocusScrollSection>
        </div>
      </main>
    </div>
  );
}
