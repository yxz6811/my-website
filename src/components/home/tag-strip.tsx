"use client";

import { motion, useReducedMotion } from "framer-motion";

type TagStripProps = {
  /** 标签文案 */
  tags: string[];
};

type TagGlyphProps = {
  /** 标签序号，用于分配固定图案 */
  index: number;
};

/**
 * 标签图标：按序号渲染 6 组固定几何图案。
 */
function TagGlyph({ index }: TagGlyphProps) {
  const id = index % 6;

  if (id === 0) {
    return (
      <span className="relative block h-10 w-10">
        <span className="absolute left-1 top-1 h-8 w-8 rounded-[30%] border-[4px] border-black" />
        <span className="absolute left-[8px] top-[4px] h-4 w-4 rounded-b-full bg-black" />
        <span className="absolute left-[18px] top-[4px] h-4 w-4 rounded-b-full bg-black" />
      </span>
    );
  }

  if (id === 1) {
    return (
      <span className="relative block h-10 w-10 overflow-hidden rounded-[8%] bg-pink-100">
        <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
        <span className="absolute left-0 top-0 h-5 w-5 bg-pink-100" />
        <span className="absolute right-0 top-0 h-5 w-5 bg-pink-100" />
        <span className="absolute bottom-0 left-0 h-5 w-5 bg-pink-100" />
        <span className="absolute bottom-0 right-0 h-5 w-5 bg-pink-100" />
      </span>
    );
  }

  if (id === 2) {
    return (
      <span className="relative block h-10 w-10">
        <span className="absolute inset-0 rounded-[28%] bg-white" />
        <span className="absolute left-1/2 top-1/2 h-5 w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500" />
        <span className="absolute left-1/2 top-1/2 h-[5px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500" />
      </span>
    );
  }

  if (id === 3) {
    return (
      <span className="relative grid h-10 w-10 grid-cols-4 grid-rows-4 gap-[2px]">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className={`rounded-sm ${i % 3 === 0 || i % 5 === 0 ? "bg-black" : "bg-black/25"}`}
          />
        ))}
      </span>
    );
  }

  if (id === 4) {
    return (
      <span className="relative block h-10 w-10">
        <span className="absolute left-1/2 top-[4px] h-4 w-4 -translate-x-1/2 rounded-full bg-black" />
        <span className="absolute left-[4px] top-[15px] h-4 w-4 rounded-full bg-black" />
        <span className="absolute right-[4px] top-[15px] h-4 w-4 rounded-full bg-black" />
        <span className="absolute left-1/2 top-[24px] h-4 w-4 -translate-x-1/2 rounded-full bg-black" />
      </span>
    );
  }

  return (
    <span className="relative block h-10 w-10">
      <span className="absolute inset-1 rounded-full bg-white" />
      <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white/70" />
    </span>
  );
}

/**
 * 方向标签展示为带图案的圆形卡片，模拟品牌墙风格。
 */
export function TagStrip({ tags }: TagStripProps) {
  const reduce = useReducedMotion();
  const paletteClasses = [
    "from-orange-500/90 to-rose-500/90",
    "from-pink-300/90 to-fuchsia-400/90",
    "from-violet-500/90 to-purple-500/90",
    "from-cyan-200/90 to-emerald-200/90",
    "from-lime-200/90 to-lime-300/90",
    "from-rose-900/80 to-red-900/80",
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
                  y: [0, -5, 0],
                }
          }
          whileHover={reduce ? undefined : { y: -8, scale: 1.03 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          className="group relative flex aspect-[3/4] cursor-default flex-col items-center justify-center gap-4 overflow-hidden rounded-[999px] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_45%),linear-gradient(160deg,rgba(22,22,25,0.9),rgba(7,7,9,0.95))] p-4 shadow-[inset_0_0_28px_rgba(255,255,255,0.03)]"
          style={
            reduce
              ? undefined
              : {
                  animationDuration: `${4.2 + (i % 3) * 0.8}s`,
                  animationDelay: `${i * 0.15}s`,
                }
          }
        >
          <span
            className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br ${paletteClasses[i % paletteClasses.length]}`}
          >
            <TagGlyph index={i} />
          </span>
          <span className="text-center text-lg tracking-wide text-zinc-100 [text-shadow:0_2px_10px_rgba(255,255,255,0.16)]">
            {tag}
          </span>
          <span className="pointer-events-none absolute inset-0 rounded-[999px] border border-white/0 transition-colors duration-300 group-hover:border-white/15" />
        </motion.article>
      ))}
    </div>
  );
}
