/**
 * background.js — Frameful Auto Zoom service worker
 */

// ─── State ────────────────────────────────────────────────────────────────────
let sessionActive = false;
let sessionStartTime = 0;
let clickEvents = [];

// ─── Helper: broadcast session state to all content scripts ──────────────────
async function broadcastToTabs(message) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id == null) continue;
    chrome.tabs.sendMessage(tab.id, message).catch(() => {});
  }
}

// ─── Messages from the Frameful web app (externally_connectable) ──────────────
// IMPORTANT: The listener must return `true` synchronously to keep the
// message channel open. Do NOT return from inside a switch block — the
// `return true` must be the last statement in the listener function.
chrome.runtime.onMessageExternal.addListener(
  (message, _sender, sendResponse) => {
    (async () => {
      switch (message.type) {
        case "PING":
          sendResponse({ installed: true, version: chrome.runtime.getManifest().version });
          break;

        case "START_SESSION":
          sessionActive = true;
          sessionStartTime = Date.now();
          clickEvents = [];
          await broadcastToTabs({ type: "SESSION_STARTED" });
          sendResponse({ ok: true });
          break;

        case "STOP_SESSION": {
          sessionActive = false;
          await broadcastToTabs({ type: "SESSION_STOPPED" });
          const events = [...clickEvents];
          clickEvents = [];
          sessionStartTime = 0;
          sendResponse({ ok: true, events });
          break;
        }

        case "GET_STATUS":
          sendResponse({ active: sessionActive, eventCount: clickEvents.length });
          break;

        default:
          sendResponse({ error: "Unknown message type" });
      }
    })();

    // Return true synchronously — keeps the channel open for async sendResponse
    return true;
  },
);

// ─── Messages from content scripts AND popup (onMessage, not onMessageExternal)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Popup querying status
  if (message.type === "GET_STATUS") {
    sendResponse({ active: sessionActive, eventCount: clickEvents.length });
    return false;
  }

  // Click events from content scripts
  if (message.type === "CLICK_EVENT" && sessionActive) {
    const { x, y, timestamp } = message.payload;
    const time = (timestamp - sessionStartTime) / 1000;
    clickEvents.push({ time, x, y });
  }

  sendResponse({ ok: true });
  return false;
});

