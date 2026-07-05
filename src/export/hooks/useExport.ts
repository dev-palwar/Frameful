import { useState } from "react";
import { getFFmpeg } from "../ffmpeg";
import { runExport } from "../pipeline";
import type { ExportOptions, ExportState } from "../types";

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
        
        (p) => setProgress(p * 0.5),
      );
      
      setProgress(1);
      await new Promise((res) => setTimeout(res, 1500));
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return { exportVideo, isExporting, loadingWasm, progress };
}
