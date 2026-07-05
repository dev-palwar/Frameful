import type { ExportOptions, CanvasLayout } from "../types";

export function computeLayout(
  opts: ExportOptions,
  videoDuration: number,
): CanvasLayout {
  const { outputWidth: W, outputHeight: H } = opts;

  const PADDING_X = Math.round(opts.paddingX_frac * W);
  const PADDING_Y = Math.round(opts.paddingY_frac * H);

  const aW = W - PADDING_X * 2;
  const aH = H - PADDING_Y * 2;

  const svw = Math.round(aW * opts.scale);
  const svh = Math.round(aH * opts.scale);

  const canvasPosX = Math.round(opts.posX_frac * W);
  const canvasPosY = Math.round(opts.posY_frac * H);

  const vx = Math.round(W / 2 + canvasPosX - svw / 2);
  const vy = Math.round(H / 2 + canvasPosY - svh / 2);

  const effectiveTrimEnd = isFinite(opts.trimEnd)
    ? Math.min(opts.trimEnd, videoDuration)
    : videoDuration;

  return {
    svw,
    svh,
    vx,
    vy,
    effectiveTrimEnd,
    duration: effectiveTrimEnd - opts.trimStart,
  };
}
