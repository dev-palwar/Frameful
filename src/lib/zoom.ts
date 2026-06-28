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
 * Returns null when no zoom is active (scale = 1, no transform needed).
 */
export function resolveZoomTransform(
  currentTime: number,
  zoomEvents: ZoomEvent[],
): ZoomTransform | null {
  for (const event of zoomEvents) {
    const halfDur = event.duration / 2;
    const start = event.time - halfDur;
    const end = event.time + halfDur;

    if (currentTime < start || currentTime > end) continue;

    // Normalised position within the zoom window [0, 1]
    const raw = (currentTime - start) / event.duration;

    // Ease in-out using a sine curve — smooth ramp up, hold, smooth ramp down
    // We split the window: 30% ramp-in | 40% hold | 30% ramp-out
    let t: number;
    if (raw < 0.3) {
      // Ramp in
      t = easeInOut(raw / 0.3);
    } else if (raw < 0.7) {
      // Hold at full zoom
      t = 1;
    } else {
      // Ramp out
      t = easeInOut(1 - (raw - 0.7) / 0.3);
    }

    const scale = 1 + (event.zoomFactor - 1) * t;

    return {
      scale,
      originX: event.originX,
      originY: event.originY,
    };
  }

  return null;
}

/** Smooth ease-in-out: starts and ends slow, fast in the middle. */
function easeInOut(t: number): number {
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}
