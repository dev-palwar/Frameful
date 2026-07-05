import type { ExportLayout } from "@/components/video/hooks";
import type { DesignSettings } from "@/components/toolbar/types";
import type { ZoomEvent } from "@/lib/zoom";

export interface ExportOptions {
  
    videoBlob: Blob;
    trimStart: number;
    trimEnd: number;

  scale:             number;
  posX_frac:         number;
  posY_frac:         number;
  paddingX_frac:     number;
  paddingY_frac:     number;
  videoNativeWidth:  number;
  videoNativeHeight: number;
  borderRadius:      number;
  shadow:            ExportLayout["shadow"];

    backgroundUrl?: string;

    designSettings: DesignSettings;

    zoomEvents: ZoomEvent[];

  outputWidth:  number;
  outputHeight: number;
    crf: number;
}

export interface CanvasLayout {
    svw: number;
    svh: number;
    vx: number;
    vy: number;
    effectiveTrimEnd: number;
    duration: number;
}

export interface ExportState {
  isExporting: boolean;
  loadingWasm: boolean;
    progress: number;
}
