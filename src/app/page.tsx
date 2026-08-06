import { siteProfile } from "@/content/site-profile";
import { AboutMeSection } from "@/components/home/about-me-section";
import { AiWallSection } from "@/components/home/ai-wall-section";
import { AmbientBackdrop } from "@/components/home/ambient-backdrop";
import { FocusScrollSection } from "@/components/home/focus-scroll-section";
import { HeroLead } from "@/components/home/hero-lead";
import { HeroPersonaColumn } from "@/components/home/hero-persona-column";
import { MyAccountsSection } from "@/components/home/my-accounts-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { LinkBento } from "@/components/home/link-bento";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SiteHeader } from "@/components/home/site-header";
import { VisitorMilestoneSection } from "@/components/home/visitor-milestone-section";

const NAV_ITEMS = [
  { href: "#about-me", label: "关于" },
  { href: "#timeline", label: "经历" },
  { href: "#links", label: "链接" },
  { href: "#skills", label: "技能" },
  { href: "#visitor", label: "到访" },
  { href: "#ai-wall", label: "AI 墙" },
] as const;

/**
 * 首页信息架构：先人设与叙事 → 作品链接 → 互动区靠后。
 */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-zinc-100">
      <AmbientBackdrop />
      <SiteHeader items={NAV_ITEMS} />

      <main className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-20 pt-6 sm:px-8 sm:pt-10 md:gap-16 lg:gap-[4.5rem]">
          <FocusScrollSection
            id="top"
            panelClassName="!px-4 !py-10 sm:!px-8 md:!px-10 md:!py-14 lg:!py-16"
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

          <FocusScrollSection id="about-me" panel={false} className="scroll-mt-28">
            <AboutMeSection profile={siteProfile} />
          </FocusScrollSection>

          <FocusScrollSection id="timeline" panelClassName="!p-4 md:!p-10" scrollReveal={false}>
            <ScrollReveal>
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">JOURNEY</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.15rem]">
                  经历与活动
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  演讲舞台、黑客松作品与行业现场——先看高光，展开可浏览其余。
                </p>
              </div>
            </ScrollReveal>
            <ExperienceSection
              highlights={siteProfile.experienceHighlights}
              more={siteProfile.experienceMore}
            />
          </FocusScrollSection>

          <FocusScrollSection id="my-accounts" panelClassName="!p-4 md:!p-10 lg:!p-12">
            <MyAccountsSection profile={siteProfile} />
          </FocusScrollSection>

          <FocusScrollSection
            id="links"
            panelClassName="space-y-8 !p-4 md:space-y-10 md:!p-10 lg:!p-12"
          >
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">LINKS</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.15rem]">
                链接与作品
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                GitHub、邮箱、薯医与社交平台；合作请优先邮件联系。
              </p>
            </div>
            <LinkBento links={siteProfile.primaryLinks} />
          </FocusScrollSection>

          <FocusScrollSection id="skills" panelClassName="!p-4 md:!p-10">
            <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">SKILLS</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.15rem]">
              技能
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
              <div className="soft-card rounded-2xl p-5 md:p-6">
                <h3 className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">
                  已熟练掌握
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300 md:text-base">
                  {siteProfile.skills.mastered.map((s) => (
                    <li key={s} className="flex gap-3 border-b border-white/6 pb-3 last:border-0 last:pb-0">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="soft-card rounded-2xl p-5 md:p-6">
                <h3 className="text-xs font-semibold tracking-[0.18em] text-zinc-400">正在加强</h3>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300 md:text-base">
                  {siteProfile.skills.learning.map((s) => (
                    <li key={s} className="flex gap-3 border-b border-white/6 pb-3 last:border-0 last:pb-0">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FocusScrollSection>

          <FocusScrollSection id="visitor" panelClassName="!p-0">
            <VisitorMilestoneSection />
          </FocusScrollSection>

          <FocusScrollSection id="ai-wall" panelClassName="!p-0">
            <AiWallSection />
          </FocusScrollSection>

          <FocusScrollSection id="colophon" panel={false} className="scroll-mt-24">
            <footer className="surface-panel rounded-2xl px-6 py-7 text-center text-sm text-zinc-500">
              © {new Date().getFullYear()} 杨曦哲 · yangxizhe.com
            </footer>
          </FocusScrollSection>
        </div>
      </main>
    </div>
  );
}
