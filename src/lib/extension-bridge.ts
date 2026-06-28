/**
 * extension-bridge.ts — Thin wrapper around chrome.runtime.sendMessage
 * for communicating with the Frameful Auto Zoom extension.
 *
 * All functions fail gracefully when the extension is not installed —
 * they return empty/null values rather than throwing.
 */

import type { ClickEvent } from "./zoom";

declare const chrome: any;

/**
 * The extension ID is set at build time via the VITE_EXTENSION_ID env var.
 * During local development, load the unpacked extension from extension/
 * and paste the assigned ID into your .env.local file.
 */
const EXTENSION_ID = import.meta.env.VITE_EXTENSION_ID as string | undefined;

function sendMessage<T>(message: Record<string, unknown>): Promise<T | null> {
  if (!EXTENSION_ID) return Promise.resolve(null);

  return new Promise((resolve) => {
    try {
      // chrome.runtime may not exist in non-extension contexts — guard it
      if (typeof chrome === "undefined" || !chrome?.runtime?.sendMessage) {
        resolve(null);
        return;
      }

      chrome.runtime.sendMessage(EXTENSION_ID, message, (response: T) => {
        if (chrome.runtime.lastError) {
          // Extension not installed or not responding
          resolve(null);
          return;
        }
        resolve(response ?? null);
      });
    } catch {
      resolve(null);
    }
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Checks whether the Frameful extension is installed and reachable.
 * Safe to call on every page load — returns false if not installed.
 */
export async function isExtensionInstalled(): Promise<boolean> {
  const response = await sendMessage<{ installed: boolean }>({ type: "PING" });
  return response?.installed === true;
}

/**
 * Tells the extension to start a new recording session.
 * Clears any previously accumulated click events.
 */
export async function startSession(): Promise<void> {
  await sendMessage({ type: "START_SESSION" });
}

/**
 * Tells the extension to end the current session.
 * Returns all click events captured since startSession() was called,
 * with times in seconds relative to the session start.
 */
export async function stopSession(): Promise<ClickEvent[]> {
  const response = await sendMessage<{ ok: boolean; events: ClickEvent[] }>({
    type: "STOP_SESSION",
  });
  return response?.events ?? [];
}
