/**
 * 固定在视口上的阅读带：屏幕垂直中线附近最「透」，向上、向下各约 2cm 过渡到与背景同色的渐暗（不随某一块内容移动）。
 * 使用 `pointer-events: none` 不阻挡点击。
 */
export function ViewportReadingBand() {
  const dim = "rgba(9, 9, 11, 0.92)";
  const clear = "rgba(9, 9, 11, 0)";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20"
      style={{
        background: `linear-gradient(
          to bottom,
          ${dim} 0%,
          ${dim} calc(50% - 1cm - 2cm),
          ${clear} calc(50% - 1cm),
          ${clear} calc(50% + 1cm),
          ${dim} calc(50% + 1cm + 2cm),
          ${dim} 100%
        )`,
      }}
      aria-hidden
    />
  );
}
