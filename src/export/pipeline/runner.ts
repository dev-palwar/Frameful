import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { ExportOptions } from "../types";
import { computeLayout } from "./layout";
import { renderToCanvasBlob } from "./canvasRender";

/**
 * Full export pipeline:
 *  1. Canvas render  — plays the video in real time, drawing every frame with
 *                      all design effects (glass, shadow, blur, border-radius…)
 *                      via the Canvas 2D API. Produces a WebM blob (no audio).
 *  2. FFmpeg mux     — combines the rendered WebM (video) with the original
 *                      recording (audio) and encodes to H.264 MP4.
 */
export async function runExport(
  ffmpeg: FFmpeg,
  opts: ExportOptions,
  onCanvasProgress?: (p: number) => void,
): Promise<void> {
  // ── 1. Probe duration ─────────────────────────────────────────────────────
  const videoDuration = await probeDuration(opts.videoBlob);
  const layout = computeLayout(opts, videoDuration);

  // ── 2. Canvas render (all CSS-like effects) ───────────────────────────────
  const renderedBlob = await renderToCanvasBlob(opts, layout, onCanvasProgress);

  // ── 3. Write files to FFmpeg virtual FS ──────────────────────────────────
  await ffmpeg.writeFile("rendered.webm", await fetchFile(renderedBlob));
  await ffmpeg.writeFile("input.webm", await fetchFile(opts.videoBlob));

  // ── 4. Mux: rendered video track + original audio track → MP4 ────────────
  const { trimStart } = opts;
  const { duration } = layout;

  await ffmpeg.exec([
    "-i",
    "rendered.webm", // [0] canvas-rendered video (no audio)
    "-i",
    "input.webm", // [1] original recording (audio only)
    "-map",
    "0:v:0", // video from canvas render
    "-map",
    "1:a:0?", // audio from original (? = optional)
    "-ss",
    String(trimStart),
    "-t",
    String(duration),
    "-c:v",
    "libx264",
    "-crf",
    String(opts.crf),
    "-preset",
    "fast",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "output.mp4",
  ]);

  // ── 5. Download ────────────────────────────────────────────────────────────
  const data = await ffmpeg.readFile("output.mp4");
  triggerDownload(
    new Blob([data as unknown as ArrayBuffer], { type: "video/mp4" }),
  );

  // ── 6. Cleanup ─────────────────────────────────────────────────────────────
  for (const f of ["rendered.webm", "input.webm", "output.mp4"]) {
    await ffmpeg.deleteFile(f).catch(() => {});
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function probeDuration(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve(video.duration);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      resolve(Infinity);
      URL.revokeObjectURL(url);
    };
    video.src = url;
  });
}

function triggerDownload(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Cutline-${new Date().toISOString().slice(0, 10)}.mp4`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
