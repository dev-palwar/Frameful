import type { LucideIcon } from "lucide-react";
import type React from "react";

export interface DesignSettings {
  style: string;
  padding: number;
  opacity: number;
  borderStyle: string;
  radius: number;
  scale: number;
  shadow: string;
  /** 0–100 multiplier applied on top of the shadow preset (100 = full strength) */
  shadowIntensity: number;
  /** Canvas aspect ratio key, e.g. "16:9", "9:16", "native" */
  aspectRatio: string;
  /** Blur preset: "none" | "subtle" | "medium" | "heavy" */
  blur: string;
  /** 0–100 fine-tune on top of the blur preset */
  blurAmount: number;
}

/** Props passed down from ToolBar to every tab panel. */
export interface ToolBarProps {
  onBackgroundSelect: (bg: string) => void;
  designSettings: DesignSettings;
  setDesignSettings: React.Dispatch<React.SetStateAction<DesignSettings>>;
}

/** Descriptor for a single toolbar tab. */
export interface ToolBarTab {
  /** Unique machine-readable key, used as the active-tab discriminator. */
  id: string;
  /** Human-readable label shown in the tab strip. */
  label: string;
  /** One-line description shown as the panel sub-heading. */
  subtitle: string;
  /** Icon rendered next to the label. */
  icon: LucideIcon;
  /** The panel content to render when this tab is active. */
  panel: React.FC<ToolBarProps>;
}
