import React from "react";
import type { FrameSettings } from "../toolbar/types";

interface FrameWrapperProps {
  settings?: FrameSettings;
  children: React.ReactNode;
  innerRadius?: string | number;
}

const DOT_COLORS = {
  close: "#ff5f57",
  min: "#ffbd2e",
  max: "#28c840",
};

export const FrameWrapper = ({ settings, children, innerRadius }: FrameWrapperProps) => {
  if (!settings) return <>{children}</>;

  const { osFrame, browserFrame, buttonControls, buttonPosition } = settings;

  // If no frame selected, just return children
  if (osFrame === "none" && browserFrame === "none") {
    return <>{children}</>;
  }

  const isMac = osFrame?.startsWith("macos") || osFrame === "ubuntu" || browserFrame === "safari";

  const renderMacDots = () => {
    if (buttonControls === "none") return null;
    const showClose = buttonControls === "all" || buttonControls === "close-only";
    const showMin = buttonControls === "all" || buttonControls === "min-max";
    const showMax = buttonControls === "all" || buttonControls === "min-max";

    return (
      <>
        <div
          className="rounded-full shrink-0"
          style={{
            width: 12,
            height: 12,
            background: showClose ? DOT_COLORS.close : "rgba(255,255,255,0.12)",
            border: showClose ? "none" : "1px solid rgba(255,255,255,0.18)",
          }}
        />
        <div
          className="rounded-full shrink-0"
          style={{
            width: 12,
            height: 12,
            background: showMin ? DOT_COLORS.min : "rgba(255,255,255,0.12)",
            border: showMin ? "none" : "1px solid rgba(255,255,255,0.18)",
          }}
        />
        <div
          className="rounded-full shrink-0"
          style={{
            width: 12,
            height: 12,
            background: showMax ? DOT_COLORS.max : "rgba(255,255,255,0.12)",
            border: showMax ? "none" : "1px solid rgba(255,255,255,0.18)",
          }}
        />
      </>
    );
  };

  const renderWinButtons = () => {
    if (buttonControls === "none") return null;
    const showClose = buttonControls === "all" || buttonControls === "close-only";
    const showMin = buttonControls === "all" || buttonControls === "min-max";
    const showMax = buttonControls === "all" || buttonControls === "min-max";

    const winBtn = (symbol: string, active: boolean) => (
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 24,
          height: "100%",
          opacity: active ? 1 : 0.2,
          color: "rgba(255,255,255,0.7)",
          fontSize: 10,
        }}
      >
        {symbol}
      </div>
    );

    return (
      <div className="flex items-center h-full">
        {winBtn("─", showMin)}
        {winBtn("□", showMax)}
        {winBtn("✕", showClose)}
      </div>
    );
  };

  const renderButtons = () => {
    if (isMac || osFrame === "ubuntu") {
      return (
        <div className="flex items-center gap-2">
          {renderMacDots()}
        </div>
      );
    } else {
      return renderWinButtons();
    }
  };

  const isTop = buttonPosition.startsWith("top");
  const isLeft = buttonPosition.endsWith("left");
  const isRight = buttonPosition.endsWith("right");
  const justify = isLeft ? "flex-start" : isRight ? "flex-end" : "center";

  // Browser Frames
  if (browserFrame !== "none") {
    if (browserFrame === "chrome") {
      return (
        <div className="flex flex-col w-full h-full overflow-hidden" style={{ background: "#202124", borderRadius: innerRadius }}>
          <div className="flex items-end px-2 pt-2 gap-1 shrink-0" style={{ height: "40px", background: "#35363a" }}>
            <div className="flex items-center gap-2 px-3 rounded-t-md text-sm text-white/80 shrink-0" style={{ height: "100%", background: "#202124", minWidth: "140px", maxWidth: "200px" }}>
              <div className="w-3 h-3 rounded-full bg-blue-400/60 shrink-0" />
              <span className="truncate text-xs">Tab</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 shrink-0" style={{ height: "32px", background: "#202124", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-2.5 h-2.5 rounded-full bg-white/20 shrink-0" />
            <div className="flex-1 h-[14px] rounded-full bg-white/10" />
          </div>
          <div className="flex-1 relative bg-white overflow-hidden">
            {children}
          </div>
        </div>
      );
    }
    if (browserFrame === "safari") {
      return (
        <div className="flex flex-col w-full h-full overflow-hidden" style={{ background: "#1c1c1e", borderRadius: innerRadius }}>
          <div className="flex flex-col shrink-0" style={{ height: "56px", background: "linear-gradient(180deg, #2c2c2e 0%, #252527 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2 px-4 pt-2" style={{ height: "24px" }}>
              {renderMacDots()}
            </div>
            <div className="flex items-center justify-center px-4" style={{ height: "32px" }}>
              <div className="flex items-center gap-2 px-4 rounded-md" style={{ background: "rgba(255,255,255,0.08)", height: "24px", width: "60%" }}>
                <div className="flex-1 h-[8px] rounded-full bg-white/20" />
              </div>
            </div>
          </div>
          <div className="flex-1 relative bg-white overflow-hidden">
            {children}
          </div>
        </div>
      );
    }
    if (browserFrame === "firefox") {
      return (
        <div className="flex flex-col w-full h-full overflow-hidden" style={{ background: "#1d1b20", borderRadius: innerRadius }}>
          <div className="flex items-end px-2 pt-2 gap-1 shrink-0" style={{ height: "40px", background: "#2b2a33" }}>
            <div className="flex items-center gap-2 px-3 rounded-md shrink-0 mb-1" style={{ height: "calc(100% - 4px)", background: "#1d1b20", minWidth: "140px" }}>
              <div className="w-3 h-3 rounded-full bg-orange-500/70 shrink-0" />
              <div className="flex-1 h-[6px] rounded-full bg-white/20" />
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 shrink-0" style={{ height: "36px", background: "#1d1b20", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-2.5 h-2.5 rounded-full bg-white/20 shrink-0" />
            <div className="flex-1 h-[20px] rounded-md bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/20 shrink-0" />
          </div>
          <div className="flex-1 relative bg-white overflow-hidden">
            {children}
          </div>
        </div>
      );
    }
    if (browserFrame === "arc") {
      return (
        <div className="flex w-full h-full overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0d35 100%)", borderRadius: innerRadius }}>
          <div className="flex flex-col py-4 px-2 gap-3 shrink-0" style={{ width: "160px", background: "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.06) 100%)", borderRight: "1px solid rgba(139,92,246,0.2)" }}>
             <div className="flex gap-2 px-2 pb-2">
                {renderMacDots()}
             </div>
             <div className="w-full px-2">
               <div className="w-full h-px bg-purple-400/20 mb-3" />
               <div className="flex flex-col gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full h-3 rounded-sm bg-white/10" />
                  ))}
               </div>
             </div>
          </div>
          <div className="flex-1 relative bg-white overflow-hidden border border-purple-400/10 rounded-l-lg shadow-2xl">
            {children}
          </div>
        </div>
      );
    }
    if (browserFrame === "edge") {
      return (
        <div className="flex flex-col w-full h-full overflow-hidden" style={{ background: "#202020", borderRadius: innerRadius }}>
          <div className="flex items-end px-2 pt-2 gap-1 shrink-0" style={{ height: "36px", background: "#2d2d2d" }}>
             <div className="flex items-center gap-2 px-3 rounded-t-md shrink-0" style={{ height: "100%", background: "#202020", minWidth: "140px" }}>
                <div className="w-3 h-3 rounded-full bg-cyan-400/70 shrink-0" />
                <div className="flex-1 h-[6px] rounded-full bg-white/20" />
             </div>
          </div>
          <div className="flex items-center gap-2 px-4 shrink-0" style={{ height: "32px", background: "#202020", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
             <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/40 shrink-0" />
             <div className="flex-1 h-[18px] rounded-md bg-white/10" />
          </div>
          <div className="flex-1 relative bg-white overflow-hidden">
             {children}
          </div>
        </div>
      );
    }
  }

  // OS Frames
  const bar = (
    <div
      className="flex items-center px-4 shrink-0"
      style={{
        height: "36px",
        background: osFrame === "macos" ? "linear-gradient(180deg, #3d3d3d 0%, #2e2e2e 100%)" :
                    osFrame === "macos-light" ? "linear-gradient(180deg, #fafafa 0%, #ececec 100%)" :
                    osFrame === "windows" ? "linear-gradient(180deg, #202020 0%, #181818 100%)" :
                    osFrame === "ubuntu" ? "linear-gradient(180deg, #3a3a3a 0%, #2e2e2e 100%)" :
                    "#2e2e2e",
        borderBottom: isTop ? "1px solid rgba(0,0,0,0.4)" : "none",
        borderTop: !isTop ? "1px solid rgba(0,0,0,0.4)" : "none",
        justifyContent: justify,
        gap: 8,
      }}
    >
      {renderButtons()}
    </div>
  );

  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden"
      style={{
        background: osFrame === "macos" ? "#1e1e1e" :
                    osFrame === "macos-light" ? "#ffffff" :
                    osFrame === "windows" ? "#1e1e1e" :
                    osFrame === "ubuntu" ? "#1e1e1e" : "#1e1e1e",
        borderRadius: innerRadius
      }}
    >
      {isTop ? (
        <>
          {bar}
          <div className="flex-1 relative overflow-hidden">
            {children}
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 relative overflow-hidden">
            {children}
          </div>
          {bar}
        </>
      )}
    </div>
  );
};
