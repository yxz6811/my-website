"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type {
  ExperienceHighlightGroup,
  ExperienceMoreItem,
} from "@/content/site-profile";
import { ExperienceTimeline } from "@/components/home/experience-timeline";

type ExperienceSectionProps = {
  /** 高光叙事分组 */
  highlights: ExperienceHighlightGroup[];
  /** 折叠区更多经历 */
  more: ExperienceMoreItem[];
};

/**
 * 经历与活动：默认展示叙事高光卡，「更多」折叠为轻量时间轴。
 */
export function ExperienceSection({ highlights, more }: ExperienceSectionProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="mt-10 space-y-8 md:mt-12 md:space-y-10">
      <motion.div
        className="grid gap-5 md:gap-6"
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.08, margin: "0px 0px -5% 0px", once: false }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.09, delayChildren: 0.04 },
          },
        }}
      >
        {highlights.map((group) => (
          <motion.article
            key={group.title}
            className="soft-card rounded-[1.75rem] p-6 md:p-7"
            variants={{
              hidden: reduce
                ? { opacity: 0.7 }
                : { opacity: 0.2, y: 20, filter: "blur(3px)" },
              show: reduce
                ? { opacity: 1 }
                : { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/85">
              {group.title}
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-500">{group.summary}</p>

            <ul className="mt-5 divide-y divide-white/8">
              {group.items.map((item) => (
                <li key={`${group.title}-${item.headline}`} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-base font-semibold text-white md:text-lg">{item.headline}</p>
                  <p className="mt-1 text-sm text-zinc-500">{item.context}</p>
                  {item.note ? (
                    <p className="mt-1.5 text-sm leading-6 text-zinc-400">{item.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>

      {more.length > 0 ? (
        <div>
          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition hover:border-sky-200/25 hover:bg-sky-300/8 hover:text-sky-100"
          >
            <span>{moreOpen ? "收起更多经历" : "展开更多经历"}</span>
            <span
              aria-hidden
              className={`text-xs transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>

          {moreOpen ? (
            <ExperienceTimeline items={more} compact />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
