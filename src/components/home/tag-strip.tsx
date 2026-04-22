"use client";

import { motion, useReducedMotion } from "framer-motion";

type TagStripProps = {
  /** 标签文案 */
  tags: string[];
};

type TagGlyphProps = {
  /** 标签文案 */
  tag: string;
};

type TagVisualMeta = {
  /** 图标背景渐变 */
  paletteClass: string;
  /** 图标语义类型 */
  iconType: "olympiad" | "backend" | "speech" | "hackathon" | "vibe" | "media";
};

/**
 * 根据标签文案返回语义化图标类型与配色。
 */
function getTagVisualMeta(tag: string, index: number): TagVisualMeta {
  if (tag.includes("C++") || tag.includes("信奥")) {
    return { iconType: "olympiad", paletteClass: "from-orange-500/90 to-rose-500/90" };
  }
  if (tag.includes("后端")) {
    return { iconType: "backend", paletteClass: "from-pink-300/90 to-fuchsia-400/90" };
  }
  if (tag.includes("路演") || tag.includes("表达")) {
    return { iconType: "speech", paletteClass: "from-violet-500/90 to-purple-500/90" };
  }
  if (tag.includes("黑客松")) {
    return { iconType: "hackathon", paletteClass: "from-cyan-200/90 to-emerald-200/90" };
  }
  if (tag.toLowerCase().includes("vibe")) {
    return { iconType: "vibe", paletteClass: "from-lime-200/90 to-lime-300/90" };
  }
  if (tag.includes("自媒体")) {
    return { iconType: "media", paletteClass: "from-rose-900/80 to-red-900/80" };
  }

  const fallback = [
    "from-orange-500/90 to-rose-500/90",
    "from-pink-300/90 to-fuchsia-400/90",
    "from-violet-500/90 to-purple-500/90",
    "from-cyan-200/90 to-emerald-200/90",
    "from-lime-200/90 to-lime-300/90",
    "from-rose-900/80 to-red-900/80",
  ];
  return { iconType: "vibe", paletteClass: fallback[index % fallback.length] };
}

/**
 * 标签图标：按标签语义渲染更直观的符号。
 */
function TagGlyph({ tag }: TagGlyphProps) {
  const meta = getTagVisualMeta(tag, 0);
  const iconType = meta.iconType;

  if (iconType === "olympiad") {
    return (
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inset-1 rounded-md border-[3px] border-black" />
        <span className="relative text-sm font-black text-black">C++</span>
      </span>
    );
  }

  if (iconType === "backend") {
    return (
      <span className="relative block h-10 w-10">
        <span className="absolute left-1/2 top-[6px] h-2 w-2 -translate-x-1/2 rounded-full bg-black" />
        <span className="absolute left-1/2 top-[12px] h-6 w-7 -translate-x-1/2 rounded-md border-[3px] border-black" />
        <span className="absolute left-1/2 top-[15px] h-[2px] w-5 -translate-x-1/2 bg-black" />
        <span className="absolute left-1/2 top-[19px] h-[2px] w-5 -translate-x-1/2 bg-black" />
      </span>
    );
  }

  if (iconType === "speech") {
    return (
      <span className="relative block h-10 w-10">
        <span className="absolute left-1/2 top-[6px] h-6 w-6 -translate-x-1/2 rounded-full border-[3px] border-white bg-violet-500" />
        <span className="absolute left-1/2 top-[24px] h-2 w-[3px] -translate-x-1/2 rounded-full bg-white" />
        <span className="absolute left-1/2 top-[29px] h-[3px] w-4 -translate-x-1/2 rounded-full bg-white" />
      </span>
    );
  }

  if (iconType === "hackathon") {
    return (
      <span className="relative block h-10 w-10">
        <span className="absolute left-[7px] top-[4px] h-8 w-5 -skew-x-[16deg] rounded-sm bg-black" />
        <span className="absolute left-[17px] top-[14px] h-3 w-3 rotate-45 bg-black" />
      </span>
    );
  }

  if (iconType === "vibe") {
    return (
      <span className="relative block h-10 w-10">
        <span className="absolute left-[11px] top-[7px] h-2 w-2 rotate-45 bg-black" />
        <span className="absolute left-[20px] top-[14px] h-2 w-2 rotate-45 bg-black" />
        <span className="absolute left-[12px] top-[20px] h-2 w-2 rotate-45 bg-black" />
        <span className="absolute left-[5px] top-[14px] h-2 w-2 rotate-45 bg-black" />
        <span className="absolute left-[23px] top-[7px] h-[2px] w-4 rounded-full bg-black" />
      </span>
    );
  }

  return (
    <span className="relative block h-10 w-10">
      <span className="absolute left-1/2 top-[7px] h-7 w-7 -translate-x-1/2 rounded-lg bg-white/95" />
      <span className="absolute left-[13px] top-[12px] h-3 w-4 rounded-sm bg-rose-900/80" />
      <span className="absolute left-[18px] top-[17px] border-y-[4px] border-l-[6px] border-y-transparent border-l-rose-900/80" />
    </span>
  );
}

/**
 * 方向标签展示为带图案的圆形卡片，模拟品牌墙风格。
 */
export function TagStrip({ tags }: TagStripProps) {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {tags.map((tag, i) => (
        <motion.article
          key={tag}
          initial={reduce ? false : { opacity: 0, y: 16, scale: 0.95 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -4, 0],
                }
          }
          whileHover={reduce ? undefined : { y: -6, scale: 1.02 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          className="group relative flex min-h-[156px] cursor-default flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_34%),linear-gradient(155deg,rgba(18,25,40,0.9),rgba(8,12,22,0.88))] p-5 shadow-[0_22px_54px_-34px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.05)]"
          style={
            reduce
              ? undefined
              : {
                  animationDuration: `${4.2 + (i % 3) * 0.8}s`,
                  animationDelay: `${i * 0.15}s`,
                }
          }
        >
          <div className="flex items-start justify-between gap-4">
            {(() => {
              const meta = getTagVisualMeta(tag, i);
              return (
                <span
                  className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${meta.paletteClass} shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]`}
                >
                  <TagGlyph tag={tag} />
                </span>
              );
            })()}
            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <span className="max-w-[13ch] text-left text-lg font-medium leading-7 tracking-[0.01em] text-zinc-100 [text-shadow:0_2px_10px_rgba(255,255,255,0.12)]">
            {tag.includes("/") ? (
              <>
                <span className="block">C++</span>
                <span className="block">信奥</span>
              </>
            ) : (
              tag
            )}
          </span>
          <span className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/0 transition-colors duration-300 group-hover:border-white/16" />
        </motion.article>
      ))}
    </div>
  );
}
