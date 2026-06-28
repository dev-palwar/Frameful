/**
 * ZoomFocusPicker — Interactive overlay for placing a zoom focus point.
 *
 * Renders as an absolute overlay on the video container. The user can
 * click anywhere or drag the circular focus indicator to set the zoom
 * origin. The parent applies a live zoom on the video as the focus moves.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { Check, X } from "lucide-react";
import { DEFAULT_ZOOM_FACTOR } from "@/lib/zoom";

interface ZoomFocusPickerProps {
  originX: number; // 0–1
  originY: number; // 0–1
  onFocusChange: (x: number, y: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ZoomFocusPicker({
  originX,
  originY,
  onFocusChange,
  onConfirm,
  onCancel,
}: ZoomFocusPickerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Trigger fade-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const getRelativePos = useCallback(
    (clientX: number, clientY: number) => {
      if (!overlayRef.current) return { x: 0.5, y: 0.5 };
      const rect = overlayRef.current.getBoundingClientRect();
      return {
        x: Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width)),
        y: Math.max(0.05, Math.min(0.95, (clientY - rect.top) / rect.height)),
      };
    },
    [],
  );

  // Global drag handlers
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const { x, y } = getRelativePos(e.clientX, e.clientY);
      onFocusChange(x, y);
    };
    const onUp = () => setIsDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, getRelativePos, onFocusChange]);

  // Click on overlay → move focus there
  const handleOverlayClick = (e: React.MouseEvent) => {
    const { x, y } = getRelativePos(e.clientX, e.clientY);
    onFocusChange(x, y);
  };

  const leftPct = `${originX * 100}%`;
  const topPct = `${originY * 100}%`;

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-50 select-none"
      style={{
        cursor: isDragging ? "grabbing" : "crosshair",
        // Spotlight: translucent everywhere except a soft circle at focus
        background: `radial-gradient(circle 72px at ${leftPct} ${topPct}, transparent 0%, transparent 36px, rgba(0,0,0,0.58) 80px)`,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.2s ease-out",
      }}
      onClick={handleOverlayClick}
    >
      {/* Crosshair lines */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          left: leftPct,
          width: 1,
          transform: "translateX(-0.5px)",
          background: "rgba(168,85,247,0.25)",
        }}
      />
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: topPct,
          height: 1,
          transform: "translateY(-0.5px)",
          background: "rgba(168,85,247,0.25)",
        }}
      />

      {/* ── Focus indicator ─────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          left: leftPct,
          top: topPct,
          transform: "translate(-50%, -50%)",
          cursor: isDragging ? "grabbing" : "grab",
          width: 0,
          height: 0,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer rotating dashed ring */}
        <div
          style={{
            position: "absolute",
            width: 76,
            height: 76,
            borderRadius: "50%",
            border: "2px dashed rgba(168,85,247,0.75)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "frameful-spin 5s linear infinite",
          }}
        />
        {/* Pulsing inner ring */}
        <div
          style={{
            position: "absolute",
            width: 54,
            height: 54,
            borderRadius: "50%",
            border: "1.5px solid rgba(168,85,247,0.55)",
            background: "rgba(168,85,247,0.08)",
            boxShadow: "0 0 22px rgba(168,85,247,0.35), inset 0 0 12px rgba(168,85,247,0.1)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "frameful-pulse 2s ease-in-out infinite",
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "rgba(168,85,247,1)",
            boxShadow: "0 0 10px rgba(168,85,247,0.9)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        {/* Zoom factor badge */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, calc(-50% + 48px))",
            background: "rgba(168,85,247,0.92)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            letterSpacing: "0.04em",
            pointerEvents: "none",
          }}
        >
          {DEFAULT_ZOOM_FACTOR}× zoom
        </div>
      </div>

      {/* ── Instructions pill ───────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(9,9,11,0.75)",
          backdropFilter: "blur(10px)",
          color: "#e4e4e7",
          fontSize: 12,
          fontWeight: 500,
          padding: "6px 14px",
          borderRadius: 20,
          whiteSpace: "nowrap",
          border: "1px solid rgba(255,255,255,0.08)",
          pointerEvents: "none",
          animation: "frameful-fadein 0.3s ease-out 0.1s both",
        }}
      >
        Click or drag to set the zoom focus point
      </div>

      {/* ── Confirm / Cancel ────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          animation: "frameful-fadein 0.3s ease-out 0.15s both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onCancel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 14px",
            borderRadius: 8,
            background: "rgba(9,9,11,0.8)",
            backdropFilter: "blur(10px)",
            color: "#a1a1aa",
            border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#e4e4e7"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#a1a1aa"; }}
        >
          <X style={{ width: 12, height: 12 }} />
          Cancel
        </button>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onConfirm}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 16px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "0 0 18px rgba(168,85,247,0.4)",
            transition: "opacity 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
        >
          <Check style={{ width: 12, height: 12 }} />
          Set Zoom Here
        </button>
      </div>
    </div>
  );
}
