/**
 * content.js — Frameful Auto Zoom content script
 *
 * Injected into every tab. When a recording session is active
 * (signalled by the background service worker), captures every
 * click with normalised coordinates and relays it to background.js.
 *
 * This script is intentionally minimal and side-effect-free when
 * no session is active — it does NOT capture anything otherwise.
 */

let sessionActive = false;

// ─── Listen for session state changes from background ─────────────────────────
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SESSION_STARTED") {
    sessionActive = true;
  } else if (message.type === "SESSION_STOPPED") {
    sessionActive = false;
  }
});

// ─── Click capture ────────────────────────────────────────────────────────────
document.addEventListener(
  "click",
  (e) => {
    if (!sessionActive) return;

    // Normalise to 0–1 fractions of the viewport so the zoom origin
    // is resolution-independent when applied in the Studio player.
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    chrome.runtime.sendMessage({
      type: "CLICK_EVENT",
      payload: {
        x,
        y,
        timestamp: Date.now(), // absolute ms — background converts to relative
      },
    });
  },
  // Use capture phase to catch clicks even if the page stops propagation
  { capture: true, passive: true },
);
