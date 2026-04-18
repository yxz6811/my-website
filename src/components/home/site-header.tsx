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
    () => items[0]?.href.replace(/^#/, "") ?? "about",
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
    <header
      className={`sticky top-0 z-30 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-white/10 bg-zinc-950/90 shadow-lg shadow-black/20 backdrop-blur-xl" : "border-b border-transparent bg-zinc-950/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <a href="#about" className="group flex items-baseline gap-2">
          <span className="text-sm font-semibold tracking-tight text-white">杨曦哲</span>
          <span className="hidden text-xs text-zinc-500 transition group-hover:text-zinc-400 sm:inline">
            yangxizhe.com
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
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? "bg-white/15 text-white ring-1 ring-white/25"
                    : "text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
