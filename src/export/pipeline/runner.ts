import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { ExportOptions } from "../types";
import { computeLayout } from "./layout";
import { renderToCanvasBlob } from "./canvasRender";

export async function runExport(
  ffmpeg: FFmpeg,
  opts: ExportOptions,
  onCanvasProgress?: (p: number) => void,
): Promise<void> {
  
  const videoDuration = await probeDuration(opts.videoBlob);
  const layout = computeLayout(opts, videoDuration);

  const renderedBlob = await renderToCanvasBlob(opts, layout, onCanvasProgress);

  await ffmpeg.writeFile("rendered.webm", await fetchFile(renderedBlob));
  await ffmpeg.writeFile("input.webm", await fetchFile(opts.videoBlob));

  const { trimStart } = opts;
  const { duration } = layout;

  await ffmpeg.exec([
    "-i",
    "rendered.webm", 
    "-i",
    "input.webm", 
    "-map",
    "0:v:0", 
    "-map",
    "1:a:0?", 
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

  const data = await ffmpeg.readFile("output.mp4");
  triggerDownload(
    new Blob([data as unknown as ArrayBuffer], { type: "video/mp4" }),
  );

  for (const f of ["rendered.webm", "input.webm", "output.mp4"]) {
    await ffmpeg.deleteFile(f).catch(() => {});
  }
}

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
