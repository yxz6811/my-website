"use client";

import { motion, useReducedMotion } from "framer-motion";

type TagStripProps = {
  /** 标签文案 */
  tags: string[];
};

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
  const patternClasses = [
    "before:bg-[radial-gradient(circle_at_50%_50%,#000_0_30%,transparent_32%)]",
    "before:bg-[conic-gradient(from_45deg,#000_0_24%,transparent_24%_50%,#000_50%_74%,transparent_74%_100%)]",
    "before:bg-[radial-gradient(circle_at_25%_35%,#fff_0_25%,transparent_26%),radial-gradient(circle_at_75%_35%,#fff_0_25%,transparent_26%),linear-gradient(#fff,#fff)]",
    "before:bg-[linear-gradient(90deg,transparent_0_20%,#000_20%_24%,transparent_24%_40%,#000_40%_44%,transparent_44%_60%,#000_60%_64%,transparent_64%_100%),linear-gradient(transparent_0_20%,#000_20%_24%,transparent_24%_40%,#000_40%_44%,transparent_44%_60%,#000_60%_64%,transparent_64%_100%)]",
    "before:bg-[radial-gradient(circle_at_25%_25%,#000_0_18%,transparent_20%),radial-gradient(circle_at_75%_25%,#000_0_18%,transparent_20%),radial-gradient(circle_at_50%_72%,#000_0_18%,transparent_20%)]",
    "before:bg-[radial-gradient(circle,#fff_0_58%,transparent_60%)]",
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
            className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br ${paletteClasses[i % paletteClasses.length]} before:absolute before:inset-2 before:content-[''] ${patternClasses[i % patternClasses.length]}`}
          />
          <span className="text-center text-lg tracking-wide text-zinc-100 [text-shadow:0_2px_10px_rgba(255,255,255,0.16)]">
            {tag}
          </span>
          <span className="pointer-events-none absolute inset-0 rounded-[999px] border border-white/0 transition-colors duration-300 group-hover:border-white/15" />
        </motion.article>
      ))}
    </div>
  );
}
