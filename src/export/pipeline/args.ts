import type { ExportOptions, CanvasLayout } from "../types";

/**
 * Assembles the full argument array passed to `ffmpeg.exec()`.
 *
 * Separating this from the filter graph builder keeps each concern
 * independently readable and testable.
 *
 * @param filterGraph  The `-filter_complex` string from buildFilterGraph().
 */
export function buildArgs(
  opts: ExportOptions,
  layout: CanvasLayout,
  filterGraph: string,
): string[] {
  const inputs: string[] = ["-i", "input.webm"];
  if (opts.backgroundUrl) {
    inputs.push("-i", "bg.png");
  }

  return [
    ...inputs,
    "-filter_complex", filterGraph,
    // Map composited video + original audio (? = optional, no crash if absent)
    "-map", "[out]",
    "-map", "0:a?",
    // Trim audio at demuxer level (fast — avoids decoding the full track)
    "-ss", String(opts.trimStart),
    "-t",  String(layout.duration),
    // H.264 / AAC output
    "-c:v", "libx264",
    "-crf", String(opts.crf),
    "-preset", "fast",
    "-movflags", "+faststart",
    "-c:a", "aac",
    "-b:a", "128k",
    "output.mp4",
  ];
}
