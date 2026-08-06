"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * 首屏轻量加载：单色进度，加载完成后淡出。
 */
export function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const progressRef = useRef(0);
  const timeoutRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let loadDone = false;

    const sync = (v: number) => {
      const next = Math.min(100, Math.max(progressRef.current, v));
      progressRef.current = next;
      setProgress(next);
    };

    const loop = () => {
      if (loadDone) return;
      const elapsed = performance.now() - start;
      const synthetic = (1 - Math.exp(-elapsed / 640)) * 88;
      sync(synthetic);
      raf = requestAnimationFrame(loop);
    };

    const finish = () => {
      if (loadDone) return;
      loadDone = true;
      cancelAnimationFrame(raf);
      sync(100);
      const elapsed = performance.now() - start;
      const minShow = 420;
      const rest = Math.max(0, minShow - elapsed);
      timeoutRef.current = window.setTimeout(() => setFadeOut(true), rest + 60);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("load", finish, { once: true });
    if (document.readyState === "complete") {
      finish();
    }

    return () => {
      loadDone = true;
      cancelAnimationFrame(raf);
      clearTimeout(timeoutRef.current);
      window.removeEventListener("load", finish);
    };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (visible) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  if (!visible) return null;

  const pct = Math.round(progress);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-7 bg-[#0a0e14] px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (fadeOut) setVisible(false);
      }}
      aria-live="polite"
      aria-busy={!fadeOut}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/12 bg-white/[0.03]">
        <span className="text-xl font-semibold tracking-[-0.06em] text-white">Y</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium tracking-wide text-zinc-200">加载中</p>
        <p className="text-[11px] tracking-[0.16em] text-zinc-600">YANGXIZHE.COM</p>
      </div>

      <div className="w-full max-w-[220px] space-y-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 24 }}
          />
        </div>
        <p className="text-center font-mono text-xs tabular-nums tracking-widest text-zinc-500">
          {pct}%
        </p>
      </div>
    </motion.div>
  );
}
