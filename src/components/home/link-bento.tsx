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
  github: "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)] hover:shadow-white/10",
  email: "hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.45)]",
  product: "hover:shadow-[0_0_28px_-4px_rgba(52,211,153,0.5)]",
  douyin: "hover:shadow-[0_0_24px_-4px_rgba(244,114,182,0.45)]",
  xiaohongshu: "hover:shadow-[0_0_24px_-4px_rgba(248,113,113,0.45)]",
};

const variantAccent: Record<SiteLink["variant"], string> = {
  github: "from-zinc-500/30 to-zinc-600/10",
  email: "from-cyan-500/35 to-cyan-700/10",
  product: "from-emerald-500/40 to-teal-700/10",
  douyin: "from-fuchsia-500/35 to-pink-700/10",
  xiaohongshu: "from-red-500/35 to-rose-900/10",
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
        className={`group relative col-span-1 flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br ${variantAccent[link.variant]} p-6 text-left md:col-span-2 md:row-span-2 ${variantRing[link.variant]}`}
        whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.18 } }}
        whileTap={reduce ? undefined : { scale: 0.99 }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={reduce ? undefined : { background: glow }}
        />
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/25 text-emerald-200 ring-1 ring-white/15">
              <LinkGlyph variant="product" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-200/90">主力项目</p>
              <p className="text-lg font-semibold">{link.label}</p>
            </div>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-200 ring-1 ring-white/15 transition group-hover:bg-white/20">
            访问 →
          </span>
        </div>
        <p className="relative mt-4 max-w-md text-sm leading-relaxed text-zinc-200/90">{link.blurb}</p>
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
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/12 bg-zinc-900/50 p-5 text-left backdrop-blur-sm transition-colors hover:bg-zinc-900/70 md:min-h-[140px] ${variantRing[link.variant]}`}
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
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-40 blur-2xl ${variantAccent[link.variant]}`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 text-zinc-100 ring-1 ring-white/10">
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
      <p className="relative mt-3 text-sm leading-relaxed text-zinc-400 transition group-hover:text-zinc-300">
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-4">
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
