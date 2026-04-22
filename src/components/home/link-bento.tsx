"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { SiteLink } from "@/content/site-profile";

type LinkBentoProps = {
  /** 来自站点配置的链接列表 */
  links: SiteLink[];
};

const variantRing: Record<SiteLink["variant"], string> = {
  github: "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_26px_64px_-36px_rgba(255,255,255,0.14)]",
  email: "hover:shadow-[0_26px_64px_-34px_rgba(34,211,238,0.34)]",
  product: "hover:shadow-[0_28px_72px_-36px_rgba(52,211,153,0.34)]",
  douyin: "hover:shadow-[0_26px_64px_-34px_rgba(244,114,182,0.32)]",
  xiaohongshu: "hover:shadow-[0_26px_64px_-34px_rgba(248,113,113,0.28)]",
};

const variantAccent: Record<SiteLink["variant"], string> = {
  github: "from-zinc-400/24 to-zinc-700/8",
  email: "from-cyan-400/32 to-sky-700/10",
  product: "from-emerald-400/30 to-teal-700/12",
  douyin: "from-fuchsia-400/28 to-pink-700/10",
  xiaohongshu: "from-red-400/28 to-rose-900/12",
};

/** 极简线性图标，避免依赖图标包 */
function LinkGlyph({ variant }: { variant: SiteLink["variant"] }) {
  const common = "h-7 w-7 shrink-0";
  switch (variant) {
    case "github":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" />
        </svg>
      );
    case "email":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4V6zm0 0l8 6 8-6" />
        </svg>
      );
    case "product":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v10H4V7zm4 14h8M9 21h6" />
        </svg>
      );
    case "douyin":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <rect x="3" y="5" width="14" height="14" rx="3" />
          <path fill="currentColor" stroke="none" d="M10 10.5 15 13.5 10 16.5z" />
        </svg>
      );
    case "xiaohongshu":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h12v16l-4-3-3 3-3-3-2 2V4z" />
          <path strokeLinecap="round" d="M9 9h6M9 12h6M9 15h4" />
        </svg>
      );
  }
}

type InteractiveLinkCardProps = {
  /** 单条链接数据 */
  link: SiteLink;
  /** 是否为主力项目大卡 */
  featured?: boolean;
  /** 小卡片入场延迟 */
  index?: number;
};

/**
 * 可交互卡片：支持微倾斜、鼠标跟随光斑、抬升反馈。
 */
function InteractiveLinkCard({
  link,
  featured = false,
  index = 0,
}: InteractiveLinkCardProps) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 220,
    damping: 22,
    mass: 0.4,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 220,
    damping: 22,
    mass: 0.4,
  });
  const glowX = useTransform(mx, [-0.5, 0.5], [10, 90]);
  const glowY = useTransform(my, [-0.5, 0.5], [10, 90]);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(255,255,255,.17), rgba(255,255,255,0) 62%)`;

  /**
   * 把鼠标坐标映射到 [-0.5, 0.5] 区间，驱动卡片倾斜与光斑位置。
   */
  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mx.set(x);
    my.set(y);
  };

  /**
   * 离开卡片时回正。
   */
  const resetPointer = () => {
    if (reduce) return;
    mx.set(0);
    my.set(0);
  };

  if (featured) {
    return (
      <motion.a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`interactive-sheen interactive-ring group relative col-span-1 flex min-h-[206px] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(10,20,26,0.98),rgba(8,16,24,0.9))] p-5 text-left shadow-[0_30px_70px_-42px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.06)] md:col-span-2 md:row-span-2 md:min-h-[240px] md:p-8 ${variantRing[link.variant]}`}
        whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.18 } }}
        whileTap={reduce ? undefined : { scale: 0.99 }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={reduce ? undefined : { background: glow }}
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${variantAccent[link.variant]} opacity-80`}
          aria-hidden
        />
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />
        <div className="pointer-events-none absolute bottom-5 right-5 flex items-center gap-1.5 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_14px_rgba(255,255,255,0.8)]" />
          <span className="h-px w-12 bg-gradient-to-r from-white/45 to-transparent" />
        </div>
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/24 text-emerald-100 ring-1 ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <LinkGlyph variant="product" />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-emerald-100/80">主力项目</p>
              <p className="mt-1 text-lg font-semibold md:text-xl">{link.label}</p>
            </div>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-200 ring-1 ring-white/15 transition group-hover:bg-white/20">
            访问 →
          </span>
        </div>
        <p className="relative mt-6 max-w-md text-sm leading-7 text-zinc-200/88 md:text-[15px]">
          {link.blurb}
        </p>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={link.href}
      {...(link.href.startsWith("http")
        ? { target: "_blank" as const, rel: "noopener noreferrer" }
        : {})}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`interactive-sheen interactive-ring group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(155deg,rgba(16,24,39,0.88),rgba(8,12,22,0.88))] p-4 text-left shadow-[0_24px_58px_-38px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-colors hover:bg-[linear-gradient(155deg,rgba(18,27,44,0.94),rgba(8,13,24,0.92))] md:min-h-[160px] md:p-7 ${variantRing[link.variant]}`}
      whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.18 } }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ delay: index * 0.02 }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={reduce ? undefined : { background: glow }}
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-65 ${variantAccent[link.variant]}`}
      />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      <div className="pointer-events-none absolute bottom-5 right-5 flex items-center gap-1.5 opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="h-1.5 w-1.5 rounded-full bg-white/75 shadow-[0_0_12px_rgba(255,255,255,0.75)]" />
        <span className="h-px w-8 bg-gradient-to-r from-white/35 to-transparent" />
      </div>
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/28 text-zinc-100 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 group-hover:scale-[1.04] group-hover:ring-white/20">
            <LinkGlyph variant={link.variant} />
          </span>
          <p className="font-semibold">{link.label}</p>
        </div>
        <span
          className="text-sm text-zinc-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-300"
          aria-hidden
        >
          {"\u2197"}
        </span>
      </div>
      <p className="relative mt-4 text-sm leading-7 text-zinc-400 transition group-hover:text-zinc-300">
        {link.blurb}
      </p>
    </motion.a>
  );
}

/**
 * 外链 Bento：突出每条链接的说明与悬停反馈。
 */
export function LinkBento({ links }: LinkBentoProps) {
  const product = links.find((l) => l.variant === "product");
  const rest = links.filter((l) => l.variant !== "product");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-6">
      {product && (
        <InteractiveLinkCard link={product} featured />
      )}

      <div className="contents md:contents">
        {rest.map((link, i) => (
          <InteractiveLinkCard key={link.href} link={link} index={i} />
        ))}
      </div>
    </div>
  );
}
