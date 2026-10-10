/**
 * 站点对外展示用的个人资料。
 * 编辑 `siteProfile` 即可更新首页；类型见下方 `SiteProfile`。
 */

/** 外链卡片样式与图标类型（与 `link-bento` 配色对应） */
export type SiteLinkVariant = "github" | "email" | "product" | "douyin" | "xiaohongshu";

/** 单条外部链接（社交、作品集等） */
export type SiteLink = {
  /** 按钮或链接上显示的文字 */
  label: string;
  /** 完整 URL，须含 https://；邮箱使用 mailto: */
  href: string;
  /** 卡片内一行说明，可写用途或更新频率 */
  blurb: string;
  /** 视觉分类，用于图标与强调色 */
  variant: SiteLinkVariant;
};

/** 高光叙事卡内的单条经历（短结构：标题 + 场合 + 可选一句） */
export type ExperienceHighlightEntry = {
  /** 主标题：结果或身份 */
  headline: string;
  /** 场合与邀请方 */
  context: string;
  /** 可选补充；没有则不渲染 */
  note?: string;
  /** 可选视频链接；有值时在条目右侧展示入口 */
  videoHref?: string;
};

/** 高光分组：按故事线合并多条经历 */
export type ExperienceHighlightGroup = {
  /** 分组标题，如「官方舞台」 */
  title: string;
  /** 一行总述 */
  summary: string;
  /** 组内条目（顺序即展示顺序） */
  items: ExperienceHighlightEntry[];
};

/** 「更多经历」时间轴条目（轻量，避免 bullet 墙） */
export type ExperienceMoreItem = {
  /** 时间段，例如「2025」 */
  period: string;
  /** 主标题 */
  headline: string;
  /** 场合一行 */
  context: string;
  /** 可选补充 */
  note?: string;
};

/** 技能分栏 */
export type SkillGroups = {
  /** 已熟练掌握的方向 */
  mastered: string[];
  /** 正在加强的方向 */
  learning: string[];
};

/** 首页所需的全部文案 */
export type SiteProfile = {
  /** 顶部小字 */
  eyebrow: string;
  /** 主标题第一行 */
  headlineLead: string;
  /** 主标题第二行（强调） */
  headlineAccent: string;
  /** 首屏主按钮下方标语 */
  heroTagline: string;
  /** 「关于我」头像下大号名称（如自媒体昵称） */
  personaTitle: string;
  /** 「关于我」昵称下居中说明 */
  personaSubtitle: string;
  /** 身份与简介段落（可2～4 句），展示在「关于我」区块 */
  intro: string;
  /** 一句话概括自媒体账号（可选展示） */
  mediaLine: string;
  /** 技能标签（Hero 区 chips） */
  tags: string[];
  /** 主要外链 */
  primaryLinks: SiteLink[];
  /** 经历高光：按叙事分组，默认展开 */
  experienceHighlights: ExperienceHighlightGroup[];
  /** 更多经历：折叠区时间轴 */
  experienceMore: ExperienceMoreItem[];
  /** 技能分栏 */
  skills: SkillGroups;
};

/**
 * 杨曦哲个人站点文案（事实来自作者草稿，表述已统一为书面语）。
 */
export const siteProfile: SiteProfile = {
  eyebrow: "用 AI 解决真实痛点的超级个体",
  headlineLead: "你好，我是",
  headlineAccent: "杨曦哲",
  heroTagline:
    "把编程、产品与内容做成闭环：先找真实问题，再用 AI 与工程把它做成可演示、可传播的东西。",
  personaTitle: "喜欢编程的杨同学",
  personaSubtitle: "创作者 · 演讲者 · 建造者",
  intro:
    "我来自浙江杭州，是一名 13 岁的初中生。编程与人工智能是我最大的热爱。课余时间，我会走出书房，去黑客松和技术聚会里把想法变成可演示的产品——比如薯医（多模态笔记评估）、智能餐盒、AI 视觉辅助视障化妆。比起空谈概念，我更在意：技术有没有真正帮到人。",
  mediaLine:
    "自媒体账号「喜欢编程的杨同学」，全网粉丝 50 万+；视频号、小红书、抖音单平台粉丝均在 10 万以上，内容侧重 AI 辅助学习、AI 编程与黑客松实录。",
  tags: [
    "全栈技术（偏后端）",
    "黑客松产品",
    "路演与演讲",
    "C++ / 信奥",
    "Vibe Coding",
    "自媒体",
  ],
  primaryLinks: [
    {
      label: "GitHub",
      href: "https://github.com/yxz6811",
      blurb: "开源仓库、小工具与黑客松相关代码。",
      variant: "github",
    },
    {
      label: "邮箱",
      href: "mailto:3978401510@qq.com",
      blurb: "合作、演讲或项目联系：3978401510@qq.com",
      variant: "email",
    },
    {
      label: "薯医项目",
      href: "https://noterx.muran.tech/",
      blurb: "多模态笔记评估与评论区预估，线上可体验。",
      variant: "product",
    },
    {
      label: "抖音",
      href: "https://v.douyin.com/-3l3aJWSg1w/",
      blurb: "短视频：AI 编程、学习与黑客松记录。",
      variant: "douyin",
    },
    {
      label: "小红书",
      href: "https://xhslink.com/m/8ktq1Ms53vg",
      blurb: "图文与视频：AI 辅助学习与创作实践。",
      variant: "xiaohongshu",
    },
  ],
  /**
   * 经历高光：三条叙事线。
   * 官方舞台里乌镇偏后（第一次大舞台）；行业现场里 WAIC 单独成组偏后。
   * 黑客松组里，回响·48H 是最后一条奖项；AdventureX 写参与，放在本组末尾。
   */
  experienceHighlights: [
    {
      title: "官方舞台",
      summary: "受品牌与平台邀请的公开演讲。",
      items: [
        {
          headline: "网络视听创作者大会嘉宾",
          context: "上海 · 小红书官方邀请",
          note: "《凌晨6点，我和AI一起看了上海的日出》",
          videoHref:
            "https://www.xiaohongshu.com/explore/6a19711e0000000035033ef8?xsec_token=ABaBLX0qkDmjEOdIMv-ENu--N2JYf-PUtseP1kzpHNAU0=&xsec_source=pc_search&source=web_explore_feed",
        },
        {
          headline: "苹果返校季嘉宾",
          context: "广州未来社 · 苹果官方邀请",
          note: "《不写代码，写灵感：13岁AI原住民的mac创造之旅》",
          videoHref:
            "https://www.xiaohongshu.com/explore/6a5a1c4d000000000101eee8?xsec_token=ABvbUwIBPd9mFmA0Ept08ybi1Wdo4EZzhNg6nBeUzig8w=&xsec_source=pc_search&source=web_explore_feed",
        },
        {
          headline: "乌镇健康大会主讲",
          context: "AI for Young 论坛 · 第一次登上大舞台演讲",
          note: "AI 编程与 AI 辅助学习",
          videoHref:
            "https://www.xiaohongshu.com/explore/67fb3d99000000001200fa23?xsec_token=ABaHjKIKgcnZKn7BuKI887WX1Zw7vX8UXpm3RI3HtkvJk=&xsec_source=pc_search",
        },
      ],
    },
    {
      title: "黑客松与作品",
      summary: "组队做出可演示的产品，其中多场拿到奖项。",
      items: [
        {
          headline: "AI 原住民特别单元奖",
          context: "小红书黑客松巅峰赛 · 薯医",
          note: "多模态笔记评估与评论区预估",
        },
        {
          headline: "最佳路演奖 · 赛道二等奖",
          context: "HackMIT China · 智能餐盒",
        },
        {
          headline: "小组全场第一",
          context: "Moonshot48 · 探月学校",
          note: "AI 视觉辅助视障化妆",
        },
        {
          headline: "教育赛道第二名",
          context: "回响·48H · 学军中学",
        },
        {
          headline: "五天里做出可演示的作品",
          context: "AdventureX 2026 · OvO",
          note: "游戏陪玩 Agent 的语音模块",
        },
      ],
    },
    {
      title: "行业现场",
      summary: "走进一线大会与平台现场。",
      items: [
        {
          headline: "小红书特邀科技博主",
          context: "WAIC 世界人工智能大会",
          note: "参观大会并小红书展台打卡",
        },
      ],
    },
  ],
  /** 更多经历：默认折叠，Agent KOL 与 CSP 放此处 */
  experienceMore: [
    {
      period: "2025",
      headline: "杭州路演区 KOL",
      context: "AI Agent 大会",
    },
    {
      period: "2025",
      headline: "信息学奥林匹克联赛",
      context: "CSP-J / CSP-S",
      note: "普及组、提高组二等奖",
    },
  ],
  skills: {
    mastered: [
      "C++（信息学竞赛训练与实战）",
      "路演与现场表达（多次大会与黑客松答辩）",
      "内容制作与宣传（自媒体拍摄与运营）",
    ],
    learning: [
      "AI 辅助编程（Vibe Coding，多工具切换）",
      "云服务器与运维相关实践",
      "前端与后端工程化",
      "UI 与视觉设计",
      "提示词工程与多轮协作",
    ],
  },
};

/**
 * 供 AI 夸夸/吐槽墙使用的站长画像摘要（与页面展示同源，避免幻觉）。
 */
export function buildAiWallContext(): string {
  const p = siteProfile;
  const highlights = p.experienceHighlights
    .flatMap((g) =>
      g.items.map((item) => `- [${g.title}] ${item.headline}（${item.context}）${item.note ? `：${item.note}` : ""}`),
    )
    .join("\n");
  const more = p.experienceMore
    .map((item) => `- ${item.period} ${item.headline}（${item.context}）${item.note ? `：${item.note}` : ""}`)
    .join("\n");

  return [
    `姓名：杨曦哲`,
    `自媒体：${p.personaTitle}`,
    `定位：${p.eyebrow}`,
    `简介：${p.intro}`,
    `自媒体：${p.mediaLine}`,
    `标签：${p.tags.join("、")}`,
    `代表作品链接：薯医 ${p.primaryLinks.find((l) => l.variant === "product")?.href ?? ""}`,
    `经历高光：\n${highlights}`,
    `更多经历：\n${more}`,
    `技能（已掌握）：${p.skills.mastered.join("；")}`,
    `技能（在学）：${p.skills.learning.join("；")}`,
  ].join("\n");
}
