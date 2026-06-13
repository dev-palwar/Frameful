import { useState } from "react";
import { getFFmpeg } from "../ffmpeg";
import { runExport } from "../pipeline";
import type { ExportOptions, ExportState } from "../types";

/**
 * useExport
 * ─────────────────────────────────────────────────────────────────────────────
 * The single public hook of the export pipeline. StudioPage is the only
 * consumer — it calls `exportVideo(opts)` and reads `isExporting`, `loadingWasm`,
 * and `progress` to drive the UI.
 *
 * Internally it:
 *   1. Lazy-loads the FFmpeg WASM binary on first call (shows loadingWasm)
 *   2. Registers the progress callback on the shared instance
 *   3. Delegates the actual work to `runExport` in the pipeline
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
      ffmpeg = await getFFmpeg((p) => setProgress(p));
    } finally {
      setLoadingWasm(false);
    }

    setIsExporting(true);
    try {
      await runExport(ffmpeg, opts);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return { exportVideo, isExporting, loadingWasm, progress };
}
