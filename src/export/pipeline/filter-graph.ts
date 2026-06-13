import type { ExportOptions, CanvasLayout } from "../types";

/**
 * Builds the FFmpeg `-filter_complex` string for the export.
 *
 * Two branches:
 *   - WITH background image  → scale + blur + opacity + overlay
 *   - NO background image    → synthetic black fill + overlay
 *
 * Future design effects (border-radius, shadow) plug in here as additional
 * filter chains without touching any other file.
 */
export function buildFilterGraph(
  opts: ExportOptions,
  layout: CanvasLayout,
): string {
  const { outputWidth: W, outputHeight: H, trimStart } = opts;
  const { svw, svh, vx, vy, effectiveTrimEnd } = layout;

  // Video trim + scale filter — shared between both branches
  const vidFilter = [
    `[0:v] trim=start=${trimStart}:end=${effectiveTrimEnd}`,
    `setpts=PTS-STARTPTS`,
    `scale=${svw}:${svh} [vid]`,
  ].join(", ");

  if (opts.backgroundUrl) {
    // ── Background image branch ─────────────────────────────────────────────
    // [1] = bg.png — scale to fill canvas, blur, dim to 80% opacity
    const bgFilter = [
      `[1:v] scale=${W}:${H}:force_original_aspect_ratio=increase`,
      `crop=${W}:${H}`,
      `gblur=sigma=1`,
      `colorchannelmixer=aa=0.8 [bg]`,
    ].join(", ");

    return [bgFilter, vidFilter, `[bg][vid] overlay=${vx}:${vy}:format=auto [out]`].join("; ");
  }

  // ── Black fill branch ───────────────────────────────────────────────────────
  const blackBg = `color=black:size=${W}x${H}:rate=30 [bg]`;
  return [blackBg, vidFilter, `[bg][vid] overlay=${vx}:${vy}:format=auto [out]`].join("; ");
}
