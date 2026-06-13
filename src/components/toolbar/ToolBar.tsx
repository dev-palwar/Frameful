import React, { useState } from "react";
import { Typography } from "@/design-system";
import { TABS } from "./config";
import type { ToolBarProps } from "./types";

const ToolBar: React.FC<ToolBarProps> = (props) => {
  const [activeTabId, setActiveTabId] = useState<string>(TABS[0].id);

  const activeTab   = TABS.find((t) => t.id === activeTabId) ?? TABS[0];
  const ActivePanel = activeTab.panel;

  return (
    <aside className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card shrink-0 flex flex-col overflow-hidden">
      {/* Tab strip */}
      <div className="flex items-center gap-0 border-b border-border shrink-0">
        {TABS.map((tab) => {
          const Icon     = tab.icon;
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              id={`toolbar-tab-${tab.id}`}
              onClick={() => setActiveTabId(tab.id)}
              className={[
                "relative flex items-center gap-1.5 px-4 py-3 cursor-pointer select-none transition-colors border-b-2",
                isActive
                  ? "text-primary border-primary bg-muted/30"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/20",
              ].join(" ")}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <Typography variant="label" as="span">{tab.label}</Typography>
            </button>
          );
        })}
      </div>

      {/* Panel area */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-5">
          <Typography variant="h4" as="h2" className="text-foreground">
            {activeTab.label}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground mt-0.5 block">
            {activeTab.subtitle}
          </Typography>
        </div>

        <ActivePanel {...props} />

        <div className="mt-8 p-4 rounded-md border border-border bg-muted/30">
          <Typography variant="label" as="h3" className="text-foreground mb-1.5 block">
            Coming Soon
          </Typography>
          <Typography variant="caption" className="text-muted-foreground leading-relaxed">
            Advanced editing tools, filters, and dynamic layouts are currently
            under development.
          </Typography>
        </div>
      </div>
    </aside>
  );
};

export default ToolBar;
