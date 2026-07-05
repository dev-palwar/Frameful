
import type { ClickEvent } from "./zoom";

declare const chrome: any;

const EXTENSION_ID = import.meta.env.VITE_EXTENSION_ID as string | undefined;

function sendMessage<T>(message: Record<string, unknown>): Promise<T | null> {
  if (!EXTENSION_ID) return Promise.resolve(null);

  return new Promise((resolve) => {
    try {
      
      if (typeof chrome === "undefined" || !chrome?.runtime?.sendMessage) {
        resolve(null);
        return;
      }

      chrome.runtime.sendMessage(EXTENSION_ID, message, (response: T) => {
        if (chrome.runtime.lastError) {
          
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

export async function isExtensionInstalled(): Promise<boolean> {
  const response = await sendMessage<{ installed: boolean }>({ type: "PING" });
  return response?.installed === true;
}

export async function startSession(): Promise<void> {
  await sendMessage({ type: "START_SESSION" });
}

export async function stopSession(): Promise<ClickEvent[]> {
  const response = await sendMessage<{ ok: boolean; events: ClickEvent[] }>({
    type: "STOP_SESSION",
  });
  return response?.events ?? [];
}
