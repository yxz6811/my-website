"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * 首屏全页加载：文案 + 与百分比同步的进度条，加载完成后淡出。
 */
export function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const progressRef = useRef(0);

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
      const synthetic = (1 - Math.exp(-elapsed / 840)) * 88;
      sync(synthetic);
      raf = requestAnimationFrame(loop);
    };

    const finish = () => {
      if (loadDone) return;
      loadDone = true;
      cancelAnimationFrame(raf);
      sync(100);
      const elapsed = performance.now() - start;
      const minShow = 800;
      const rest = Math.max(0, minShow - elapsed);
      window.setTimeout(() => setFadeOut(true), rest + 100);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("load", finish, { once: true });
    if (document.readyState === "complete") {
      finish();
    }

    return () => {
      loadDone = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", finish);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  const pct = Math.round(progress);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-8 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_0_24%),linear-gradient(180deg,#07111f_0%,#03060d_100%)] px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (fadeOut) setVisible(false);
      }}
      aria-live="polite"
      aria-busy={!fadeOut}
    >
      <div className="relative">
        <div className="animate-pulse-ring absolute inset-[-16%] rounded-full border border-sky-200/15" aria-hidden />
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-[0_24px_64px_-28px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="text-2xl font-semibold tracking-[-0.06em] text-white">Y</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-lg font-medium tracking-wide text-zinc-100">
          Loading<span className="inline-block w-[2.5ch] text-left">...</span>
        </p>
        <p className="text-xs tracking-[0.18em] text-zinc-500">YANGXIZHE.COM</p>
      </div>

      <div className="w-full max-w-[280px] space-y-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
        <p className="text-center font-mono text-sm tabular-nums tracking-widest text-zinc-300">
          {pct}%
        </p>
      </div>
    </motion.div>
  );
}
