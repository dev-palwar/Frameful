import type { ExportOptions, CanvasLayout } from "../types";

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
    
    "-map", "[out]",
    "-map", "0:a?",
    
    "-ss", String(opts.trimStart),
    "-t",  String(layout.duration),
    
    "-c:v", "libx264",
    "-crf", String(opts.crf),
    "-preset", "fast",
    "-movflags", "+faststart",
    "-c:a", "aac",
    "-b:a", "128k",
    "output.mp4",
  ];
}
