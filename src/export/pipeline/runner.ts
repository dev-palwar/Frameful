import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { ExportOptions } from "../types";
import { computeLayout } from "./layout";
import { renderFrames } from "./canvasRender";

export async function runExport(
  ffmpeg: FFmpeg,
  opts: ExportOptions,
  onCanvasProgress?: (p: number) => void,
): Promise<void> {
  const videoDuration = await probeDuration(opts.videoBlob);
  const layout = computeLayout(opts, videoDuration);

  const { totalFrames, fps } = await renderFrames(
    opts,
    layout,
    async (i, jpeg) => {
      await ffmpeg.writeFile(`f${String(i).padStart(5, "0")}.jpg`, jpeg);
    },
    onCanvasProgress,
  );

  await ffmpeg.writeFile("input.webm", await fetchFile(opts.videoBlob));

  await ffmpeg.exec([
    "-framerate", String(fps),
    "-i", "f%05d.jpg",
    "-ss", String(opts.trimStart),
    "-t", String(layout.duration),
    "-i", "input.webm",
    "-map", "0:v",
    "-map", "1:a:0?",
    "-c:v", "libx264",
    "-crf", String(opts.crf),
    "-pix_fmt", "yuv420p",
    "-preset", "fast",
    "-movflags", "+faststart",
    "-c:a", "aac",
    "-b:a", "128k",
    "-shortest",
    "output.mp4",
  ]);

  const data = await ffmpeg.readFile("output.mp4");
  triggerDownload(
    new Blob([data as unknown as ArrayBuffer], { type: "video/mp4" }),
  );

  const cleanups: Promise<unknown>[] = [];
  for (let i = 0; i < totalFrames; i++) {
    cleanups.push(
      ffmpeg.deleteFile(`f${String(i).padStart(5, "0")}.jpg`).catch(() => {}),
    );
  }
  cleanups.push(
    ffmpeg.deleteFile("input.webm").catch(() => {}),
    ffmpeg.deleteFile("output.mp4").catch(() => {}),
  );
  await Promise.all(cleanups);
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
