import { Image as ImageIcon, Sliders as SlidersIcon, Monitor as MonitorIcon } from "lucide-react";
import { BackgroundTab, DesignTab, FrameTab } from "../tabs";
import type { ToolBarTab } from "../types";

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
