import type { ExportOptions, CanvasLayout } from "../types";
import { drawFrame } from "./drawFrame";
import type { DrawFrameConfig } from "./drawFrame";

const EXPORT_FPS = 30;
const SEEK_TIMEOUT_MS = 3000;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

function waitForSeek(video: HTMLVideoElement, time: number): Promise<void> {
  if (Math.abs(video.currentTime - time) < 0.005) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let done = false;
    const onSeeked = () => {
      if (done) return;
      done = true;
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    const fallback = setTimeout(() => {
      if (!done) { done = true; video.removeEventListener("seeked", onSeeked); resolve(); }
    }, SEEK_TIMEOUT_MS);
    video.addEventListener("seeked", onSeeked);
    video.currentTime = time;
    void fallback;
  });
}

async function resolveDuration(v: HTMLVideoElement): Promise<number> {
  if (isFinite(v.duration)) return v.duration;
  await new Promise<void>((r) => {
    const cb = () => { v.removeEventListener("seeked", cb); r(); };
    v.addEventListener("seeked", cb);
    v.currentTime = 1e9;
  });
  return v.duration;
}

function canvasToJpeg(canvas: HTMLCanvasElement, q = 0.92): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) { reject(new Error("toBlob failed")); return; }
        resolve(new Uint8Array(await blob.arrayBuffer()));
      },
      "image/jpeg",
      q,
    );
  });
}

export interface RenderedFrames {
  totalFrames: number;
  fps: number;
}

export async function renderFrames(
  opts: ExportOptions,
  layout: CanvasLayout,
  onFrame: (index: number, jpeg: Uint8Array) => Promise<void>,
  onProgress?: (p: number) => void,
): Promise<RenderedFrames> {
  const { outputWidth: W, outputHeight: H } = opts;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const bgImg = opts.backgroundUrl ? await loadImage(opts.backgroundUrl) : null;

  const blobUrl = URL.createObjectURL(opts.videoBlob);
  const videoEl = document.createElement("video");
  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.preload = "auto";
  videoEl.src = blobUrl;

  await new Promise<void>((res, rej) => {
    videoEl.onerror = () => rej(new Error("Failed to load video"));
    videoEl.onloadedmetadata = () => res();
    videoEl.load();
  });

  const realDuration = await resolveDuration(videoEl);
  const trimEnd = Math.min(
    isFinite(layout.effectiveTrimEnd) ? layout.effectiveTrimEnd : realDuration,
    realDuration,
  );
  const duration = Math.max(trimEnd - opts.trimStart, 0.001);
  const totalFrames = Math.ceil(duration * EXPORT_FPS);

  const config: DrawFrameConfig = {
    W, H, layout,
    designSettings: opts.designSettings,
    bgImg,
    zoomEvents: opts.zoomEvents,
  };

  for (let i = 0; i < totalFrames; i++) {
    const t = opts.trimStart + i / EXPORT_FPS;
    if (t > trimEnd) break;

    await waitForSeek(videoEl, t);
    drawFrame(ctx, videoEl, config);

    const jpeg = await canvasToJpeg(canvas);
    await onFrame(i, jpeg);

    onProgress?.(i / totalFrames);

    if (i % 10 === 0) await new Promise((r) => setTimeout(r, 0));
  }

  onProgress?.(1);
  URL.revokeObjectURL(blobUrl);

  return { totalFrames, fps: EXPORT_FPS };
}
