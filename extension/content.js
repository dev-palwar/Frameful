
let sessionActive = false;

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SESSION_STARTED") {
    sessionActive = true;
  } else if (message.type === "SESSION_STOPPED") {
    sessionActive = false;
  }
});

document.addEventListener(
  "click",
  (e) => {
    if (!sessionActive) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    chrome.runtime.sendMessage({
      type: "CLICK_EVENT",
      payload: {
        x,
        y,
        timestamp: Date.now(), 
      },
    });
  },
  
  { capture: true, passive: true },
);
