import { forwardRef, useState, useImperativeHandle } from "react";
import Timeline from "./Timeline";
import { HANDLES } from "./config";
import {
  useVideoPlayback,
  useVideoTransform,
  useExportLayout,
  useZoomTransform,
} from "./hooks";
import type { ExportLayout } from "./hooks";
import type { DesignSettings, FrameSettings } from "../toolbar/types";
import { resolveRatio } from "../toolbar/tabs/design/widgets/AspectRatioSelect";
import { FrameWrapper } from "./FrameWrapper";
import { ZoomFocusPicker } from "./ZoomFocusPicker";
import type { ZoomEvent } from "@/lib/zoom";
import { DEFAULT_ZOOM_FACTOR } from "@/lib/zoom";

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
  frameSettings?: FrameSettings;
  zoomEvents?: ZoomEvent[];
  onAddZoom?: (time: number) => void;
  onDeleteZoom?: (id: string) => void;
  onUpdateZoomTime?: (id: string, time: number) => void;
  placingZoom?: { time: number; originX: number; originY: number } | null;
  onFocusChange?: (x: number, y: number) => void;
  onConfirmZoom?: () => void;
  onCancelZoom?: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer(
    {
      videoUrl,
      background = "",
      className = "",
      designSettings,
      frameSettings,
      zoomEvents = [],
      onAddZoom,
      onDeleteZoom,
      onUpdateZoomTime,
      placingZoom,
      onFocusChange,
      onConfirmZoom,
      onCancelZoom,
    },
    ref,
  ) {
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    const {
      videoRef,
      duration,
      currentTime,
      isPlaying,
      handlePlayPause,
      seekTo,
    } = useVideoPlayback({
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

    // Zoom transform — computed fresh on every frame via rAF when playing
    const zoomTransform = useZoomTransform(
      videoRef,
      currentTime,
      isPlaying,
      zoomEvents,
    );

    // If placing a zoom manually, override the display transform to preview it
    const activeTransform = placingZoom
      ? {
          scale: DEFAULT_ZOOM_FACTOR,
          originX: placingZoom.originX,
          originY: placingZoom.originY,
        }
      : zoomTransform;

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
      blur = "none",
      blurAmount = 50,
    } = designSettings || {};

    // Resolve the numeric w/h ratio → CSS paddingBottom percentage
    const numericRatio = resolveRatio(aspectRatio);
    const paddingBottom = numericRatio
      ? `${(1 / numericRatio) * 100}%`
      : "56.25%";

    // Blur: map preset to base px, then scale by blurAmount/100
    const getBlurValue = (): string => {
      if (blur === "none") return "none";
      const t = blurAmount / 100;
      const base = blur === "subtle" ? 4 : blur === "medium" ? 10 : 20; // heavy = 20px
      return `blur(${(base * t).toFixed(1)}px)`;
    };

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
      <div className="flex-1 flex flex-col w-full h-full min-h-0">
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 min-h-0">
          <div className="w-full max-w-5xl">
            {/* 16:9 Cinematic Preview */}
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden rounded-lg border border-border bg-black/40"
              style={{ paddingBottom }}
            >
              {/* Blurred background layer */}
              <div
                className="absolute inset-0 bg-center opacity-80 bg-cover bg-cover"
                style={{
                  background: background.includes("gradient(")
                    ? background
                    : background
                      ? `url(${background})`
                      : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter:
                    getBlurValue() !== "none" ? getBlurValue() : undefined,
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
                    <FrameWrapper
                      settings={frameSettings}
                      innerRadius={innerRadius}
                    >
                      <video
                        ref={videoRef}
                        id="studio-video-player"
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        style={{
                          pointerEvents: "none",
                          display: "block",
                          borderRadius:
                            frameSettings && frameSettings.osFrame !== "none"
                              ? 0
                              : innerRadius,
                          // Auto-zoom transform
                          transform: activeTransform
                            ? `scale(${activeTransform.scale})`
                            : undefined,
                          transformOrigin: activeTransform
                            ? `${activeTransform.originX * 100}% ${activeTransform.originY * 100}%`
                            : "center center",
                          // No CSS transition here! The rAF loop in useZoomTransform handles 60fps interpolation.
                          // A CSS transition here would fight the JS loop and cause stuttering.
                        }}
                      />
                      {/* Interactive focus picker overlay */}
                      {placingZoom &&
                        onFocusChange &&
                        onConfirmZoom &&
                        onCancelZoom && (
                          <ZoomFocusPicker
                            originX={placingZoom.originX}
                            originY={placingZoom.originY}
                            onFocusChange={onFocusChange}
                            onConfirm={onConfirmZoom}
                            onCancel={onCancelZoom}
                          />
                        )}
                    </FrameWrapper>
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
          </div>
        </div>

        {/* Timeline */}
        {duration > 0 && (
          <div className="w-full shrink-0 border-t border-border bg-card p-6">
            <Timeline
              duration={duration}
              trimStart={trimStart}
              trimEnd={trimEnd}
              currentTime={currentTime}
              setTrimStart={setTrimStart}
              setTrimEnd={setTrimEnd}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSeek={seekTo}
              zoomEvents={zoomEvents}
              onAddZoom={onAddZoom}
              onDeleteZoom={onDeleteZoom}
              onUpdateZoomTime={onUpdateZoomTime}
            />
          </div>
        )}
      </div>
    );
  },
);

export default VideoPlayer;
