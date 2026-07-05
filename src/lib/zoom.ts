

export interface ClickEvent {
    time: number;
    x: number;
    y: number;
}

export interface ZoomEvent {
  id: string;
    time: number;
    duration: number;
    zoomFactor: number;
    originX: number;
    originY: number;
    source: "auto" | "manual";
}

export const DEFAULT_ZOOM_DURATION = 1.8; 
export const DEFAULT_ZOOM_FACTOR = 1.8;

export function clicksToZoomEvents(clicks: ClickEvent[]): ZoomEvent[] {
  if (clicks.length === 0) return [];

  const DEDUP_WINDOW = 1.2; 

  const sorted = [...clicks].sort((a, b) => a.time - b.time);

  const groups: ClickEvent[][] = [];
  let currentGroup: ClickEvent[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (curr.time - prev.time <= DEDUP_WINDOW) {
      currentGroup.push(curr);
    } else {
      groups.push(currentGroup);
      currentGroup = [curr];
    }
  }
  groups.push(currentGroup);

  return groups.map((group) => {
    const avgTime = group.reduce((s, c) => s + c.time, 0) / group.length;
    const avgX = group.reduce((s, c) => s + c.x, 0) / group.length;
    const avgY = group.reduce((s, c) => s + c.y, 0) / group.length;

    return {
      id: crypto.randomUUID(),
      time: avgTime,
      duration: DEFAULT_ZOOM_DURATION,
      zoomFactor: DEFAULT_ZOOM_FACTOR,
      originX: avgX,
      originY: avgY,
      source: "auto",
    };
  });
}

interface ZoomTransform {
  scale: number;
  originX: number;
  originY: number;
}

export function resolveZoomTransform(
  currentTime: number,
  zoomEvents: ZoomEvent[],
): ZoomTransform | null {
  
  const active: { event: ZoomEvent; t: number }[] = [];

  for (const event of zoomEvents) {
    const halfDur = event.duration / 2;
    const start = event.time - halfDur;
    const end = event.time + halfDur;

    if (currentTime < start || currentTime > end) continue;

    const raw = (currentTime - start) / event.duration;

    let t: number;
    if (raw < 0.3) {
      t = easeInOut(raw / 0.3);
    } else if (raw < 0.7) {
      t = 1;
    } else {
      t = easeInOut(1 - (raw - 0.7) / 0.3);
    }

    active.push({ event, t });
  }

  if (active.length === 0) return null;

  if (active.length === 1) {
    const { event, t } = active[0];
    return {
      scale: 1 + (event.zoomFactor - 1) * t,
      originX: event.originX,
      originY: event.originY,
    };
  }

  active.sort((a, b) => (a.event.time - b.event.time));

  const from = active[0];
  const to = active[1];

  const fromEnd = from.event.time + from.event.duration / 2;
  const toStart = to.event.time - to.event.duration / 2;
  const overlapDuration = fromEnd - toStart; 

  const alpha = overlapDuration > 0
    ? Math.min(1, Math.max(0, (currentTime - toStart) / overlapDuration))
    : 1;

  const blendAlpha = easeInOut(alpha);

  const fromScale = 1 + (from.event.zoomFactor - 1) * from.t;
  const toScale = 1 + (to.event.zoomFactor - 1) * to.t;

  return {
    scale: lerp(fromScale, toScale, blendAlpha),
    originX: lerp(from.event.originX, to.event.originX, blendAlpha),
    originY: lerp(from.event.originY, to.event.originY, blendAlpha),
  };
}

function easeInOut(t: number): number {
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
