import { siteProfile } from "@/content/site-profile";
import { AmbientBackdrop } from "@/components/home/ambient-backdrop";
import { FocusScrollSection } from "@/components/home/focus-scroll-section";
import { ViewportReadingBand } from "@/components/home/viewport-reading-band";
import { HeroLead } from "@/components/home/hero-lead";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { LinkBento } from "@/components/home/link-bento";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SiteHeader } from "@/components/home/site-header";
import { TagStrip } from "@/components/home/tag-strip";

const NAV_ITEMS = [
  { href: "#about", label: "关于" },
  { href: "#links", label: "链接" },
  { href: "#abilities", label: "能力" },
  { href: "#timeline", label: "经历" },
  { href: "#skills", label: "技能" },
] as const;

/**
 * 首页：文案来自 `siteProfile`；`ViewportReadingBand` 仅在视口上下缘约 3cm 做渐暗。
 */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">
      <AmbientBackdrop />
      <ViewportReadingBand />
      <SiteHeader items={NAV_ITEMS} />

      <main className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 pb-24 pt-10 sm:px-8 sm:pt-14 md:gap-20">
          <FocusScrollSection id="about" panelClassName="md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
              <HeroLead
                eyebrow={siteProfile.eyebrow}
                headlineLead={siteProfile.headlineLead}
                headlineAccent={siteProfile.headlineAccent}
              />
              <div className="flex flex-col gap-6">
                <p className="text-base leading-relaxed text-zinc-400 md:text-lg md:leading-8">
                  {siteProfile.intro}
                </p>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-6 leading-relaxed text-zinc-300 md:p-7">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">自媒体</p>
                  <p className="mt-3 text-sm md:text-base">{siteProfile.mediaLine}</p>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">方向标签</p>
                  <TagStrip tags={siteProfile.tags} />
                </div>
              </div>
            </div>
          </FocusScrollSection>

          <FocusScrollSection id="links" panelClassName="space-y-8 md:p-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">链接与作品</h2>
                <p className="mt-2 max-w-xl text-sm text-zinc-400">
                  GitHub、邮箱、薯医与社交平台；卡片可直接打开新标签页。
                </p>
              </div>
              <p className="text-xs text-zinc-600">仅视口上下缘约 3cm 渐暗</p>
            </div>
            <LinkBento links={siteProfile.primaryLinks} />
          </FocusScrollSection>

          <FocusScrollSection id="abilities" panelClassName="md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">能力与方向</h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg md:leading-9">
              {siteProfile.abilities}
            </p>
          </FocusScrollSection>

          <FocusScrollSection id="timeline" panelClassName="md:p-10" scrollReveal={false}>
            <ScrollReveal>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">经历与活动</h2>
                <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                  公开分享、竞赛与黑客松项目，按时间从早到晚排列。
                </p>
              </div>
            </ScrollReveal>
            <ExperienceTimeline items={siteProfile.experience} />
          </FocusScrollSection>

          <FocusScrollSection id="skills" panelClassName="md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">技能</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
              <div className="border-t border-white/10 pt-8 md:border-t-0 md:border-r md:border-white/10 md:pr-10 md:pt-0">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
                  已熟练掌握
                </h3>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-300 md:text-base">
                  {siteProfile.skills.mastered.map((s) => (
                    <li key={s} className="flex gap-3 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 pt-8 md:border-t-0 md:pt-0">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                  正在加强
                </h3>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-300 md:text-base">
                  {siteProfile.skills.learning.map((s) => (
                    <li key={s} className="flex gap-3 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FocusScrollSection>

          <FocusScrollSection id="colophon" panel={false} className="scroll-mt-24">
            <footer className="rounded-2xl border border-white/10 bg-zinc-900/20 px-6 py-10 text-center text-sm text-zinc-500 backdrop-blur-sm">
              © {new Date().getFullYear()} 杨曦哲 · yangxizhe.com
            </footer>
          </FocusScrollSection>
        </div>
      </main>
    </div>
  );
}
