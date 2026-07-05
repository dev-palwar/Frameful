

let sessionActive = false;
let sessionStartTime = 0;
let clickEvents = [];

async function broadcastToTabs(message) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id == null) continue;
    chrome.tabs.sendMessage(tab.id, message).catch(() => {});
  }
}

chrome.runtime.onMessageExternal.addListener(
  (message, _sender, sendResponse) => {
    (async () => {
      switch (message.type) {
        case "PING":
          sendResponse({
            installed: true,
            version: chrome.runtime.getManifest().version,
          });
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
          sendResponse({
            active: sessionActive,
            eventCount: clickEvents.length,
          });
          break;

        default:
          sendResponse({ error: "Unknown message type" });
      }
    })();

    return true;
  },
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  
  if (message.type === "GET_STATUS") {
    sendResponse({ active: sessionActive, eventCount: clickEvents.length });
    return false;
  }

  if (message.type === "CLICK_EVENT" && sessionActive) {
    const { x, y, timestamp } = message.payload;
    const time = (timestamp - sessionStartTime) / 1000;
    clickEvents.push({ time, x, y });
  }

  sendResponse({ ok: true });
  return false;
});
