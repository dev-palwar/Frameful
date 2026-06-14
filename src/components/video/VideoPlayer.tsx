import { forwardRef, useState, useImperativeHandle } from "react";
import { Play, Pause } from "lucide-react";
import { Typography } from "@/design-system";
import Timeline from "./Timeline";
import { HANDLES } from "./config";
import { useVideoPlayback, useVideoTransform, useExportLayout } from "./hooks";
import type { ExportLayout } from "./hooks";
import type { DesignSettings } from "../toolbar/types";
import { resolveRatio } from "../toolbar/tabs/design/widgets/AspectRatioSelect";

export interface VideoPlayerHandle {
  trimStart: number;
  trimEnd: number;
  getExportLayout(): ExportLayout;
}

export type { ExportLayout };

interface VideoPlayerProps {
  videoUrl: string;
  background?: string;
  className?: string;
  designSettings?: DesignSettings;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer(
    { videoUrl, background = "", className = "", designSettings },
    ref,
  ) {
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    const { videoRef, duration, currentTime, isPlaying, handlePlayPause } =
      useVideoPlayback({
        videoUrl,
        trimStart,
        trimEnd,
        setTrimStart,
        setTrimEnd,
      });

    const {
      containerRef,
      wrapperRef,
      scale,
      posX,
      posY,
      isSelected,
      scalePercent,
      setIsSelected,
      startDrag,
      startResize,
    } = useVideoTransform();

    const { getExportLayout } = useExportLayout({
      containerRef,
      wrapperRef,
      videoRef,
      scale,
      posX,
      posY,
    });

    useImperativeHandle(ref, () => ({ trimStart, trimEnd, getExportLayout }), [
      trimStart,
      trimEnd,
      getExportLayout,
    ]);

    const {
      style = "default",
      padding = 0,
      opacity = 100,
      borderStyle = "sharp",
      radius = 0,
      scale: designScale = 1.0,
      shadow = "none",
      shadowIntensity = 75,
      aspectRatio = "native",
    } = designSettings || {};

    // Resolve the numeric w/h ratio → CSS paddingBottom percentage
    const numericRatio = resolveRatio(aspectRatio);
    const paddingBottom = numericRatio ? `${(1 / numericRatio) * 100}%` : "56.25%";

    const getStyleClasses = () => {
      switch (style) {
        case "glass-light":
          return "bg-white/10 backdrop-blur-md border border-white/20";
        case "glass-dark":
          return "bg-black/40 backdrop-blur-md border border-white/10";
        case "outline":
          return "bg-transparent border-2 border-white/20";
        case "border":
          return "bg-white border-4 border-muted";
        case "border-dark":
          return "bg-black/80 border-4 border-zinc-800";
        default:
          return "";
      }
    };

    const getShadowValue = () => {
      if (shadow === "none") return "none";
      const t = shadowIntensity / 100;
      switch (shadow) {
        case "hug":
          return `0 4px 6px -1px rgba(0,0,0,${(0.35 * t).toFixed(3)}), 0 2px 4px -1px rgba(0,0,0,${(0.2 * t).toFixed(3)})`;
        case "soft":
          return `0 20px 25px -5px rgba(0,0,0,${(0.4 * t).toFixed(3)}), 0 10px 10px -5px rgba(0,0,0,${(0.15 * t).toFixed(3)})`;
        case "strong":
          return `0 25px 50px -12px rgba(0,0,0,${(0.75 * t).toFixed(3)}), 0 8px 20px -4px rgba(0,0,0,${(0.4 * t).toFixed(3)})`;
        default:
          return "none";
      }
    };

    const outerRadius =
      borderStyle === "sharp"
        ? 0
        : borderStyle === "round"
          ? "9999px"
          : `${radius}px`;
    const innerRadius =
      borderStyle === "sharp"
        ? 0
        : borderStyle === "round"
          ? "9999px"
          : `${Math.max(0, radius - padding * 16)}px`;

    return (
      <>
        {/* 16:9 Cinematic Preview */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-lg border border-border bg-black/40"
          style={{ paddingBottom }}
        >
          {/* Blurred background layer */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-[1px] opacity-80"
            style={{
              backgroundImage: background ? `url(${background})` : "none",
            }}
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
              onClick={(e) => {
                e.stopPropagation();
                setIsSelected(true);
              }}
            >
              <div
                className={`w-full h-full flex items-center justify-center transition-all overflow-hidden ${getStyleClasses()}`}
                style={{
                  padding: `${padding}rem`,
                  borderRadius: outerRadius,
                  opacity: opacity / 100,
                  boxShadow: getShadowValue(),
                  transform: `scale(${designScale})`,
                }}
              >
                <video
                  ref={videoRef}
                  id="studio-video-player"
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  style={{
                    pointerEvents: "none",
                    display: "block",
                    borderRadius: innerRadius,
                  }}
                />
              </div>

              {/* Selection ring + resize handles */}
              {isSelected && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "2px dashed hsl(var(--brand, 265 80% 65%))",
                      borderRadius: "6px",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Scale badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: -28,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "hsl(var(--brand, 265 80% 65%))",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      padding: "2px 8px",
                      borderRadius: 4,
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                    }}
                  >
                    {scalePercent}%
                  </div>

                  {/* 8 resize handles */}
                  {HANDLES.map((h) => (
                    <div
                      key={h.id}
                      onMouseDown={(e) => startResize(e, h.dx, h.dy)}
                      style={{
                        position: "absolute",
                        width: 10,
                        height: 10,
                        background: "hsl(var(--brand, 265 80% 65%))",
                        border: "2px solid #fff",
                        borderRadius: 2,
                        cursor: h.cursor,
                        zIndex: 10,
                        ...("top" in h && { top: h.top }),
                        ...("left" in h && { left: h.left }),
                        ...("right" in h && { right: h.right }),
                        ...("bottom" in h && { bottom: h.bottom }),
                        transform:
                          ("left" in h && h.left === "50%") ||
                          ("top" in h && h.top === "50%")
                            ? "translate(-50%, -50%)"
                            : undefined,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 px-6 pt-6 pb-5 mt-4">
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
                <>
                  <Pause className="w-4 h-4" fill="currentColor" />
                  <Typography variant="label" as="span">
                    Pause
                  </Typography>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" fill="currentColor" />
                  <Typography variant="label" as="span">
                    Play Trimmed
                  </Typography>
                </>
              )}
            </button>
          </div>
        </div>
      </>
    );
  },
);

export default VideoPlayer;
