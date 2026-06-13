import { Image as ImageIcon } from "lucide-react";
import { BackgroundTab } from "../tabs";
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
  // Future tabs:
  // { id: "design", label: "Design", icon: SlidersIcon, subtitle: "…", panel: DesignTab },
];
