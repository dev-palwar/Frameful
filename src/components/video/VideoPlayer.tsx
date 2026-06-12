import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import Timeline from "./Timeline";
import { Play, Pause } from "lucide-react";
import { Typography } from "@/design-system/Typography";

export interface VideoPlayerHandle {
  trimStart: number;
  trimEnd: number;
  scale: number;
  posX: number; // −1 … +1 relative to canvas half-width
  posY: number; // −1 … +1 relative to canvas half-height
}

interface VideoPlayerProps {
  videoUrl: string;
  background?: string;
  className?: string;
}

// 8 resize handle positions
const HANDLES = [
  { id: "nw", cursor: "nwse-resize", top: -5, left: -5, dx: -1, dy: -1 },
  { id: "n",  cursor: "ns-resize",   top: -5, left: "50%", dx: 0,  dy: -1 },
  { id: "ne", cursor: "nesw-resize", top: -5, right: -5,   dx: 1,  dy: -1 },
  { id: "w",  cursor: "ew-resize",   top: "50%", left: -5, dx: -1, dy: 0  },
  { id: "e",  cursor: "ew-resize",   top: "50%", right: -5,dx: 1,  dy: 0  },
  { id: "sw", cursor: "nesw-resize", bottom: -5, left: -5, dx: -1, dy: 1  },
  { id: "s",  cursor: "ns-resize",   bottom: -5, left: "50%", dx: 0, dy: 1 },
  { id: "se", cursor: "nwse-resize", bottom: -5, right: -5,  dx: 1, dy: 1  },
] as const;

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer({ videoUrl, background = "", className = "" }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [trimStart, setTrimStart] = useState<number>(0);
    const [trimEnd, setTrimEnd] = useState<number>(0);

    // ── Resize / position state ──────────────────────────────────────────────
    const [isSelected, setIsSelected] = useState(false);
    const [scale, setScale] = useState(1);
    const [posX, setPosX] = useState(0); // px offset from natural centre
    const [posY, setPosY] = useState(0);

    useImperativeHandle(
      ref,
      () => ({ trimStart, trimEnd, scale, posX, posY }),
      [trimStart, trimEnd, scale, posX, posY],
    );

    // ── Video event listeners ────────────────────────────────────────────────
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      const handleLoadedMetadata = () => {
        const d = video.duration;
        setDuration(d);
        setTrimStart(0);
        setTrimEnd(d);
      };
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }, [videoUrl]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      const handleTimeUpdate = () => {
        const current = video.currentTime;
        setCurrentTime(current);
        if (current >= trimEnd) {
          video.pause();
          setIsPlaying(false);
          video.currentTime = trimStart;
        }
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
      };
    }, [trimStart, trimEnd]);

    const handlePlayPause = () => {
      const video = videoRef.current;
      if (!video) return;
      if (isPlaying) {
        video.pause();
      } else {
        if (video.currentTime < trimStart || video.currentTime >= trimEnd) {
          video.currentTime = trimStart;
        }
        video.play();
      }
    };

    // ── Deselect on outside click ────────────────────────────────────────────
    useEffect(() => {
      if (!isSelected) return;
      const onDown = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setIsSelected(false);
        }
      };
      document.addEventListener("mousedown", onDown);
      return () => document.removeEventListener("mousedown", onDown);
    }, [isSelected]);

    // ── Drag-to-move ─────────────────────────────────────────────────────────
    const startDrag = useCallback(
      (e: React.MouseEvent) => {
        if (!isSelected) return;
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX - posX;
        const startY = e.clientY - posY;
        const onMove = (ev: MouseEvent) => {
          setPosX(ev.clientX - startX);
          setPosY(ev.clientY - startY);
        };
        const onUp = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      },
      [isSelected, posX, posY],
    );

    // ── Resize handle drag ───────────────────────────────────────────────────
    const startResize = useCallback(
      (e: React.MouseEvent, dx: number, dy: number) => {
        e.preventDefault();
        e.stopPropagation();
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const containerSize = Math.min(rect.width, rect.height);
        const startX = e.clientX;
        const startY = e.clientY;
        const startScale = scale;

        const onMove = (ev: MouseEvent) => {
          const deltaX = (ev.clientX - startX) * dx;
          const deltaY = (ev.clientY - startY) * dy;
          // Use the dominant axis delta; if both axes, average them
          let delta: number;
          if (dx === 0) delta = deltaY;
          else if (dy === 0) delta = deltaX;
          else delta = (deltaX + deltaY) / 2;

          const newScale = Math.max(0.2, Math.min(3, startScale + delta / containerSize));
          setScale(newScale);
        };
        const onUp = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      },
      [scale],
    );

    const scalePercent = Math.round(scale * 100);

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
            style={{
              backgroundImage: background ? `url(${background})` : "none",
            }}
          />

          {/* Video layer — overflow hidden so video stays clipped to 16:9 box */}
          <div
            className={`absolute inset-0 flex items-center justify-center p-3 sm:p-5 lg:p-8 overflow-hidden ${className}`}
          >
            {/*
              Draggable / resizable wrapper.
              transform: translate(posX, posY) scale(scale)
              pointer-events are managed carefully so that clicking the video
              selects it without conflicting with drag.
            */}
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
                  {/* Dashed selection border */}
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
                        // position offsets
                        ...(h.top !== undefined && { top: h.top }),
                        ...(h.left !== undefined && { left: h.left }),
                        ...(h.right !== undefined && { right: h.right }),
                        ...(h.bottom !== undefined && { bottom: h.bottom }),
                        transform:
                          (h.left === "50%" || h.top === "50%")
                            ? "translate(-50%, -50%)"
                            : undefined,
                        zIndex: 10,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls — below the video */}
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

          {/* Play / Pause */}
          <div className="flex items-center justify-center">
            <button
              id="studio-play-pause-btn"
              onClick={handlePlayPause}
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gradient text-primary-foreground cursor-pointer type-label"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" fill="currentColor" />
                  <Typography variant="label" as="span">Pause</Typography>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" fill="currentColor" />
                  <Typography variant="label" as="span">Play Trimmed</Typography>
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
