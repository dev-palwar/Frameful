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
  onSelectZoom?: (id: string | null) => void;
  placingZoom?: { id: string; time: number; originX: number; originY: number } | null;
  onFocusChange?: (x: number, y: number) => void;
  onConfirmZoom?: () => void;
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
      onSelectZoom,
      placingZoom,
      onFocusChange,
      onConfirmZoom,
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
      boundsRef,
      wrapperRef,
      scale,
      posX,
      posY,
      isSelected,
      scalePercent,
      setIsSelected,
      startDrag,
      startResize,
      startCrop,
      cropTop,
      cropRight,
      cropBottom,
      cropLeft,
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

    let originX_pct = 50;
    let originY_pct = 50;

    if (activeTransform && containerRef.current) {
      const W = 100;
      const ratio = containerRef.current.clientHeight / containerRef.current.clientWidth;
      const H = W * ratio;
      
      const layout = getExportLayout();

      const PADDING_X = layout.paddingX_frac * W;
      const PADDING_Y = layout.paddingY_frac * H;

      const aW = W - PADDING_X * 2;
      const aH = H - PADDING_Y * 2;

      const svw = aW * layout.scale;
      const svh = aH * layout.scale;

      const canvasPosX = layout.posX_frac * W;
      const canvasPosY = layout.posY_frac * H;

      const vx = W / 2 + canvasPosX - svw / 2;
      const vy = H / 2 + canvasPosY - svh / 2;

      const dsScale = designSettings?.scale ?? 1.0;
      const conW = svw * dsScale;
      const conH = svh * dsScale;
      const conX = vx + (svw - conW) / 2;
      const conY = vy + (svh - conH) / 2;

      const pad = designSettings?.padding ?? 0;
      const scaleFactor = W / 1280;
      const padPx = pad * 16 * scaleFactor;
      
      const vidX = conX + padPx;
      const vidY = conY + padPx;
      const vidW = conW - padPx * 2;
      const vidH = conH - padPx * 2;

      const focalX = vidX + activeTransform.originX * vidW;
      const focalY = vidY + activeTransform.originY * vidH;

      originX_pct = (focalX / W) * 100;
      originY_pct = (focalY / H) * 100;
    }

    const handlePickerFocusChange = (cx: number, cy: number) => {
      if (!onFocusChange || !containerRef.current) return;
      const W = 100;
      const ratio = containerRef.current.clientHeight / containerRef.current.clientWidth;
      const H = W * ratio;
      const layout = getExportLayout();
      const PADDING_X = layout.paddingX_frac * W;
      const PADDING_Y = layout.paddingY_frac * H;
      const aW = W - PADDING_X * 2;
      const aH = H - PADDING_Y * 2;
      const svw = aW * layout.scale;
      const svh = aH * layout.scale;
      const canvasPosX = layout.posX_frac * W;
      const canvasPosY = layout.posY_frac * H;
      const vx = W / 2 + canvasPosX - svw / 2;
      const vy = H / 2 + canvasPosY - svh / 2;
      const dsScale = designSettings?.scale ?? 1.0;
      const conW = svw * dsScale;
      const conH = svh * dsScale;
      const conX = vx + (svw - conW) / 2;
      const conY = vy + (svh - conH) / 2;
      const pad = designSettings?.padding ?? 0;
      const scaleFactor = W / 1280;
      const padPx = pad * 16 * scaleFactor;
      const vidX = conX + padPx;
      const vidY = conY + padPx;
      const vidW = conW - padPx * 2;
      const vidH = conH - padPx * 2;
      const focalX = cx * W;
      const focalY = cy * H;
      const ox = (focalX - vidX) / vidW;
      const oy = (focalY - vidY) / vidH;
      onFocusChange(ox, oy);
    };

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

    const numericRatio = resolveRatio(aspectRatio);
    const paddingBottom = numericRatio
      ? `${(1 / numericRatio) * 100}%`
      : "56.25%";

    const getBlurValue = (): string => {
      if (blur === "none") return "none";
      const t = blurAmount / 100;
      const base = blur === "subtle" ? 4 : blur === "medium" ? 10 : 20; 
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
        {}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 min-h-0">
          <div className="w-full max-w-5xl">
            {}
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden rounded-lg border border-border bg-black/40"
              style={{ paddingBottom }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: activeTransform && activeTransform.scale > 1
                    ? `scale(${activeTransform.scale})`
                    : undefined,
                  transformOrigin: `${originX_pct}% ${originY_pct}%`,
                }}
              >
                {}
                <div
                className="absolute inset-0 bg-center opacity-80 bg-cover"
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

              {}
              <div
                ref={boundsRef}
                className={`absolute inset-0 flex items-center justify-center p-3 sm:p-5 lg:p-8 overflow-hidden ${className}`}
              >
                <div className="relative w-full h-full" style={{ pointerEvents: "none", containerType: "size" }}>
                  <div
                    ref={wrapperRef}
                    id="video-resize-wrapper"
                    style={{
                      position: "absolute",
                      top: `${cropTop}%`,
                      bottom: `${cropBottom}%`,
                      left: `${cropLeft}%`,
                      right: `${cropRight}%`,
                      transform: `translate(${posX}px, ${posY}px) scale(${scale})`,
                      transformOrigin: "center center",
                      cursor: isSelected ? "move" : "default",
                      userSelect: "none",
                      pointerEvents: "auto",
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
                      <div
                        className="w-full h-full overflow-hidden relative"
                        style={{
                          borderRadius:
                            frameSettings && frameSettings.osFrame !== "none"
                              ? 0
                              : innerRadius,
                        }}
                      >
                        <div
                          className="absolute"
                          style={{
                            width: `calc(100% + ${cropLeft + cropRight}cqw)`,
                            height: `calc(100% + ${cropTop + cropBottom}cqh)`,
                            left: `calc(-${cropLeft}cqw)`,
                            top: `calc(-${cropTop}cqh)`,
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
                            }}
                          />
                          {}
                          {/* Picker moved to canvas level */}
                        </div>
                      </div>
                    </FrameWrapper>
                  </div>

                  {}
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

                      {}
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

                      {}
                      {HANDLES.map((h) => {
                        const isCropHandle = h.id === "n" || h.id === "s" || h.id === "e" || h.id === "w";
                        
                        let hTop, hBottom, hLeft, hRight, hTransform;
                        if (h.id.includes("n")) hTop = -5;
                        if (h.id.includes("s")) hBottom = -5;
                        if (h.id.includes("w")) hLeft = -5;
                        if (h.id.includes("e")) hRight = -5;

                        if (h.id === "n" || h.id === "s") {
                          hLeft = "50%";
                          hTransform = "translateX(-50%)";
                        }
                        if (h.id === "w" || h.id === "e") {
                          hTop = "50%";
                          hTransform = "translateY(-50%)";
                        }

                        return (
                          <div
                            key={h.id}
                            onMouseDown={(e) => isCropHandle ? startCrop(e, h.dx, h.dy) : startResize(e, h.dx, h.dy)}
                            style={{
                              position: "absolute",
                              width: 10,
                              height: 10,
                              background: "hsl(var(--brand, 265 80% 65%))",
                              border: "2px solid #fff",
                              borderRadius: 2,
                              cursor: h.cursor,
                              zIndex: 10,
                              top: hTop,
                              bottom: hBottom,
                              left: hLeft,
                              right: hRight,
                              transform: hTransform,
                            }}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
                </div>
              </div>
              </div>
              
              {/* Canvas-level picker */}
              {placingZoom && onFocusChange && onConfirmZoom && (
                <div className="absolute inset-0 z-50">
                  <ZoomFocusPicker
                    originX={originX_pct / 100}
                    originY={originY_pct / 100}
                    onFocusChange={handlePickerFocusChange}
                    onConfirm={onConfirmZoom}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {}
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
              onSelectZoom={onSelectZoom}
            />
          </div>
        )}
      </div>
    );
  },
);

export default VideoPlayer;
