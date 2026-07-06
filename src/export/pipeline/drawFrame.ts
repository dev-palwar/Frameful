import type { DesignSettings } from "@/components/toolbar/types";
import type { CanvasLayout } from "../types";
import { resolveZoomTransform } from "@/lib/zoom";
import type { ZoomEvent } from "@/lib/zoom";
import {
  clipRounded,
  computeFrameGeometry,
  computeShadow,
  computeBlurPx,
} from "./canvasEffects";
import type { FrameGeometry } from "./canvasEffects";

export interface DrawFrameConfig {
  W: number;
  H: number;
  layout: CanvasLayout;
  designSettings: DesignSettings;
  bgImg: HTMLImageElement | null;
  zoomEvents: ZoomEvent[];
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  videoEl: HTMLVideoElement,
  config: DrawFrameConfig,
) {
  const { W, H, designSettings: ds, bgImg, zoomEvents } = config;
  const { svw, svh, vx, vy } = config.layout;
  const geo = computeFrameGeometry(W, svw, svh, vx, vy, ds);
  const { shadow, shadowBlur, shadowAlpha, shadowOffset } = computeShadow(ds, geo.scaleFactor);
  const blurPx = computeBlurPx(ds);
  const opacity = (ds.opacity ?? 100) / 100;
  const style = ds.style ?? "default";

  ctx.clearRect(0, 0, W, H);

  const zoom = resolveZoomTransform(videoEl.currentTime, zoomEvents);
  ctx.save();
  
  if (zoom && zoom.scale > 1) {
    const focalX = geo.vidX + zoom.originX * geo.vidW;
    const focalY = geo.vidY + zoom.originY * geo.vidH;
    ctx.translate(focalX, focalY);
    ctx.scale(zoom.scale, zoom.scale);
    ctx.translate(-focalX, -focalY);
  }

  drawBackground(ctx, bgImg, W, H, blurPx);
  drawShadowLayer(ctx, shadow, shadowBlur, shadowAlpha, shadowOffset, geo);
  drawStyleFrame(ctx, style, geo);
  drawVideoLayer(ctx, videoEl, geo, opacity);
  drawStyleBorder(ctx, style, geo);
  
  ctx.restore();
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  bgImg: HTMLImageElement | null,
  W: number, H: number,
  blurPx: number,
) {
  if (bgImg) {
    const bgAR = bgImg.width / bgImg.height;
    const canvasAR = W / H;
    let bw = W, bh = H, bx = 0, by = 0;
    if (bgAR > canvasAR) { bh = H; bw = bh * bgAR; bx = (W - bw) / 2; }
    else { bw = W; bh = bw / bgAR; by = (H - bh) / 2; }
    ctx.save();
    if (blurPx > 0) ctx.filter = `blur(${blurPx}px)`;
    ctx.globalAlpha = 0.85;
    ctx.drawImage(bgImg, bx, by, bw, bh);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.restore();
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

function drawShadowLayer(
  ctx: CanvasRenderingContext2D,
  shadow: string,
  shadowBlur: number,
  shadowAlpha: number,
  shadowOffset: number,
  geo: FrameGeometry,
) {
  if (shadow === "none" || shadowBlur <= 0) return;
  ctx.save();
  ctx.shadowColor = `rgba(0,0,0,${shadowAlpha})`;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetY = shadowOffset;
  ctx.fillStyle = "rgba(0,0,0,0.01)";
  clipRounded(ctx, geo.conX, geo.conY, geo.conW, geo.conH, geo.borderRadius * geo.scaleFactor);
  ctx.fill();
  ctx.restore();
}

function drawStyleFrame(
  ctx: CanvasRenderingContext2D,
  style: string,
  geo: FrameGeometry,
) {
  const fills: Record<string, string> = {
    "glass-light": "rgba(255,255,255,0.55)",
    "glass-dark": "rgba(15,10,30,0.65)",
    "border": "white",
    "border-dark": "rgba(0,0,0,0.8)",
  };
  const fill = fills[style];
  if (!fill) return;

  ctx.save();
  clipRounded(ctx, geo.conX, geo.conY, geo.conW, geo.conH, geo.borderRadius * geo.scaleFactor);
  ctx.clip();
  ctx.fillStyle = fill;
  ctx.fillRect(geo.conX, geo.conY, geo.conW, geo.conH);
  ctx.restore();
}

function drawVideoLayer(
  ctx: CanvasRenderingContext2D,
  videoEl: HTMLVideoElement,
  geo: FrameGeometry,
  opacity: number,
) {
  const innerRadius = geo.borderRadius > 0
    ? Math.max(0, geo.borderRadius - geo.padding * 16) * geo.scaleFactor
    : 0;

  ctx.save();
  ctx.globalAlpha = opacity;

  if (innerRadius > 0) {
    clipRounded(ctx, geo.vidX, geo.vidY, geo.vidW, geo.vidH, innerRadius);
  } else {
    ctx.beginPath();
    ctx.rect(geo.vidX, geo.vidY, geo.vidW, geo.vidH);
  }
  ctx.clip();

  drawVideoCover(ctx, videoEl, geo.vidX, geo.vidY, geo.vidW, geo.vidH);
  ctx.restore();
}

function drawVideoCover(
  ctx: CanvasRenderingContext2D,
  videoEl: HTMLVideoElement,
  dx: number, dy: number, dw: number, dh: number,
) {
  const sw = videoEl.videoWidth;
  const sh = videoEl.videoHeight;
  if (sw === 0 || sh === 0) return;

  const vidAR = sw / sh;
  const destAR = dw / dh;

  let sx: number, sy: number, sWidth: number, sHeight: number;
  if (vidAR > destAR) {
    sHeight = sh;
    sWidth = sh * destAR;
    sx = (sw - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = sw;
    sHeight = sw / destAR;
    sx = 0;
    sy = (sh - sHeight) / 2;
  }

  ctx.drawImage(videoEl, sx, sy, sWidth, sHeight, dx, dy, dw, dh);
}

function drawStyleBorder(
  ctx: CanvasRenderingContext2D,
  style: string,
  geo: FrameGeometry,
) {
  const borders: Record<string, { color: string; width: number }> = {
    "outline": { color: "rgba(139,92,246,0.65)", width: 2 },
    "border": { color: "#e4d8f8", width: 4 },
    "border-dark": { color: "#2a2a2a", width: 4 },
  };
  const b = borders[style];
  if (!b) return;

  ctx.save();
  clipRounded(ctx, geo.conX, geo.conY, geo.conW, geo.conH, geo.borderRadius * geo.scaleFactor);
  ctx.strokeStyle = b.color;
  ctx.lineWidth = b.width * geo.scaleFactor;
  ctx.stroke();
  ctx.restore();
}
