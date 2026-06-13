import type { ExportOptions, CanvasLayout } from "../types";

/**
 * Converts the user-space layout fractions (from VideoPlayer.getExportLayout)
 * into exact canvas pixel coordinates for the FFmpeg filter graph.
 *
 * Replicates the same object-contain → scale → translate logic that the
 * VideoPlayer CSS transform does, ensuring export matches the preview.
 */
export function computeLayout(
  opts: ExportOptions,
  videoDuration: number,
): CanvasLayout {
  const { outputWidth: W, outputHeight: H } = opts;

  const PADDING_X = Math.round(opts.paddingX_frac * W);
  const PADDING_Y = Math.round(opts.paddingY_frac * H);

  const aW = W - PADDING_X * 2;
  const aH = H - PADDING_Y * 2;

  const videoAR = opts.videoNativeWidth / (opts.videoNativeHeight || 1);

  // Object-contain sizing
  let vw: number;
  let vh: number;
  if (videoAR > aW / aH) {
    vw = aW;
    vh = Math.round(aW / videoAR);
  } else {
    vh = aH;
    vw = Math.round(aH * videoAR);
  }

  // User scale applied around canvas centre
  const svw = Math.round(vw * opts.scale);
  const svh = Math.round(vh * opts.scale);

  // User position offset (fraction → canvas pixels)
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
