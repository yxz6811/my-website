/**
 * 固定在视口上的轻量暗角：中间绝大部分区域不遮罩（全亮），
 * 仅最上缘、最下缘各约 3cm 用与背景同色的渐变压暗（不随内容滚动）。
 * `pointer-events: none` 不阻挡点击。
 */
export function ViewportReadingBand() {
  const dim = "rgba(4, 7, 14, 0.82)";
  const clear = "rgba(4, 7, 14, 0)";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        background: `linear-gradient(
          to bottom,
          ${dim} 0,
          ${clear} 3cm,
          ${clear} calc(100% - 3cm),
          ${dim} 100%
        )`,
      }}
      aria-hidden
    />
  );
}
