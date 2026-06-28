/**
 * zoom.ts — Shared types and utilities for the auto-zoom feature.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** A raw click event as received from the browser extension. */
export interface ClickEvent {
  /** Seconds elapsed from the start of the recording session. */
  time: number;
  /** Horizontal click position, normalised to 0–1 (0 = left, 1 = right). */
  x: number;
  /** Vertical click position, normalised to 0–1 (0 = top, 1 = bottom). */
  y: number;
}

/** A zoom event that will be applied during video playback and export. */
export interface ZoomEvent {
  id: string;
  /** Peak zoom time in seconds (centre of the zoom window). */
  time: number;
  /**
   * Total duration in seconds: ramp-in + hold + ramp-out.
   * The ramp-in takes 30%, hold 40%, ramp-out 30% of this value.
   */
  duration: number;
  /** Zoom scale factor, e.g. 1.8 = 180% zoom. */
  zoomFactor: number;
  /** Horizontal origin, 0–1 (where the zoom centres horizontally). */
  originX: number;
  /** Vertical origin, 0–1 (where the zoom centres vertically). */
  originY: number;
  /** Whether this zoom was auto-detected from extension data or placed manually. */
  source: "auto" | "manual";
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_ZOOM_DURATION = 1.8; // seconds
export const DEFAULT_ZOOM_FACTOR = 1.8;

// ─── Conversion ───────────────────────────────────────────────────────────────

/**
 * Converts raw click events (from the extension) into zoom events.
 *
 * Deduplication: clicks within 1.2 seconds of each other are merged
 * into a single zoom event (taking the average origin). This prevents
 * zoom spam from rapid double-clicks or short click sequences.
 */
export function clicksToZoomEvents(clicks: ClickEvent[]): ZoomEvent[] {
  if (clicks.length === 0) return [];

  const DEDUP_WINDOW = 1.2; // seconds

  // Sort by time ascending
  const sorted = [...clicks].sort((a, b) => a.time - b.time);

  // Group clicks within DEDUP_WINDOW of each other
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

  // Convert each group to a single ZoomEvent
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

// ─── Playback helpers ─────────────────────────────────────────────────────────

interface ZoomTransform {
  scale: number;
  originX: number;
  originY: number;
}

/**
 * Given the current playhead time and the list of zoom events, resolves
 * what CSS transform should be applied to the video element right now.
 *
 * When two zoom windows overlap, the function crossfades between them so the
 * frame smoothly "guides" from one focal point to the next instead of
 * collapsing back to 1× and zooming in again.
 *
 * Returns null when no zoom is active (scale = 1, no transform needed).
 */
export function resolveZoomTransform(
  currentTime: number,
  zoomEvents: ZoomEvent[],
): ZoomTransform | null {
  // Collect every event that is currently active (currentTime falls within its window)
  const active: { event: ZoomEvent; t: number }[] = [];

  for (const event of zoomEvents) {
    const halfDur = event.duration / 2;
    const start = event.time - halfDur;
    const end = event.time + halfDur;

    if (currentTime < start || currentTime > end) continue;

    // Normalised position within the zoom window [0, 1]
    const raw = (currentTime - start) / event.duration;

    // 30% ramp-in | 40% hold | 30% ramp-out
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

  // Single active zoom — standard path
  if (active.length === 1) {
    const { event, t } = active[0];
    return {
      scale: 1 + (event.zoomFactor - 1) * t,
      originX: event.originX,
      originY: event.originY,
    };
  }

  // Two (or more) zooms overlap — crossfade between the earliest and the next one.
  // Sort by start time so we always blend from "older" → "newer".
  active.sort((a, b) => (a.event.time - b.event.time));

  const from = active[0];
  const to = active[1];

  // Determine how far we are through the overlap window.
  // Overlap starts where the later event begins and ends where the earlier event ends.
  const fromEnd = from.event.time + from.event.duration / 2;
  const toStart = to.event.time - to.event.duration / 2;
  const overlapDuration = fromEnd - toStart; // > 0 by definition

  // alpha goes 0→1 across the overlap: 0 = "fully on from", 1 = "fully on to"
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

/** Smooth ease-in-out: starts and ends slow, fast in the middle. */
function easeInOut(t: number): number {
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

/** Linear interpolation between two values. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
