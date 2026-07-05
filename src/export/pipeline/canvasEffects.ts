import type { DesignSettings } from "@/components/toolbar/types";

export function clipRounded(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export interface FrameGeometry {
  vidW: number; vidH: number; vidX: number; vidY: number;
  conW: number; conH: number; conX: number; conY: number;
  borderRadius: number;
  scaleFactor: number;
  padding: number;
}

export interface ShadowParams {
  shadow: string;
  shadowBlur: number;
  shadowAlpha: number;
  shadowOffset: number;
}

export function computeFrameGeometry(
  W: number,
  svw: number, svh: number,
  vx: number, vy: number,
  ds: DesignSettings,
): FrameGeometry {
  const padding = ds.padding ?? 0;
  const designScale = ds.scale ?? 1.0;
  const borderStyle = ds.borderStyle ?? "sharp";
  const radius = ds.radius ?? 0;
  const scaleFactor = W / 1280;

  const conW = Math.round(svw * designScale);
  const conH = Math.round(svh * designScale);
  const conX = Math.round(vx + (svw - conW) / 2);
  const conY = Math.round(vy + (svh - conH) / 2);

  const padPx = Math.round(padding * 16 * scaleFactor);
  const vidW = Math.max(1, conW - padPx * 2);
  const vidH = Math.max(1, conH - padPx * 2);
  const vidX = conX + padPx;
  const vidY = conY + padPx;

  const borderRadius =
    borderStyle === "round" ? 9999 :
    borderStyle === "curved" ? radius : 0;

  return {
    vidW, vidH, vidX, vidY,
    conW, conH, conX, conY,
    borderRadius, scaleFactor, padding,
  };
}

export function computeShadow(ds: DesignSettings, scaleFactor: number): ShadowParams {
  const shadow = ds.shadow ?? "none";
  const shadowInt = (ds.shadowIntensity ?? 75) / 100;

  const shadowBlur =
    shadow === "hug" ? 8 * shadowInt * scaleFactor :
    shadow === "soft" ? 25 * shadowInt * scaleFactor :
    shadow === "strong" ? 45 * shadowInt * scaleFactor : 0;
  const shadowAlpha =
    shadow === "hug" ? 0.35 * shadowInt :
    shadow === "soft" ? 0.5 * shadowInt :
    shadow === "strong" ? 0.75 * shadowInt : 0;
  const shadowOffset =
    shadow === "hug" ? 4 * scaleFactor :
    shadow === "soft" ? 12 * scaleFactor :
    shadow === "strong" ? 20 * scaleFactor : 0;

  return { shadow, shadowBlur, shadowAlpha, shadowOffset };
}

export function computeBlurPx(ds: DesignSettings): number {
  const blur = ds.blur ?? "none";
  const blurAmount = (ds.blurAmount ?? 50) / 100;
  const blurBase = blur === "subtle" ? 8 : blur === "medium" ? 18 : blur === "heavy" ? 36 : 0;
  return blurBase * blurAmount;
}
