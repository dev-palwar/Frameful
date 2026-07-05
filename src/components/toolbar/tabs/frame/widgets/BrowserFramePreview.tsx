
interface BrowserFramePreviewProps {
  variant: string;
}

const TILE = "w-full h-full rounded-md overflow-hidden relative flex flex-col";

export const BrowserFramePreview = ({ variant }: BrowserFramePreviewProps) => {
  if (variant === "chrome") {
    return (
      <div className={TILE} style={{ background: "#202124" }}>
        {}
        <div
          className="flex items-end px-1 pt-1 gap-0.5"
          style={{ height: "30%", background: "#35363a" }}
        >
          {}
          <div
            className="flex items-center gap-0.5 px-1.5 rounded-t-md text-[6px] text-white/80 shrink-0"
            style={{ height: "70%", background: "#202124", minWidth: "42%", maxWidth: "42%" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0" />
            <span className="truncate text-[5px]">Tab</span>
          </div>
          {}
          <div
            className="flex items-center gap-0.5 px-1 rounded-t-md shrink-0 opacity-40"
            style={{ height: "60%", background: "#2d2e31", minWidth: "30%" }}
          >
            <div className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
          </div>
        </div>
        {}
        <div
          className="flex items-center gap-1 px-2"
          style={{ height: "20%", background: "#202124", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex-1 h-[5px] rounded-full bg-white/10" />
        </div>
        {}
        <div className="flex-1 bg-white/5 flex items-center justify-center">
          <div className="w-[55%] h-[55%] rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (variant === "safari") {
    return (
      <div className={TILE} style={{ background: "#1c1c1e" }}>
        {}
        <div
          className="flex flex-col"
          style={{ height: "35%", background: "linear-gradient(180deg, #2c2c2e 0%, #252527 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {}
          <div className="flex items-center gap-1 px-2 pt-1" style={{ height: "45%" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#28c840" }} />
          </div>
          {}
          <div className="flex items-center justify-center px-2" style={{ height: "55%" }}>
            <div
              className="flex items-center gap-1 px-2 rounded-md"
              style={{ background: "rgba(255,255,255,0.08)", height: "75%", width: "80%" }}
            >
              <div className="flex-1 h-[4px] rounded-full bg-white/20" />
            </div>
          </div>
        </div>
        {}
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="w-[55%] h-[55%] rounded bg-black/10" />
        </div>
      </div>
    );
  }

  if (variant === "firefox") {
    return (
      <div className={TILE} style={{ background: "#1d1b20" }}>
        {}
        <div
          className="flex items-end px-1 pt-1 gap-0.5"
          style={{ height: "28%", background: "#2b2a33" }}
        >
          <div
            className="flex items-center gap-0.5 px-1.5 rounded-t-md shrink-0"
            style={{ height: "72%", background: "#1d1b20", minWidth: "40%" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500/70 shrink-0" />
            <div className="flex-1 h-[3px] rounded-full bg-white/20" />
          </div>
          <div
            className="flex items-center px-1 rounded-t-md shrink-0 opacity-40"
            style={{ height: "60%", background: "#252430", minWidth: "28%" }}
          >
            <div className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
          </div>
        </div>
        {}
        <div
          className="flex items-center gap-1.5 px-2"
          style={{ height: "18%", background: "#1d1b20", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex-1 h-[4px] rounded-md bg-white/10" />
          <div className="w-1 h-1 rounded-full bg-white/20" />
        </div>
        {}
        <div className="flex-1 bg-white/5 flex items-center justify-center">
          <div className="w-[55%] h-[55%] rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (variant === "arc") {
    return (
      <div className={TILE} style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0d35 100%)" }}>
        {}
        <div className="flex h-full">
          <div
            className="flex flex-col items-center py-1.5 gap-1"
            style={{
              width: "22%",
              background: "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.06) 100%)",
              borderRight: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400/60" />
            <div className="w-1.5 h-px bg-purple-400/20 mt-0.5" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-1 rounded-sm bg-white/10" />
            ))}
          </div>
          {}
          <div className="flex-1 bg-white/5 flex items-center justify-center">
            <div className="w-[60%] h-[55%] rounded bg-white/10 border border-purple-400/10" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "edge") {
    return (
      <div className={TILE} style={{ background: "#202020" }}>
        {}
        <div
          className="flex items-end px-1 pt-1 gap-0.5"
          style={{ height: "28%", background: "#2d2d2d" }}
        >
          <div
            className="flex items-center gap-0.5 px-1.5 rounded-t-md shrink-0"
            style={{ height: "72%", background: "#202020", minWidth: "40%" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 shrink-0" />
            <div className="flex-1 h-[3px] rounded-full bg-white/20" />
          </div>
          <div
            className="flex items-center px-1 rounded-t-md shrink-0 opacity-40"
            style={{ height: "60%", background: "#282828", minWidth: "28%" }}
          >
            <div className="w-1 h-1 rounded-full bg-white/30" />
          </div>
        </div>
        {}
        <div
          className="flex items-center gap-1 px-2"
          style={{ height: "18%", background: "#202020", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-1 h-1 rounded-full bg-cyan-400/40" />
          <div className="flex-1 h-[4px] rounded-md bg-white/10" />
        </div>
        {}
        <div className="flex-1 bg-white/5 flex items-center justify-center">
          <div className="w-[55%] h-[55%] rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return null;
};
