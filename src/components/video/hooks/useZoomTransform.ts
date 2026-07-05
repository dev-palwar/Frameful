
import { useState, useEffect, type RefObject } from "react";
import { resolveZoomTransform, type ZoomEvent } from "@/lib/zoom";

export interface ZoomTransformState {
  scale: number;
  originX: number;
  originY: number;
}

export function useZoomTransform(
  videoRef: RefObject<HTMLVideoElement | null>,
  currentTime: number,
  isPlaying: boolean,
  zoomEvents: ZoomEvent[],
): ZoomTransformState | null {
  const [transform, setTransform] = useState<ZoomTransformState | null>(null);

  useEffect(() => {
    
    if (!isPlaying || !videoRef.current) {
      setTransform(resolveZoomTransform(currentTime, zoomEvents));
      return;
    }

    let frameId: number;
    const loop = () => {
      if (videoRef.current) {
        setTransform(resolveZoomTransform(videoRef.current.currentTime, zoomEvents));
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, currentTime, zoomEvents, videoRef]);

  return transform;
}
