import { useState } from "react";
import { getFFmpeg } from "../ffmpeg";
import { runExport } from "../pipeline";
import type { ExportOptions, ExportState } from "../types";

/**
 * useExport
 * ─────────────────────────────────────────────────────────────────────────────
 * Two-phase export:
 *  Phase 1 (0–50%): Canvas render — plays video in real time, composites all
 *                   design effects frame-by-frame via Canvas 2D API.
 *  Phase 2 (50–100%): FFmpeg encode — H.264 + AAC mux to MP4.
 */
export function useExport(): ExportState & {
  exportVideo: (opts: ExportOptions) => Promise<void>;
} {
  const [isExporting, setIsExporting] = useState(false);
  const [loadingWasm, setLoadingWasm] = useState(false);
  const [progress,    setProgress]    = useState(0);

  const exportVideo = async (opts: ExportOptions): Promise<void> => {
    setLoadingWasm(true);
    setProgress(0);

    let ffmpeg;
    try {
      ffmpeg = await getFFmpeg((p) => {
        // Phase 2: FFmpeg progress maps to 50–100%
        setProgress(0.5 + p * 0.5);
      });
    } finally {
      setLoadingWasm(false);
    }

    setIsExporting(true);
    try {
      await runExport(
        ffmpeg,
        opts,
        // Phase 1: canvas render maps to 0–50%
        (p) => setProgress(p * 0.5),
      );
      // Hold at 100% briefly so the user sees completion before the bar resets
      setProgress(1);
      await new Promise((res) => setTimeout(res, 1500));
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return { exportVideo, isExporting, loadingWasm, progress };
}
