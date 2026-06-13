import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { ExportOptions } from "../types";
import { computeLayout } from "./layout";
import { buildFilterGraph } from "./filter-graph";
import { buildArgs } from "./args";

/**
 * Runs the full FFmpeg export pipeline:
 *   1. Write input files to the WASM virtual FS
 *   2. Execute the filter graph
 *   3. Read the output and trigger a browser download
 *   4. Clean up the virtual FS
 *
 * This is the only file with side effects in the pipeline directory.
 * All pure computation (layout, filter graph, args) is delegated upward.
 */
export async function runExport(
  ffmpeg: FFmpeg,
  opts: ExportOptions,
): Promise<void> {
  // ── 1. Probe video duration from the blob ─────────────────────────────────
  const videoDuration = await probeDuration(opts.videoBlob);

  // ── 2. Compute layout ─────────────────────────────────────────────────────
  const layout      = computeLayout(opts, videoDuration);
  const filterGraph = buildFilterGraph(opts, layout);
  const args        = buildArgs(opts, layout, filterGraph);

  // ── 3. Write inputs to virtual FS ─────────────────────────────────────────
  await ffmpeg.writeFile("input.webm", await fetchFile(opts.videoBlob));
  if (opts.backgroundUrl) {
    await ffmpeg.writeFile("bg.png", await fetchFile(opts.backgroundUrl));
  }

  // ── 4. Execute ────────────────────────────────────────────────────────────
  await ffmpeg.exec(args);

  // ── 5. Read output and download ───────────────────────────────────────────
  const data = await ffmpeg.readFile("output.mp4");
  const blob = new Blob(
    [data as any],
    { type: "video/mp4" },
  );
  triggerDownload(blob);

  // ── 6. Clean up virtual FS ────────────────────────────────────────────────
  await ffmpeg.deleteFile("input.webm");
  await ffmpeg.deleteFile("output.mp4");
  if (opts.backgroundUrl) await ffmpeg.deleteFile("bg.png");
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Reads the duration of a video Blob without adding it to the DOM. */
function probeDuration(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url   = URL.createObjectURL(blob);
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

/** Creates a temporary <a> and clicks it to trigger the browser download. */
function triggerDownload(blob: Blob): void {
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href  = url;
  link.download = `frameful-${new Date().toISOString().slice(0, 10)}.mp4`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
