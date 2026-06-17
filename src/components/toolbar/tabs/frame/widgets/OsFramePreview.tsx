import React from "react";

interface OsFramePreviewProps {
  variant: string;
  theme?: string;
}

const TILE = "w-full h-full rounded-md overflow-hidden relative flex flex-col";

export const OsFramePreview = ({ variant, theme = "dark" }: OsFramePreviewProps) => {
  if (variant === "none") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #1a1030 0%, #0d0920 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[60%] h-[55%] rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-sm bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "macos") {
    const isLight = theme === "light";
    return (
      <div
        className={TILE}
        style={{ background: isLight ? "#ffffff" : "#1e1e1e" }}
      >
        {/* macOS titlebar */}
        <div
          className="flex items-center justify-between px-1.5 w-full shrink-0"
          style={{
            height: "22%",
            background: isLight ? "#f5f5f7" : "#38383a",
            borderBottom: isLight ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-[2px]">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <div className={`w-1/2 h-[50%] rounded ${isLight ? 'bg-white border border-black/5' : 'bg-[#242426] border border-white/5'}`} />
          <div className="w-4" /> {/* spacer for balance */}
        </div>
        {/* Content area */}
        <div className={`flex-1 ${isLight ? 'bg-black/5' : 'bg-white/5'} flex items-center justify-center`}>
          <div className={`w-[55%] h-[55%] rounded ${isLight ? 'bg-black/8 border border-black/10' : 'bg-white/10 border border-white/10'}`} />
        </div>
      </div>
    );
  }

  if (variant === "firefox") {
    const isLight = theme === "light";
    return (
      <div className={TILE} style={{ background: isLight ? "#f9f9fb" : "#1d1b20" }}>
        <div className="flex items-end px-1 pt-1 gap-0.5 shrink-0" style={{ height: "16%", background: isLight ? "#e3e4e6" : "#2b2a33" }}>
          <div className={`flex items-center gap-1 px-1.5 rounded-t-sm shrink-0 mb-[1px]`} style={{ height: "calc(100% - 2px)", background: isLight ? "#f9f9fb" : "#1d1b20", width: "60%" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500/70 shrink-0" />
            <div className={`flex-1 h-[2px] rounded-full ${isLight ? 'bg-black/10' : 'bg-white/20'}`} />
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-1.5 shrink-0`} style={{ height: "14%", background: isLight ? "#f9f9fb" : "#1d1b20", borderBottom: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)" }}>
          <div className={`w-1 h-1 rounded-full ${isLight ? 'bg-black/20' : 'bg-white/20'} shrink-0`} />
          <div className={`flex-1 h-[6px] rounded-sm ${isLight ? 'bg-black/5 border border-black/5' : 'bg-white/10'}`} />
        </div>
        <div className={`flex-1 ${isLight ? 'bg-black/5' : 'bg-white/5'} flex items-center justify-center`}>
          <div className={`w-[55%] h-[55%] rounded ${isLight ? 'bg-black/8 border border-black/10' : 'bg-white/10 border border-white/10'}`} />
        </div>
      </div>
    );
  }

  if (variant === "arc") {
    const isLight = theme === "light";
    return (
      <div className={TILE} style={{ background: isLight ? "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)" : "linear-gradient(135deg, #0f0a1e 0%, #1a0d35 100%)" }}>
        <div className="flex h-full w-full overflow-hidden">
          <div className="flex flex-col py-1.5 px-1 gap-1 shrink-0" style={{ width: "25%", background: isLight ? "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)" : "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.06) 100%)", borderRight: isLight ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(139,92,246,0.2)" }}>
            <div className="flex gap-[1px] px-0.5 pb-1">
              <div className="w-[3px] h-[3px] rounded-full bg-[#ff5f57]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[#ffbd2e]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[#28c840]" />
            </div>
            <div className="w-full px-0.5">
              <div className={`w-full h-px ${isLight ? 'bg-black/10' : 'bg-purple-400/20'} mb-1`} />
              <div className="flex flex-col gap-[2px]">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-full h-1 rounded-sm ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className={`flex-1 relative ${isLight ? 'bg-white' : 'bg-[#18181b]'} rounded-l-sm border ${isLight ? 'border-black/5' : 'border-purple-400/10'} overflow-hidden shadow-sm flex items-center justify-center`}>
            <div className={`w-[55%] h-[55%] rounded ${isLight ? 'bg-black/5 border border-black/10' : 'bg-white/5 border border-white/10'}`} />
          </div>
        </div>
      </div>
    );
  }



  return null;
};
