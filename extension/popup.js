// popup.js — updates the popup UI based on current session state

const dot = document.getElementById("dot");
const statusText = document.getElementById("status-text");
const count = document.getElementById("count");
const hint = document.getElementById("hint");

function updateUI({ active, eventCount }) {
  if (active) {
    dot.classList.add("active");
    statusText.textContent = "Recording…";
    count.style.display = "block";
    count.textContent = `${eventCount} click${eventCount !== 1 ? "s" : ""}`;
    hint.textContent = "Clicks are being captured. Stop recording in Frameful when done.";
  } else {
    dot.classList.remove("active");
    statusText.textContent = "Idle";
    count.style.display = "none";
    hint.textContent = "Start a recording in Frameful to begin capturing clicks.";
  }
}

// Poll status from background every second while popup is open
async function poll() {
  const response = await chrome.runtime.sendMessage({ type: "GET_STATUS" }).catch(() => null);
  if (response) updateUI(response);
}

poll();
setInterval(poll, 1000);
