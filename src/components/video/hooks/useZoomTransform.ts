/**
 * useZoomTransform.ts — Computes the CSS zoom transform for the VideoPlayer.
 *
 * Reads the current playhead time against the list of ZoomEvents and
 * returns the scale + origin to apply to the video element each frame.
 * Returns null when no zoom is active (no transform should be applied).
 */

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
    // When paused or scrubbing, compute from the React state currentTime
    if (!isPlaying || !videoRef.current) {
      setTransform(resolveZoomTransform(currentTime, zoomEvents));
      return;
    }

    // When playing, the timeupdate event (which drives currentTime) only fires ~4 times/sec.
    // To get smooth 60fps zoom interpolation, we must poll the video's internal clock via rAF.
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
