
import { useRef, useState, useCallback, useEffect } from "react";
import { DEFAULT_ZOOM_FACTOR } from "@/lib/zoom";

interface ZoomFocusPickerProps {
  originX: number; 
  originY: number; 
  onFocusChange: (x: number, y: number) => void;
  onConfirm: () => void;
}

export function ZoomFocusPicker({
  originX,
  originY,
  onFocusChange,
  onConfirm,
}: ZoomFocusPickerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const getRelativePos = useCallback((clientX: number, clientY: number) => {
    if (!overlayRef.current) return { x: 0.5, y: 0.5 };
    const rect = overlayRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    };
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const { x, y } = getRelativePos(e.clientX, e.clientY);
      onFocusChange(x, y);
    };
    const onUp = () => {
      setIsDragging(false);
      onConfirm();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, getRelativePos, onFocusChange]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { x, y } = getRelativePos(e.clientX, e.clientY);
    onFocusChange(x, y);
    onConfirm();
  };

  const leftPct = `${originX * 100}%`;
  const topPct = `${originY * 100}%`;

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-50 select-none"
      style={{
        cursor: isDragging ? "grabbing" : "crosshair",
        
        background: `radial-gradient(circle 72px at ${leftPct} ${topPct}, transparent 0%, transparent 36px, rgba(0,0,0,0.58) 80px)`,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.2s ease-out",
      }}
      onMouseDown={handleOverlayClick}
    >
      {}
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

      {}
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
        {}
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
            animation: "Cutline-spin 5s linear infinite",
          }}
        />
        {}
        <div
          style={{
            position: "absolute",
            width: 54,
            height: 54,
            borderRadius: "50%",
            border: "1.5px solid rgba(168,85,247,0.55)",
            background: "rgba(168,85,247,0.08)",
            boxShadow:
              "0 0 22px rgba(168,85,247,0.35), inset 0 0 12px rgba(168,85,247,0.1)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "Cutline-pulse 2s ease-in-out infinite",
          }}
        />
        {}
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
        {}
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

      {}
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
          animation: "Cutline-fadein 0.3s ease-out 0.1s both",
        }}
      >
        Click or drag to set the zoom focus point
      </div>
    </div>
  );
}
