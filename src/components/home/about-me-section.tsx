import type { SiteProfile } from "@/content/site-profile";
import { TagStrip } from "@/components/home/tag-strip";

type AboutMeSectionProps = {
  /** 站点文案：第二页左栏内容与标签（头像与账号名在首屏右侧） */
  profile: Pick<SiteProfile, "intro" | "tags">;
};

/**
 * 来自 `site-profile.ts` 顶部注释，作为第二页右栏「我会什么」固定文案。
 */
const WHAT_I_CAN_COPY =
  "我在不断学习项目的全流程，从前端页面的搭建、后端逻辑的编写，到服务器的部署，乃至最后站在台上的路演，我都曾亲身实践过。不过在这些环节中，我最倾注心力、也最擅长的，还是后端开发与路演表达。在日常的代码编写中，我很享受与 AI 协作的 Vibe Coding 状态，那种感觉就像是在玩游戏一样，仿佛感觉不到时间的流逝。有句话说的很好：vibe coding 时代几乎去掉了编程所有的门槛，真正限制你的，只有你的想象力。";

/**
 * 第二页「框」：按手稿布局分为两栏（左「关于我」，右「我会什么」）。
 */
export function AboutMeSection({ profile }: AboutMeSectionProps) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-10 lg:gap-14">
      <section className="flex flex-col gap-6">
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">关于我</h2>
        <p className="text-base leading-relaxed text-zinc-300 md:text-lg md:leading-8">{profile.intro}</p>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">方向标签</p>
          <TagStrip tags={profile.tags} />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">我会什么</h2>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-zinc-300 md:p-7">
          <p className="text-base leading-relaxed md:text-lg md:leading-8">{WHAT_I_CAN_COPY}</p>
        </div>
      </section>
    </div>
  );
}
