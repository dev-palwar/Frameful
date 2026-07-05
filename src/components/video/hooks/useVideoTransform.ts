import { useCallback, useEffect, useRef, useState } from "react";

interface VideoTransformState {
  containerRef: React.RefObject<HTMLDivElement | null>;
  boundsRef: React.RefObject<HTMLDivElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  posX: number;
  posY: number;
  isSelected: boolean;
  scalePercent: number;
  setIsSelected: (v: boolean) => void;
  startDrag: (e: React.MouseEvent) => void;
  startResize: (e: React.MouseEvent, dx: number, dy: number) => void;
  startCrop: (e: React.MouseEvent, dx: number, dy: number) => void;
  cropTop: number;
  cropRight: number;
  cropBottom: number;
  cropLeft: number;
}

export function useVideoTransform(): VideoTransformState {
  const containerRef = useRef<HTMLDivElement>(null);
  const boundsRef    = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);

  const [isSelected, setIsSelected] = useState(false);
  const [scale, setScale] = useState(1);
  const [posX,  setPosX]  = useState(0);
  const [posY,  setPosY]  = useState(0);
  
  const [cropTop, setCropTop] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  const [cropLeft, setCropLeft] = useState(0);

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

  const startCrop = useCallback(
    (e: React.MouseEvent, dx: number, dy: number) => {
      e.preventDefault();
      e.stopPropagation();
      const bounds = boundsRef.current;
      if (!bounds) return;
      const { width, height } = bounds.getBoundingClientRect();
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      const startX = e.clientX;
      const startY = e.clientY;
      const startCropTop = cropTop;
      const startCropBottom = cropBottom;
      const startCropLeft = cropLeft;
      const startCropRight = cropRight;

      const onMove = (ev: MouseEvent) => {
        const deltaX = ev.clientX - startX;
        const deltaY = ev.clientY - startY;

        if (dy === -1) {
          const deltaPct = (deltaY / scaledHeight) * 100;
          setCropTop(Math.max(0, Math.min(100 - cropBottom - 5, startCropTop + deltaPct)));
        } else if (dy === 1) {
          const deltaPct = (-deltaY / scaledHeight) * 100;
          setCropBottom(Math.max(0, Math.min(100 - cropTop - 5, startCropBottom + deltaPct)));
        } else if (dx === -1) {
          const deltaPct = (deltaX / scaledWidth) * 100;
          setCropLeft(Math.max(0, Math.min(100 - cropRight - 5, startCropLeft + deltaPct)));
        } else if (dx === 1) {
          const deltaPct = (-deltaX / scaledWidth) * 100;
          setCropRight(Math.max(0, Math.min(100 - cropLeft - 5, startCropRight + deltaPct)));
        }
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [cropTop, cropBottom, cropLeft, cropRight],
  );

  return {
    containerRef,
    boundsRef,
    wrapperRef,
    scale,
    posX,
    posY,
    isSelected,
    scalePercent: Math.round(scale * 100),
    setIsSelected,
    startDrag,
    startResize,
    startCrop,
    cropTop,
    cropRight,
    cropBottom,
    cropLeft,
  };
}
