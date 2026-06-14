import React from "react";
import type { ToolBarProps } from "../../types";
import { Section } from "../design/widgets/Section";
import { OptionButton } from "../design/widgets/OptionButton";
import {
  OsFramePreview,
  BrowserFramePreview,
  ButtonControlPreview,
  ButtonPositionPreview,
} from "./widgets";

// ── OS Frame variants ──────────────────────────────────────────────────────────
const OS_FRAME_VARIANTS = ["none", "macos", "macos-light", "windows", "ubuntu"] as const;
const OS_FRAME_LABELS: Record<(typeof OS_FRAME_VARIANTS)[number], string> = {
  none: "None",
  macos: "macOS Dark",
  "macos-light": "macOS Light",
  windows: "Windows 11",
  ubuntu: "Ubuntu",
};

// ── Browser Frame variants ────────────────────────────────────────────────────
const BROWSER_FRAME_VARIANTS = ["chrome", "safari", "firefox", "arc", "edge"] as const;
const BROWSER_FRAME_LABELS: Record<(typeof BROWSER_FRAME_VARIANTS)[number], string> = {
  chrome: "Chrome",
  safari: "Safari",
  firefox: "Firefox",
  arc: "Arc",
  edge: "Edge",
};

// ── Button Control variants ──────────────────────────────────────────────────
const BUTTON_CONTROL_VARIANTS = ["all", "close-only", "min-max", "none"] as const;
const BUTTON_CONTROL_LABELS: Record<(typeof BUTTON_CONTROL_VARIANTS)[number], string> = {
  all: "All",
  "close-only": "Close Only",
  "min-max": "Min / Max",
  none: "None",
};

// ── Button Position variants ─────────────────────────────────────────────────
const BUTTON_POSITION_VARIANTS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;
const BUTTON_POSITION_LABELS: Record<(typeof BUTTON_POSITION_VARIANTS)[number], string> = {
  "top-left": "Top Left",
  "top-center": "Top Center",
  "top-right": "Top Right",
  "bottom-left": "Bot Left",
  "bottom-center": "Bot Center",
  "bottom-right": "Bot Right",
};

const FrameTab: React.FC<ToolBarProps> = ({ frameSettings, setFrameSettings }) => {
  const update = (key: keyof typeof frameSettings, value: unknown) =>
    setFrameSettings((prev) => ({ ...prev, [key]: value }));

  const { osFrame, browserFrame, buttonControls, buttonPosition } = frameSettings;

  // Determine if we should show button controls / position (only when an OS frame is active)
  const showButtonControls = osFrame !== "none";

  return (
    <div className="grid grid-cols-1 gap-2">
      {/* ── OS Frames ── */}
      <Section title="OS Frame">
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          {OS_FRAME_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={OS_FRAME_LABELS[v]}
              isActive={osFrame === v && browserFrame === "none"}
              onClick={() => {
                update("osFrame", v);
                // Switching to an OS frame clears browser frame
                if (v !== "none") update("browserFrame", "none");
              }}
            >
              <OsFramePreview variant={v} />
            </OptionButton>
          ))}
        </div>
      </Section>

      {/* ── Browser Frames ── */}
      <Section title="Browser Frame">
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          {BROWSER_FRAME_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={BROWSER_FRAME_LABELS[v]}
              isActive={browserFrame === v}
              onClick={() => {
                update("browserFrame", v);
                // Browser frame replaces OS frame
                update("osFrame", "none");
              }}
            >
              <BrowserFramePreview variant={v} />
            </OptionButton>
          ))}
        </div>
      </Section>

      {/* ── Button Controls (only for OS frames) ── */}
      <Section title="Button Controls" defaultOpen={showButtonControls}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {BUTTON_CONTROL_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={BUTTON_CONTROL_LABELS[v]}
              isActive={buttonControls === v}
              onClick={() => update("buttonControls", v)}
            >
              <ButtonControlPreview
                variant={v}
                style={
                  osFrame?.startsWith("macos") || osFrame === "ubuntu"
                    ? "macos"
                    : "windows"
                }
              />
            </OptionButton>
          ))}
        </div>
      </Section>

      {/* ── Button Position ── */}
      <Section title="Button Position" defaultOpen={showButtonControls}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          {BUTTON_POSITION_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={BUTTON_POSITION_LABELS[v]}
              isActive={buttonPosition === v}
              onClick={() => update("buttonPosition", v)}
            >
              <ButtonPositionPreview variant={v} />
            </OptionButton>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default FrameTab;
