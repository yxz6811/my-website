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

/** 单段职业 / 活动 / 项目经历（时间线） */
export type ExperienceItem = {
  /** 时间段，例如「2025」或「2026.01 — 2026.03」 */
  period: string;
  /** 角色或身份 */
  role: string;
  /** 活动 / 机构 / 项目名称 */
  org: string;
  /** 要点列表 */
  bullets: string[];
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
  /** 主标题第二行（渐变强调） */
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
  /** 能力概述（偏后端、路演、全栈等） */
  abilities: string;
  /** 技能标签（Hero 区 chips） */
  tags: string[];
  /** 主要外链 */
  primaryLinks: SiteLink[];
  /** 时间线：建议时间正序（早 → 晚），页面自上而下 */
  experience: ExperienceItem[];
  /** 技能分栏 */
  skills: SkillGroups;
};

/**
 * 杨曦哲个人站点文案（事实来自作者草稿，表述已统一为书面语）。
 */
export const siteProfile: SiteProfile = {
  eyebrow: "我们被称为 AI 原住民，是因为 AI 对我们来说，就像水和空气一样自然。",
  headlineLead: "你好，我是",
  headlineAccent: "杨曦哲",
  heroTagline: "年龄只是变量，热爱才是常量",
  personaTitle: "喜欢编程的杨同学",
  personaSubtitle: "我的账号",
  intro:
    "我来自浙江杭州，13 岁，是一名热爱编程与人工智能的初中生，喜欢参加黑客松与线下活动。学习与实践兼顾，关注怎样用技术把想法快速做成可用的产品。",
  mediaLine:
    "自媒体账号「喜欢编程的杨同学」，全网粉丝 40 万+；视频号、小红书、抖音单平台粉丝均在 10 万以上，内容侧重 AI 辅助学习、AI 编程与黑客松实录。",
  abilities:
    "技术栈相对全面，做过前端、后端、服务器部署与路演答辩，当前更侧重后端与现场表达。日常以 Cursor 为主进行 AI 辅助开发，也会使用 Codex 或网页端的 Claude 类工具。",
  tags: [
    "C++ / 信奥",
    "后端开发",
    "路演与表达",
    "黑客松",
    "AI 辅助编程",
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
      href: "https://yangtongxue.top/",
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
  /** 经历按时间正序排列（早 → 晚，页面上自上而下） */
  experience: [
    {
      period: "2025",
      role: "主讲嘉宾",
      org: "乌镇健康大会 · AI for Young 论坛",
      bullets: ["分享 AI 编程与 AI 辅助学习主题内容。"],
    },
    {
      period: "2025",
      role: "杭州路演区 KOL",
      org: "AI Agent 大会",
      bullets: ["担任现场 KOL，为参会者介绍与交流 Agent 相关实践。"],
    },
    {
      period: "2025",
      role: "信息学奥林匹克联赛",
      org: "CSP-J / CSP-S",
      bullets: ["普及组二等奖。", "提高组二等奖。"],
    },
    {
      period: "2026",
      role: "Moonshot48 中学生黑客松",
      org: "探月学校",
      bullets: [
        "小组第一名；主要负责技术实现。",
        "项目利用 AI 视觉辅助视障群体完成化妆相关步骤。",
      ],
    },
    {
      period: "2026",
      role: "HackMIT China",
      org: "医疗健康赛道",
      bullets: [
        "获最佳路演奖与赛道二等奖。",
        "项目「智能餐盒」：软硬件结合，关注儿童不在家长身边时的进食与挑食问题。",
      ],
    },
    {
      period: "2026",
      role: "小红书黑客松巅峰赛",
      org: "薯医 · Page One 小组",
      bullets: [
        "全场年龄最小的参赛组之一，获 AI 原住民特别单元奖。",
        "项目「薯医」：用多模态 AI 评估笔记质量、预估评论区并给出优化建议。",
        "使用约 800 条真实笔记与 2400 条评论数据做微调，提升识别准确度、减轻模型幻觉。",
      ],
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
