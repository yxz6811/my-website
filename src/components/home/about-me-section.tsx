import type { SiteProfile } from "@/content/site-profile";
import { TagStrip } from "@/components/home/tag-strip";

type AboutMeSectionProps = {
  /** 站点文案：第二页左栏内容与标签（头像与账号名在首屏右侧） */
  profile: Pick<SiteProfile, "intro" | "tags">;
};

/**
 * 来自 `site-profile.ts` 顶部注释，作为第二页右栏「我会什么」固定文案。
 */
const WHAT_I_CAN_PARAGRAPHS = [
  "我在不断学习项目的全流程，从前端页面的搭建、后端逻辑的编写，到服务器的部署，乃至最后站在台上的路演，我都曾亲身实践过。",
  "不过在这些环节中，我最倾注心力、也最擅长的，还是后端开发与路演表达。在日常的代码编写中，我很享受与 AI 协作的 Vibe Coding 状态，那种感觉就像是在玩游戏一样，仿佛感觉不到时间的流逝。",
  "有句话说的很好：vibe coding 时代几乎去掉了编程所有的门槛，真正限制你的，只有你的想象力。",
];

/**
 * 第二页「框」：按手稿布局分为两栏（左「关于我」，右「我会什么」）。
 */
export function AboutMeSection({ profile }: AboutMeSectionProps) {
  return (
    <div className="grid gap-14 md:grid-cols-2 md:gap-16 lg:gap-24">
      <section className="flex h-full flex-col justify-between gap-9 py-3 md:gap-10 md:py-4">
        <h2 className="mb-2 text-4xl font-semibold tracking-tight text-white md:mb-4 md:text-5xl lg:text-6xl">关于我</h2>
        <p className="mt-5 max-w-[28ch] text-base leading-8 text-zinc-200/95 italic tracking-[0.012em] [text-shadow:0_2px_14px_rgba(34,211,238,0.12)] first-letter:mr-1 first-letter:text-cyan-100 first-letter:[text-shadow:0_0_14px_rgba(165,243,252,0.35)] md:mt-7 md:max-w-[30ch] md:text-lg md:leading-9">
          {profile.intro}
        </p>
        <div className="mt-auto rounded-2xl border border-white/8 bg-zinc-900/35 p-5 md:max-w-[30ch] md:p-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">方向标签</p>
          <div className="max-w-[26ch]">
            <TagStrip tags={profile.tags} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-7 md:gap-8">
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">我会什么</h2>
        <div className="relative overflow-hidden rounded-2xl border border-cyan-200/12 bg-gradient-to-br from-cyan-500/[0.07] via-zinc-900/70 to-black/55 p-7 md:p-9">
          <div
            className="pointer-events-none absolute -right-14 top-8 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl"
            aria-hidden
          />
          <div className="relative space-y-5 border-l border-cyan-200/20 pl-4 md:space-y-6 md:pl-5">
            {WHAT_I_CAN_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 tracking-[0.012em] text-zinc-200/95 md:text-lg md:leading-9">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
