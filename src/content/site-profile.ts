/**
 * 站点对外展示用的个人资料。
 * 你只需要改 `siteProfile` 里的文字与链接；无需改页面组件结构。
 */

/** 单条外部链接（社交、作品集等） */
export type SiteLink = {
  /** 按钮或链接上显示的文字 */
  label: string;
  /** 完整 URL，须含 https:// */
  href: string;
};

/** 单段职业 / 项目经历 */
export type ExperienceItem = {
  /** 时间段，例如「2022.03 — 至今」 */
  period: string;
  /** 职位或角色 */
  role: string;
  /** 公司、团队或独立项目名 */
  org: string;
  /** 2～4 条要点，写你做了什么、用什么技术、带来什么结果 */
  bullets: string[];
};

/** 首页 hero 与列表区所需的全部文案 */
export type SiteProfile = {
  /** 顶部小字，例如域名或一句 slogan */
  eyebrow: string;
  /** 主标题第一行（建议一行短句） */
  headlineLead: string;
  /** 主标题第二行，会做成渐变强调 */
  headlineAccent: string;
  /** 自我介绍段落，1～3 句 */
  intro: string;
  /** 技能或兴趣标签，3～8 个为宜 */
  tags: string[];
  /** 主按钮区链接，通常放 GitHub、邮箱、简历 PDF等 */
  primaryLinks: SiteLink[];
  /** 经历列表，按时间倒序（最近的在最前） */
  experience: ExperienceItem[];
};

/**
 * 默认占位内容：请全部换成你的真实信息。
 * 若某段经历暂时不想展示，可把 `experience` 里对应项删掉或注释掉（需保持数组语法合法）。
 */
export const siteProfile: SiteProfile = {
  eyebrow: "YANGXIZHE.COM",
  headlineLead: "你好，我是",
  headlineAccent: "你的名字 / 一句定位",
  intro:
    "用一两句话写清你是谁、目前专注什么、希望访客了解什么。例如：全栈开发，关注性能与可访问性；或设计背景转前端等。",
  tags: ["Next.js", "TypeScript", "React", "待补充技能"],
  primaryLinks: [
    { label: "GitHub", href: "https://github.com/你的用户名" },
    { label: "邮箱", href: "mailto:you@example.com" },
    { label: "Dynadot DNS", href: "https://www.dynadot.com" },
  ],
  experience: [
    {
      period: "20XX.XX — 至今",
      role: "职位或角色",
      org: "公司或项目名",
      bullets: [
        "用动词开头写成果，例如：负责 xxx，使用 xxx，使 xxx 提升/降低 xx%。",
        "可写技术栈：Next.js、Node、PostgreSQL 等。",
        "没有量化数据时，写清职责范围与用户规模也可。",
      ],
    },
    {
      period: "20XX.XX — 20XX.XX",
      role: "上一段职位",
      org: "上一家公司或学校项目",
      bullets: ["要点1", "要点 2"],
    },
  ],
};
