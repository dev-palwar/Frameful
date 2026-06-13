import { useCallback, useEffect, useRef, useState } from "react";

interface VideoTransformState {
  containerRef: React.RefObject<HTMLDivElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  posX: number;
  posY: number;
  isSelected: boolean;
  scalePercent: number;
  setIsSelected: (v: boolean) => void;
  startDrag: (e: React.MouseEvent) => void;
  startResize: (e: React.MouseEvent, dx: number, dy: number) => void;
}

/**
 * Manages the video's interactive transform state.
 * Owns: scale, posX, posY, isSelected.
 * Handles: drag-to-move, 8-handle resize, deselect-on-outside-click.
 */
export function useVideoTransform(): VideoTransformState {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);

  const [isSelected, setIsSelected] = useState(false);
  const [scale, setScale] = useState(1);
  const [posX,  setPosX]  = useState(0);
  const [posY,  setPosY]  = useState(0);

  // Deselect when clicking outside the wrapper
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

  const startResize = useCallback(
    (e: React.MouseEvent, dx: number, dy: number) => {
      e.preventDefault();
      e.stopPropagation();
      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      const containerSize = Math.min(width, height);
      const startX     = e.clientX;
      const startY     = e.clientY;
      const startScale = scale;
      const onMove = (ev: MouseEvent) => {
        const deltaX = (ev.clientX - startX) * dx;
        const deltaY = (ev.clientY - startY) * dy;
        let delta: number;
        if (dx === 0)      delta = deltaY;
        else if (dy === 0) delta = deltaX;
        else               delta = (deltaX + deltaY) / 2;
        setScale(Math.max(0.2, Math.min(3, startScale + delta / containerSize)));
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

  return {
    containerRef,
    wrapperRef,
    scale,
    posX,
    posY,
    isSelected,
    scalePercent: Math.round(scale * 100),
    setIsSelected,
    startDrag,
    startResize,
  };
}
