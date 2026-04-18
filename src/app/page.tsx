import { siteProfile } from "@/content/site-profile";

/**
 * 首页：文案来自 `src/content/site-profile.ts`，便于你单独编辑经历与链接。
 */
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.2),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,.2),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(34,197,94,.15),transparent_40%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-14">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md md:p-12">
          <p className="text-sm tracking-[0.25em] text-zinc-300">{siteProfile.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            {siteProfile.headlineLead}
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
              {siteProfile.headlineAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">{siteProfile.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {siteProfile.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {siteProfile.primaryLinks.map((link) => {
              const isHttp = link.href.startsWith("http");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  {...(isHttp
                    ? { target: "_blank" as const, rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">经历</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            在 <code className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-200">src/content/site-profile.ts</code>{" "}
            里按时间倒序编辑；每条用短句要点，便于扫读。
          </p>

          <ol className="mt-10 space-y-10 border-l border-white/15 pl-6 md:pl-8">
            {siteProfile.experience.map((item) => (
              <li key={`${item.period}-${item.org}`} className="relative">
                <span className="absolute -left-[calc(0.25rem+1px)] top-2 h-2 w-2 -translate-x-[0.65rem] rounded-full bg-cyan-400 md:-translate-x-[0.85rem]" />
                <p className="text-sm font-medium text-cyan-200/90">{item.period}</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {item.role}
                  <span className="font-normal text-zinc-400"> · {item.org}</span>
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-300 md:text-base">
                  {item.bullets.map((b, i) => (
                    <li key={`${item.period}-${item.org}-${i}`}>{b}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
