/**
 * ZoomChip.tsx — A single zoom event marker on the timeline.
 *
 * Renders as a pill positioned at the event's time on the track.
 * Clicking selects it and shows a delete popover.
 * Auto-detected chips are amber, manual chips are violet.
 */

import { useRef, useEffect } from "react";
import { ZoomIn, Trash2 } from "lucide-react";
import type { ZoomEvent } from "@/lib/zoom";

interface ZoomChipProps {
  event: ZoomEvent;
  duration: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
}

export function ZoomChip({
  event,
  duration,
  isSelected,
  onSelect,
  onDeselect,
  onDelete,
  onDragStart,
}: ZoomChipProps) {
  const chipRef = useRef<HTMLDivElement>(null);

  // Deselect when clicking outside this chip
  useEffect(() => {
    if (!isSelected) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (chipRef.current && !chipRef.current.contains(e.target as Node)) {
        onDeselect();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSelected, onDeselect]);

  if (duration === 0) return null;

  // Chip spans the full zoom duration on the timeline
  const halfDur = event.duration / 2;
  const startPct = Math.max(0, ((event.time - halfDur) / duration) * 100);
  const widthPct = (event.duration / duration) * 100;

  const isAuto = event.source === "auto";

  return (
    <div
      ref={chipRef}
      className="absolute top-0 bottom-0 z-20 flex items-center justify-center group"
      style={{
        left: `${startPct}%`,
        width: `${widthPct}%`,
        minWidth: 28,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(event.id);
        onDragStart(event.id);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        onSelect(event.id);
        onDragStart(event.id);
      }}
    >
      {/* Chip body */}
      <div
        className="relative h-full w-full flex items-center justify-center cursor-ew-resize"
        style={{
          background: isAuto
            ? "rgba(245, 158, 11, 0.18)"
            : "rgba(139, 92, 246, 0.18)",
          borderLeft: `2px solid ${isAuto ? "#f59e0b" : "#8b5cf6"}`,
          borderRight: `2px solid ${isAuto ? "#f59e0b" : "#8b5cf6"}`,
          outline: isSelected
            ? `1.5px solid ${isAuto ? "#f59e0b" : "#8b5cf6"}`
            : "none",
          outlineOffset: "1px",
        }}
      >
        <div
          className="flex items-center gap-0.5 px-1 py-0.5 rounded select-none pointer-events-none"
          style={{
            background: isAuto
              ? "rgba(245, 158, 11, 0.85)"
              : "rgba(139, 92, 246, 0.85)",
          }}
        >
          <ZoomIn
            className="shrink-0"
            style={{ width: 9, height: 9, color: "#fff" }}
          />
        </div>
      </div>

      {/* Delete popover — appears above chip when selected */}
      {isSelected && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1 rounded-md shadow-lg border border-border/80"
          style={{
            background: "hsl(var(--card))",
            whiteSpace: "nowrap",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span
            className="text-[10px] font-medium"
            style={{ color: isAuto ? "#f59e0b" : "#8b5cf6" }}
          >
            {isAuto ? "Auto" : "Manual"}
          </span>
          <div className="w-px h-3 bg-border/60 mx-0.5" />
          <button
            className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            title="Delete zoom"
          >
            <Trash2 style={{ width: 11, height: 11 }} />
          </button>
        </div>
      )}
    </div>
  );
}
