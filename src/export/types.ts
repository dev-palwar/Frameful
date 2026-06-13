import type { ExportLayout } from "@/components/video/hooks";

/**
 * Everything the export pipeline needs to produce the output file.
 * Passed in from StudioPage via the useExport hook.
 */
export interface ExportOptions {
  // ── Source ──────────────────────────────────────────────────────────────────
  /** Raw recorded screen Blob from RecorderContext. */
  videoBlob: Blob;
  /** Trim in-point in seconds. */
  trimStart: number;
  /** Trim out-point in seconds. Infinity = full duration. */
  trimEnd: number;

  // ── Layout (from VideoPlayer.getExportLayout()) ──────────────────────────────
  scale:             number;
  posX_frac:         number;
  posY_frac:         number;
  paddingX_frac:     number;
  paddingY_frac:     number;
  videoNativeWidth:  number;
  videoNativeHeight: number;
  borderRadius:      number;
  shadow:            ExportLayout["shadow"];

  // ── Background ──────────────────────────────────────────────────────────────
  /** Data URL or object URL for the background image. Undefined = black fill. */
  backgroundUrl?: string;

  // ── Output ──────────────────────────────────────────────────────────────────
  outputWidth:  number;
  outputHeight: number;
  /** H.264 CRF value (0 = lossless, 51 = worst). Default 22. */
  crf: number;
}

/** Computed canvas pixel coordinates, derived from ExportOptions layout math. */
export interface CanvasLayout {
  /** Scaled video width in canvas pixels. */
  svw: number;
  /** Scaled video height in canvas pixels. */
  svh: number;
  /** Video left edge on canvas. */
  vx: number;
  /** Video top edge on canvas. */
  vy: number;
  /** Effective trim end in seconds (clamped to real duration). */
  effectiveTrimEnd: number;
  /** Export duration in seconds. */
  duration: number;
}

/** Live state exposed by the useExport hook to its consumers. */
export interface ExportState {
  isExporting: boolean;
  loadingWasm: boolean;
  /** Processing progress 0.0 → 1.0. */
  progress: number;
}
