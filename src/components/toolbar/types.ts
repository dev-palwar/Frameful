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
    shadowIntensity: number;
    aspectRatio: string;
    blur: string;
    blurAmount: number;
}

export interface FrameSettings {
    osFrame: string;
    theme: "dark" | "light";
    buttonControls: string;
    buttonPosition: string;
    url: string;
}

export interface ToolBarProps {
  onBackgroundSelect: (bg: string) => void;
  designSettings: DesignSettings;
  setDesignSettings: React.Dispatch<React.SetStateAction<DesignSettings>>;
  frameSettings: FrameSettings;
  setFrameSettings: React.Dispatch<React.SetStateAction<FrameSettings>>;
}

export interface ToolBarTab {
    id: string;
    label: string;
    subtitle: string;
    icon: LucideIcon;
    panel: React.FC<ToolBarProps>;
}
