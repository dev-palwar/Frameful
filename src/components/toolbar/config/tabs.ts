import { Image as ImageIcon, Sliders as SlidersIcon, Monitor as MonitorIcon } from "lucide-react";
import { BackgroundTab, DesignTab, FrameTab } from "../tabs";
import type { ToolBarTab } from "../types";

/**
 * Tab registry — the single source of truth for what tabs appear in the
 * ToolBar. To add a new tab: create its panel in ./tabs/, import it here,
 * and add one entry to this array. The tab strip updates automatically.
 */
export const TABS: ToolBarTab[] = [
  {
    id:       "backgrounds",
    label:    "Backgrounds",
    icon:     ImageIcon,
    subtitle: "Choose or upload a background image",
    panel:    BackgroundTab,
  },
  { 
    id: "design", 
    label: "Design", 
    icon: SlidersIcon, 
    subtitle: "Customize your video appearance", 
    panel: DesignTab 
  },
  {
    id:       "frame",
    label:    "Frame",
    icon:     MonitorIcon,
    subtitle: "Wrap your video in a window or browser frame",
    panel:    FrameTab,
  },
];
