import React from "react";
import type { ToolBarProps } from "../../types";
import { Section } from "../design/widgets/Section";
import { OptionButton } from "../design/widgets/OptionButton";
import {
  OsFramePreview,
  ButtonControlPreview,
  ButtonPositionPreview,
} from "./widgets";

// ── OS Frame variants ──────────────────────────────────────────────────────────
const OS_FRAME_VARIANTS = ["none", "macos", "arc", "firefox"] as const;
const OS_FRAME_LABELS: Record<(typeof OS_FRAME_VARIANTS)[number], string> = {
  none: "None",
  macos: "macOS",
  arc: "Arc",
  firefox: "Firefox",
};

// ── Theme variants ─────────────────────────────────────────────────────────────
const THEME_VARIANTS = ["dark", "light"] as const;
const THEME_LABELS: Record<(typeof THEME_VARIANTS)[number], string> = {
  dark: "Dark Mode",
  light: "Light Mode",
};

// ── Button Control variants ──────────────────────────────────────────────────
const BUTTON_CONTROL_VARIANTS = [
  "all",
  "close-only",
  "min-max",
  "none",
] as const;
const BUTTON_CONTROL_LABELS: Record<
  (typeof BUTTON_CONTROL_VARIANTS)[number],
  string
> = {
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
const BUTTON_POSITION_LABELS: Record<
  (typeof BUTTON_POSITION_VARIANTS)[number],
  string
> = {
  "top-left": "Top Left",
  "top-center": "Top Center",
  "top-right": "Top Right",
  "bottom-left": "Bot Left",
  "bottom-center": "Bot Center",
  "bottom-right": "Bot Right",
};

const FrameTab: React.FC<ToolBarProps> = ({
  frameSettings,
  setFrameSettings,
}) => {
  const update = (key: keyof typeof frameSettings, value: unknown) =>
    setFrameSettings((prev) => ({ ...prev, [key]: value }));

  const { osFrame, buttonControls, buttonPosition } = frameSettings;

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
              isActive={osFrame === v}
              onClick={() => {
                update("osFrame", v);
              }}
            >
              <OsFramePreview variant={v} theme={frameSettings.theme} />
            </OptionButton>
          ))}
        </div>
      </Section>

      {/* ── Theme Toggle ── */}
      <Section title="Theme" defaultOpen={osFrame !== "none"}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {THEME_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={THEME_LABELS[v]}
              isActive={frameSettings.theme === v}
              onClick={() => update("theme", v)}
            >
              {THEME_LABELS[v]}
            </OptionButton>
          ))}
        </div>
      </Section>

      {/* ── URL Input ── */}
      <Section title="Website URL" defaultOpen={osFrame !== "none"}>
        <div className="flex px-1">
          <input
            type="text"
            className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-brand-primary"
            placeholder="e.g. Cutline.com"
            value={frameSettings.url || ""}
            onChange={(e) => update("url", e.target.value)}
          />
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
              <ButtonControlPreview variant={v} style="macos" />
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
