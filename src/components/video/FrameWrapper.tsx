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

export const FrameWrapper = ({
  settings,
  children,
  innerRadius,
}: FrameWrapperProps) => {
  if (!settings) return <>{children}</>;

  const { osFrame, theme, url, buttonControls, buttonPosition } = settings;

  // If no frame selected, just return children
  if (osFrame === "none") {
    return <>{children}</>;
  }

  const isMac = osFrame === "macos";

  const renderMacDots = () => {
    if (buttonControls === "none") return null;
    const showClose =
      buttonControls === "all" || buttonControls === "close-only";
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

  const isTop = buttonPosition.startsWith("top");
  const isLeft = buttonPosition.endsWith("left");
  const isRight = buttonPosition.endsWith("right");
  const justify = isLeft ? "flex-start" : isRight ? "flex-end" : "center";

  // Theme and OS Frames
  const isLightOS = theme === "light";
  const iconColor = isLightOS ? "#8a8a8c" : "#98989a";

  if (osFrame === "firefox") {
    return (
      <div
        className="flex flex-col w-full h-full overflow-hidden"
        style={{
          background: isLightOS ? "#f9f9fb" : "#1d1b20",
          borderRadius: innerRadius,
        }}
      >
        <div
          className="flex items-end px-2 pt-2 gap-1 shrink-0"
          style={{
            height: "40px",
            background: isLightOS ? "#e3e4e6" : "#2b2a33",
          }}
        >
          <div
            className="flex items-center gap-2 px-3 rounded-t-md shrink-0 mb-1"
            style={{
              height: "calc(100% - 4px)",
              background: isLightOS ? "#f9f9fb" : "#1d1b20",
              minWidth: "140px",
            }}
          >
            <div className="w-3 h-3 rounded-full bg-orange-500/70 shrink-0" />
            <div
              className={`flex-1 h-[6px] rounded-full ${isLightOS ? "bg-black/10" : "bg-white/20"}`}
            />
          </div>
        </div>
        <div
          className="flex items-center gap-3 px-3 shrink-0"
          style={{
            height: "36px",
            background: isLightOS ? "#f9f9fb" : "#1d1b20",
            borderBottom: isLightOS
              ? "1px solid rgba(0,0,0,0.06)"
              : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full ${isLightOS ? "bg-black/20" : "bg-white/20"} shrink-0`}
          />
          <div
            className={`flex items-center px-3 h-[24px] rounded-md flex-1 ${isLightOS ? "bg-black/5 border border-black/5" : "bg-white/10"}`}
          >
            <span
              className={`text-xs ${isLightOS ? "text-black/60" : "text-white/60"} truncate`}
            >
              {url}
            </span>
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full ${isLightOS ? "bg-black/20" : "bg-white/20"} shrink-0`}
          />
        </div>
        <div className="flex-1 relative bg-white overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  if (osFrame === "arc") {
    return (
      <div
        className="flex w-full h-full overflow-hidden"
        style={{
          background: isLightOS
            ? "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)"
            : "linear-gradient(135deg, #0f0a1e 0%, #1a0d35 100%)",
          borderRadius: innerRadius,
        }}
      >
        <div
          className="flex flex-col py-4 px-2 gap-3 shrink-0"
          style={{
            width: "160px",
            background: isLightOS
              ? "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)"
              : "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.06) 100%)",
            borderRight: isLightOS
              ? "1px solid rgba(0,0,0,0.05)"
              : "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <div className="flex gap-2 px-2 pb-2">{renderMacDots()}</div>
          <div className="w-full px-2">
            <div
              className={`w-full h-px ${isLightOS ? "bg-black/10" : "bg-purple-400/20"} mb-3`}
            />
            <div
              className={`flex items-center px-2 py-1 mb-2 rounded ${isLightOS ? "bg-black/5 text-black/60" : "bg-white/10 text-white/60"}`}
            >
              <span className="text-xs truncate">{url}</span>
            </div>
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-3 rounded-sm ${isLightOS ? "bg-black/10" : "bg-white/10"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div
          className={`flex-1 relative ${isLightOS ? "bg-white" : "bg-[#18181b]"} overflow-hidden border ${isLightOS ? "border-black/5" : "border-purple-400/10"} rounded-l-lg shadow-2xl`}
        >
          {children}
        </div>
      </div>
    );
  }

  const bar = (
    <div
      className="flex items-center px-4 w-full shrink-0"
      style={{
        height: "52px",
        background: isLightOS ? "#f5f5f7" : "#38383a",
        borderBottom: isTop
          ? isLightOS
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(0,0,0,0.4)"
          : "none",
        borderTop: !isTop
          ? isLightOS
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(0,0,0,0.4)"
          : "none",
      }}
    >
      <div className="flex items-center w-full justify-between">
        {/* Left area */}
        <div className="flex items-center gap-4 flex-1">
          {isLeft && (
            <div className="flex items-center gap-2">{renderMacDots()}</div>
          )}
          <div className="flex items-center gap-4" style={{ color: iconColor }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </div>
        </div>

        {/* Center area */}
        <div
          className="flex items-center justify-center gap-3 shrink-0"
          style={{ width: "50%", maxWidth: "500px" }}
        >
          {!isLeft && !isRight && (
            <div className="flex items-center gap-2">{renderMacDots()}</div>
          )}

          <div
            className="flex items-center px-3 gap-2 rounded-md w-full"
            style={{
              background: isLightOS ? "#ffffff" : "#242426",
              border: isLightOS
                ? "1px solid rgba(0,0,0,0.05)"
                : "1px solid rgba(255,255,255,0.05)",
              height: "30px",
              color: iconColor,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <span className="text-sm truncate opacity-80">{url}</span>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            </svg>
          </div>
        </div>

        {/* Right area */}
        <div
          className="flex items-center justify-end gap-4 flex-1"
          style={{ color: iconColor }}
        >
          {isRight && (
            <div className="flex items-center gap-2">{renderMacDots()}</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden"
      style={{
        background: isLightOS ? "#ffffff" : "#1e1e1e",
        borderRadius: innerRadius,
      }}
    >
      {isTop ? (
        <>
          {bar}
          <div className="flex-1 relative overflow-hidden">{children}</div>
        </>
      ) : (
        <>
          <div className="flex-1 relative overflow-hidden">{children}</div>
          {bar}
        </>
      )}
    </div>
  );
};
