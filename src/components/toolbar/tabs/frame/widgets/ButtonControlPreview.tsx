import React from "react";

interface ButtonControlPreviewProps {
    variant: string;
    style?: "macos" | "windows";
}

const DOT_COLORS = {
  close: "#ff5f57",
  min: "#ffbd2e",
  max: "#28c840",
};

const WIN_BTN = "flex items-center justify-center";

export const ButtonControlPreview = ({
  variant,
  style = "macos",
}: ButtonControlPreviewProps) => {
  const isMac = style === "macos";

  const macDot = (color: string, active = true) => (
    <div
      className="rounded-full"
      style={{
        width: 7,
        height: 7,
        background: active ? color : "rgba(255,255,255,0.12)",
        border: active ? "none" : "1px solid rgba(255,255,255,0.18)",
      }}
    />
  );

  const winBtn = (symbol: React.ReactNode, active = true) => (
    <div
      className={WIN_BTN}
      style={{
        width: 12,
        height: "100%",
        opacity: active ? 1 : 0.2,
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 5 }}>{symbol}</div>
    </div>
  );

  const renderButtons = () => {
    if (isMac) {
      if (variant === "all")
        return (
          <>
            {macDot(DOT_COLORS.close)}
            {macDot(DOT_COLORS.min)}
            {macDot(DOT_COLORS.max)}
          </>
        );
      if (variant === "close-only")
        return (
          <>
            {macDot(DOT_COLORS.close)}
            {macDot("", false)}
            {macDot("", false)}
          </>
        );
      if (variant === "min-max")
        return (
          <>
            {macDot("", false)}
            {macDot(DOT_COLORS.min)}
            {macDot(DOT_COLORS.max)}
          </>
        );
      if (variant === "none")
        return (
          <>
            {macDot("", false)}
            {macDot("", false)}
            {macDot("", false)}
          </>
        );
    } else {
      // Windows-style
      if (variant === "all")
        return (
          <>
            {winBtn("─")}
            {winBtn("□")}
            {winBtn("✕")}
          </>
        );
      if (variant === "close-only")
        return (
          <>
            {winBtn("─", false)}
            {winBtn("□", false)}
            {winBtn("✕")}
          </>
        );
      if (variant === "min-max")
        return (
          <>
            {winBtn("─")}
            {winBtn("□")}
            {winBtn("✕", false)}
          </>
        );
      if (variant === "none")
        return (
          <>
            {winBtn("─", false)}
            {winBtn("□", false)}
            {winBtn("✕", false)}
          </>
        );
    }
    return null;
  };

  return (
    <div
      className="w-full h-full rounded-md overflow-hidden flex flex-col"
      style={{ background: "#1e1e1e" }}
    >
      {}
      <div
        className="flex items-center px-2"
        style={{
          height: "28%",
          background: isMac
            ? "linear-gradient(180deg, #3d3d3d 0%, #2e2e2e 100%)"
            : "#2a2a2a",
          borderBottom: "1px solid rgba(0,0,0,0.4)",
          justifyContent: isMac ? "flex-start" : "flex-end",
          gap: isMac ? 3 : 0,
        }}
      >
        {renderButtons()}
      </div>
      {}
      <div className="flex-1 bg-white/5 flex items-center justify-center">
        <div className="w-[55%] h-[50%] rounded bg-white/10 border border-white/8" />
      </div>
    </div>
  );
};
