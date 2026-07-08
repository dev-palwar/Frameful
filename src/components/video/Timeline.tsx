import { useRef, useState, useEffect, useCallback } from "react";
import { Typography } from "@/design-system/Typography";
import { Play, Pause, ZoomIn } from "lucide-react";
import type { ZoomEvent } from "@/lib/zoom";
import { DEFAULT_ZOOM_DURATION, DEFAULT_ZOOM_FACTOR } from "@/lib/zoom";
import { ZoomChip } from "./ZoomChip";

interface TimelineProps {
  duration: number;
  trimStart: number;
  trimEnd: number;
  currentTime: number;
  setTrimStart: (time: number) => void;
  setTrimEnd: (time: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  
  zoomEvents?: ZoomEvent[];
  onAddZoom?: (time: number) => void;
  onDeleteZoom?: (id: string) => void;
  onUpdateZoomTime?: (id: string, time: number) => void;
  onSelectZoom?: (id: string | null) => void;
}

const MIN_TRIM_DURATION = 1; 

export default function Timeline({
  duration,
  trimStart,
  trimEnd,
  currentTime,
  setTrimStart,
  setTrimEnd,
  isPlaying,
  onPlayPause,
  onSeek,
  zoomEvents = [],
  onAddZoom,
  onDeleteZoom,
  onUpdateZoomTime,
  onSelectZoom,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ type: "start" | "end" | "playhead" | "zoom"; id?: string } | null>(null);
  const [selectedZoomId, setSelectedZoomId] = useState<string | null>(null);

  const pixelToTime = useCallback(
    (pixel: number): number => {
      if (!trackRef.current) return 0;
      const trackWidth = trackRef.current.offsetWidth;
      const rect = trackRef.current.getBoundingClientRect();
      const relativeX = pixel - rect.left;
      const clampedX = Math.max(0, Math.min(relativeX, trackWidth));
      return (clampedX / trackWidth) * duration;
    },
    [duration],
  );

  useEffect(() => {
    if (!dragging) return;

    const getClientX = (e: MouseEvent | TouchEvent): number => {
      if ("touches" in e) return e.touches[0]?.clientX ?? 0;
      return e.clientX;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const newTime = pixelToTime(getClientX(e));
      if (dragging.type === "start") {
        setTrimStart(Math.max(0, Math.min(newTime, trimEnd - MIN_TRIM_DURATION)));
      } else if (dragging.type === "end") {
        setTrimEnd(Math.max(trimStart + MIN_TRIM_DURATION, Math.min(newTime, duration)));
      } else if (dragging.type === "playhead") {
        onSeek(Math.max(0, Math.min(newTime, duration)));
      } else if (dragging.type === "zoom" && dragging.id && onUpdateZoomTime) {
        onUpdateZoomTime(dragging.id, Math.max(0, Math.min(newTime, duration)));
      }
    };

    const handleUp = () => setDragging(null);

    document.addEventListener("mousemove", handleMove as EventListener);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleMove as EventListener, { passive: false });
    document.addEventListener("touchend", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMove as EventListener);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove as EventListener);
      document.removeEventListener("touchend", handleUp);
    };
  }, [dragging, trimStart, trimEnd, duration, setTrimStart, setTrimEnd, pixelToTime, onSeek, onUpdateZoomTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startPercent = (trimStart / duration) * 100;
  const endPercent = (trimEnd / duration) * 100;
  const playheadPercent = (currentTime / duration) * 100;

  const handleTrackClick = (e: React.MouseEvent) => {
    if (dragging) return;
    
    setSelectedZoomId(null);
    onSelectZoom?.(null);
    const newTime = pixelToTime(e.clientX);
    onSeek(newTime);
  };

  const handleAddZoom = () => {
    if (!onAddZoom) return;
    onAddZoom(currentTime);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {}
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayPause}
          className="text-foreground hover:text-primary transition-colors focus:outline-none"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
        </button>
        <Typography variant="code" className="text-muted-foreground select-none">
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>

        {}
        {zoomEvents.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground select-none">
            <ZoomIn className="w-3 h-3" />
            <span>{zoomEvents.length} zoom{zoomEvents.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Timeline track */}
      <div
        ref={trackRef}
        className="relative h-16 bg-muted/20 rounded-md overflow-visible cursor-pointer select-none border border-border/50"
        onMouseDown={handleTrackClick}
      >
        {}
        <div
          className="absolute top-0 bottom-0 left-0 bg-black/60 z-10 pointer-events-none rounded-l-md"
          style={{ width: `${startPercent}%` }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 bg-black/60 z-10 pointer-events-none rounded-r-md"
          style={{ width: `${100 - endPercent}%` }}
        />

        {}
        <div
          className="absolute top-0 bottom-0 border-y-2 border-primary z-10 pointer-events-none"
          style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
        />

        {}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-700 opacity-30 pointer-events-none rounded-md" />

        {}
        {zoomEvents.map((event) => (
          <ZoomChip
            key={event.id}
            event={event}
            duration={duration}
            isSelected={selectedZoomId === event.id}
            onSelect={(id) => {
              setSelectedZoomId(id);
              onSelectZoom?.(id);
            }}
            onDeselect={() => {
              setSelectedZoomId(null);
              onSelectZoom?.(null);
            }}
            onDelete={(id) => {
              setSelectedZoomId(null);
              onSelectZoom?.(null);
              onDeleteZoom?.(id);
            }}
            onDragStart={(id) => setDragging({ type: "zoom", id })}
          />
        ))}

        {}
        <div
          className="absolute top-0 bottom-0 w-px bg-primary z-30 flex justify-center cursor-ew-resize group"
          style={{ left: `${playheadPercent}%` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging({ type: "playhead" });
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setDragging({ type: "playhead" });
          }}
        >
          <div className="absolute -top-1 w-3 h-3 bg-primary rounded-full shadow-sm group-hover:scale-125 transition-transform" />
          <div className="absolute inset-y-0 w-4 -ml-2" /> {}
        </div>

        {}
        <div
          className="absolute top-0 bottom-0 w-4 bg-primary z-40 cursor-ew-resize flex items-center justify-center group rounded-l-sm"
          style={{ left: `calc(${startPercent}% - 8px)` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging({ type: "start" });
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setDragging({ type: "start" });
          }}
        >
          <div className="w-1 h-6 bg-primary-foreground/60 rounded-full group-hover:bg-primary-foreground transition-colors" />
        </div>

        {}
        <div
          className="absolute top-0 bottom-0 w-4 bg-primary z-40 cursor-ew-resize flex items-center justify-center group rounded-r-sm"
          style={{ left: `calc(${endPercent}% - 8px)` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging({ type: "end" });
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setDragging({ type: "end" });
          }}
        >
          <div className="w-1 h-6 bg-primary-foreground/60 rounded-full group-hover:bg-primary-foreground transition-colors" />
        </div>
      </div>

      {}
      <div className="flex items-center gap-2 pt-0.5">
        <span className="text-[10px] font-semibold tracking-widest text-muted-foreground/50 uppercase select-none">
          Tools
        </span>
        <div className="w-px h-3 bg-border/60" />

        {}
        <button
          id="add-zoom-btn"
          onClick={handleAddZoom}
          disabled={!onAddZoom}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
          title="Add a zoom effect at the current playhead position"
        >
          <ZoomIn className="w-3 h-3" />
          Add Zoom
        </button>

        {}
        <span className="text-[10px] text-muted-foreground/50 select-none">
          {DEFAULT_ZOOM_FACTOR}× · {DEFAULT_ZOOM_DURATION}s
        </span>
      </div>
    </div>
  );
}

