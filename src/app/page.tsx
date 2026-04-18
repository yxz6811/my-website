import { siteProfile } from "@/content/site-profile";
import { AmbientBackdrop } from "@/components/home/ambient-backdrop";
import { HeroLead } from "@/components/home/hero-lead";
import { LinkBento } from "@/components/home/link-bento";
import { Reveal } from "@/components/home/reveal";
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
 * 首页：文案来自 `siteProfile`；动效与滚动交互由 client 子组件承担。
 */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">
      <AmbientBackdrop />
      <SiteHeader items={NAV_ITEMS} />

      <main className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 pb-20 pt-10 sm:px-8 sm:pt-14 md:gap-20">
          <section id="about" className="scroll-mt-32">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
              <Reveal>
                <HeroLead
                  eyebrow={siteProfile.eyebrow}
                  headlineLead={siteProfile.headlineLead}
                  headlineAccent={siteProfile.headlineAccent}
                />
              </Reveal>
              <Reveal delay={0.08} className="flex flex-col gap-6">
                <p className="text-base leading-relaxed text-zinc-400 md:text-lg md:leading-8">
                  {siteProfile.intro}
                </p>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 leading-relaxed text-zinc-300 shadow-inner shadow-black/20 backdrop-blur-md md:p-7">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">自媒体</p>
                  <p className="mt-3 text-sm md:text-base">{siteProfile.mediaLine}</p>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">方向标签</p>
                  <TagStrip tags={siteProfile.tags} />
                </div>
              </Reveal>
            </div>
          </section>

          <section id="links" className="scroll-mt-32 space-y-6">
            <Reveal>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">链接与作品</h2>
                  <p className="mt-2 max-w-xl text-sm text-zinc-400">
                    GitHub、邮箱、薯医与社交平台；卡片可直接打开新标签页。
                  </p>
                </div>
                <p className="text-xs text-zinc-600">Hover 查看强调光晕</p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <LinkBento links={siteProfile.primaryLinks} />
            </Reveal>
          </section>

          <section id="abilities" className="scroll-mt-32">
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/90 p-8 shadow-2xl backdrop-blur-md transition hover:border-cyan-500/25 hover:shadow-cyan-500/5 md:p-12">
                <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">能力与方向</h2>
                <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg md:leading-9">
                  {siteProfile.abilities}
                </p>
              </div>
            </Reveal>
          </section>

          <section id="timeline" className="scroll-mt-32">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">经历与活动</h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                公开分享、竞赛与黑客松项目，按时间倒序排列。
              </p>
            </Reveal>
            <ol className="relative mt-12 space-y-12 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-cyan-500/50 before:via-violet-500/30 before:to-emerald-500/40 md:before:left-[9px]">
              {siteProfile.experience.map((item, i) => (
                <Reveal key={`${item.period}-${item.org}-${item.role}`} delay={0.05 * i}>
                  <li className="relative pl-8 md:pl-10">
                    <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 ring-2 ring-cyan-400/80 md:top-1.5" />
                    <p className="text-sm font-medium text-cyan-300/90">{item.period}</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {item.role}
                      <span className="font-normal text-zinc-500"> · {item.org}</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-7 text-zinc-400 md:text-base md:leading-8">
                      {item.bullets.map((b, j) => (
                        <li key={`${item.period}-${j}`} className="flex gap-3">
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>

          <section id="skills" className="scroll-mt-32">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">技能</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Reveal delay={0.05}>
                <div className="group h-full rounded-3xl border border-white/10 bg-zinc-900/35 p-8 backdrop-blur-md transition hover:border-emerald-400/30 hover:bg-zinc-900/55 md:p-9">
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
              </Reveal>
              <Reveal delay={0.1}>
                <div className="group h-full rounded-3xl border border-white/10 bg-zinc-900/35 p-8 backdrop-blur-md transition hover:border-violet-400/30 hover:bg-zinc-900/55 md:p-9">
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
              </Reveal>
            </div>
          </section>

          <footer className="border-t border-white/10 pt-10 text-center text-sm text-zinc-600">
            © {new Date().getFullYear()} 杨曦哲 · yangxizhe.com
          </footer>
        </div>
      </main>
    </div>
  );
}
