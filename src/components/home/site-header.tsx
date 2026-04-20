"use client";

import { useEffect, useState } from "react";

type NavItem = { href: string; label: string };

type SiteHeaderProps = {
  /** 导航项（须与页面 section id 对应） */
  items: readonly NavItem[];
};

/**
 * 顶栏：滚动时背景加强；根据滚动位置高亮当前区块锚点。
 */
export function SiteHeader({ items }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(
    () => items[0]?.href.replace(/^#/, "") ?? "top",
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = items.map((i) => i.href.replace(/^#/, ""));
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2, 0.4, 0.6] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
      <div
        className={`mx-auto max-w-6xl rounded-[1.75rem] border transition-[background-color,box-shadow,transform,backdrop-filter] duration-300 ${
          scrolled
            ? "border-white/12 bg-slate-950/78 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
            : "border-white/8 bg-slate-950/46 shadow-[0_10px_34px_-26px_rgba(0,0,0,0.78)] backdrop-blur-xl"
        }`}
      >
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <a href="#top" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              Y
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white">杨曦哲</span>
              <span className="text-[11px] tracking-[0.18em] text-zinc-500 transition group-hover:text-zinc-400">
                YANGXIZHE.COM
              </span>
            </span>
          </a>
          <nav className="flex flex-wrap gap-1.5 sm:justify-end" aria-label="页面内导航">
          {items.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-white/18 to-sky-300/10 text-white ring-1 ring-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    : "text-zinc-400 hover:bg-white/8 hover:text-zinc-100"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          </nav>
        </div>
      </div>
    </header>
  );
}
