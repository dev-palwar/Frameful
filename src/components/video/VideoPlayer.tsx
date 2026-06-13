import { forwardRef, useState, useImperativeHandle } from "react";
import { Play, Pause } from "lucide-react";
import { Typography } from "@/design-system";
import Timeline from "./Timeline";
import { HANDLES } from "./config";
import {
  useVideoPlayback,
  useVideoTransform,
  useExportLayout,
} from "./hooks";
import type { ExportLayout } from "./hooks";

export interface VideoPlayerHandle {
  trimStart: number;
  trimEnd:   number;
  getExportLayout(): ExportLayout;
}

export type { ExportLayout };

interface VideoPlayerProps {
  videoUrl:    string;
  background?: string;
  className?:  string;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer({ videoUrl, background = "", className = "" }, ref) {
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd,   setTrimEnd]   = useState(0);

    const { videoRef, duration, currentTime, isPlaying, handlePlayPause } =
      useVideoPlayback({ videoUrl, trimStart, trimEnd, setTrimStart, setTrimEnd });

    const {
      containerRef, wrapperRef,
      scale, posX, posY,
      isSelected, scalePercent,
      setIsSelected, startDrag, startResize,
    } = useVideoTransform();

    const { getExportLayout } = useExportLayout({
      containerRef, wrapperRef, videoRef, scale, posX, posY,
    });

    useImperativeHandle(ref, () => ({ trimStart, trimEnd, getExportLayout }), [
      trimStart, trimEnd, getExportLayout,
    ]);

    return (
      <>
        {/* 16:9 Cinematic Preview */}
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ paddingBottom: "56.25%" }}
        >
          {/* Blurred background layer */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-[1px] opacity-80"
            style={{ backgroundImage: background ? `url(${background})` : "none" }}
          />

          {/* Video layer */}
          <div
            className={`absolute inset-0 flex items-center justify-center p-3 sm:p-5 lg:p-8 overflow-hidden ${className}`}
          >
            <div
              ref={wrapperRef}
              id="video-resize-wrapper"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transform: `translate(${posX}px, ${posY}px) scale(${scale})`,
                transformOrigin: "center center",
                cursor: isSelected ? "move" : "default",
                userSelect: "none",
              }}
              onMouseDown={startDrag}
              onClick={(e) => { e.stopPropagation(); setIsSelected(true); }}
            >
              <video
                ref={videoRef}
                id="studio-video-player"
                src={videoUrl}
                className="w-full h-full object-contain rounded-md"
                style={{ pointerEvents: "none", display: "block" }}
              />

              {/* Selection ring + resize handles */}
              {isSelected && (
                <>
                  <div style={{
                    position: "absolute", inset: 0,
                    border: "2px dashed hsl(var(--brand, 265 80% 65%))",
                    borderRadius: "6px", pointerEvents: "none",
                  }} />

                  {/* Scale badge */}
                  <div style={{
                    position: "absolute", top: -28, left: "50%",
                    transform: "translateX(-50%)",
                    background: "hsl(var(--brand, 265 80% 65%))",
                    color: "#fff", fontSize: 11, fontWeight: 600,
                    letterSpacing: "0.05em", padding: "2px 8px",
                    borderRadius: 4, whiteSpace: "nowrap", pointerEvents: "none",
                  }}>
                    {scalePercent}%
                  </div>

                  {/* 8 resize handles */}
                  {HANDLES.map((h) => (
                    <div
                      key={h.id}
                      onMouseDown={(e) => startResize(e, h.dx, h.dy)}
                      style={{
                        position: "absolute",
                        width: 10, height: 10,
                        background: "hsl(var(--brand, 265 80% 65%))",
                        border: "2px solid #fff", borderRadius: 2,
                        cursor: h.cursor, zIndex: 10,
                        ...("top"    in h && { top:    h.top    }),
                        ...("left"   in h && { left:   h.left   }),
                        ...("right"  in h && { right:  h.right  }),
                        ...("bottom" in h && { bottom: h.bottom }),
                        transform: (("left" in h && h.left === "50%") || ("top" in h && h.top === "50%"))
                          ? "translate(-50%, -50%)" : undefined,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 px-6 pt-2 pb-5">
          {duration > 0 && (
            <Timeline
              duration={duration}
              trimStart={trimStart}
              trimEnd={trimEnd}
              currentTime={currentTime}
              setTrimStart={setTrimStart}
              setTrimEnd={setTrimEnd}
            />
          )}
          <div className="flex items-center justify-center">
            <button
              id="studio-play-pause-btn"
              onClick={handlePlayPause}
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gradient text-primary-foreground cursor-pointer type-label"
            >
              {isPlaying ? (
                <><Pause className="w-4 h-4" fill="currentColor" /><Typography variant="label" as="span">Pause</Typography></>
              ) : (
                <><Play  className="w-4 h-4" fill="currentColor" /><Typography variant="label" as="span">Play Trimmed</Typography></>
              )}
            </button>
          </div>
        </div>
      </>
    );
  },
);

export default VideoPlayer;
