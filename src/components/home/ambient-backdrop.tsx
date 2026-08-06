/**
 * 背景氛围：极轻的单色径向渐变，无漂浮光斑动画。
 */
export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(142,200,232,0.07),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,rgba(142,200,232,0.04),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,rgba(8,11,16,0.55)_100%)]" />
    </div>
  );
}
