import { useCallback } from "react";

export interface ExportLayout {
  scale: number;
  posX_frac: number;
  posY_frac: number;
  paddingX_frac: number;
  paddingY_frac: number;
  videoNativeWidth: number;
  videoNativeHeight: number;
    borderRadius: number;
    shadow: "none" | "hug" | "soft" | "strong";
}

interface UseExportLayoutOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  wrapperRef:   React.RefObject<HTMLDivElement | null>;
  videoRef:     React.RefObject<HTMLVideoElement | null>;
  scale: number;
  posX:  number;
  posY:  number;
}

export function useExportLayout({
  containerRef,
  wrapperRef,
  videoRef,
  scale,
  posX,
  posY,
}: UseExportLayoutOptions) {
  const getExportLayout = useCallback((): ExportLayout => {
    const container = containerRef.current;
    const wrapper   = wrapperRef.current;

    const fallback: ExportLayout = {
      scale,
      posX_frac: 0,
      posY_frac: 0,
      paddingX_frac: 0.05,
      paddingY_frac: 0.05,
      videoNativeWidth:  videoRef.current?.videoWidth  ?? 1280,
      videoNativeHeight: videoRef.current?.videoHeight ?? 720,
      borderRadius: 0,
      shadow: "none",
    };

    if (!container || !wrapper) return fallback;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    
    const wrapperNaturalW = wrapper.offsetWidth;
    const wrapperNaturalH = wrapper.offsetHeight;

    return {
      scale,
      posX_frac:     containerW > 0 ? posX / containerW : 0,
      posY_frac:     containerH > 0 ? posY / containerH : 0,
      paddingX_frac: containerW > 0 ? (containerW - wrapperNaturalW) / 2 / containerW : 0.05,
      paddingY_frac: containerH > 0 ? (containerH - wrapperNaturalH) / 2 / containerH : 0.05,
      videoNativeWidth:  videoRef.current?.videoWidth  ?? 1280,
      videoNativeHeight: videoRef.current?.videoHeight ?? 720,
      borderRadius: 0,
      shadow: "none",
    };
  }, [containerRef, wrapperRef, videoRef, scale, posX, posY]);

  return { getExportLayout };
}
