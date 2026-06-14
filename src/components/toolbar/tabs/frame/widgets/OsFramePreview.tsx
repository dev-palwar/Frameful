import React from "react";

interface OsFramePreviewProps {
  variant: string;
}

const TILE = "w-full h-full rounded-md overflow-hidden relative flex flex-col";

export const OsFramePreview = ({ variant }: OsFramePreviewProps) => {
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
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)" }}
      >
        {/* macOS titlebar */}
        <div
          className="flex items-center gap-1 px-2"
          style={{
            height: "18%",
            background: "linear-gradient(180deg, #3d3d3d 0%, #2e2e2e 100%)",
            borderBottom: "1px solid rgba(0,0,0,0.4)",
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
        </div>
        {/* Content area */}
        <div className="flex-1 bg-white/5 flex items-center justify-center">
          <div className="w-[55%] h-[55%] rounded bg-white/10 border border-white/10" />
        </div>
      </div>
    );
  }

  if (variant === "macos-light") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)" }}
      >
        {/* macOS light titlebar */}
        <div
          className="flex items-center gap-1 px-2"
          style={{
            height: "18%",
            background: "linear-gradient(180deg, #fafafa 0%, #ececec 100%)",
            borderBottom: "1px solid rgba(0,0,0,0.12)",
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
        </div>
        {/* Content area */}
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="w-[55%] h-[55%] rounded bg-black/8 border border-black/10" />
        </div>
      </div>
    );
  }

  if (variant === "windows") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}
      >
        {/* Windows 11 titlebar */}
        <div
          className="flex items-center justify-between px-2"
          style={{
            height: "18%",
            background: "linear-gradient(180deg, #202020 0%, #181818 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-blue-500/60" />
          </div>
          {/* Win11 right controls */}
          <div className="flex items-center gap-0">
            <div className="w-3 h-full flex items-center justify-center">
              <div className="w-1.5 h-px bg-white/50" />
            </div>
            <div className="w-3 h-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 border border-white/50 rounded-sm" style={{ borderRadius: "1px" }} />
            </div>
            <div
              className="w-3 h-full flex items-center justify-center"
              style={{ background: "rgba(196,43,28,0.0)" }}
            >
              <div className="w-1.5 h-1.5 relative">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(45deg,rgba(255,255,255,0.5) 40%,transparent 40%,transparent 60%,rgba(255,255,255,0.5) 60%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white/5 flex items-center justify-center">
          <div className="w-[55%] h-[55%] rounded bg-white/10 border border-white/10" />
        </div>
      </div>
    );
  }

  if (variant === "ubuntu") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #2c001e 0%, #3d0026 100%)" }}
      >
        {/* Ubuntu/GNOME titlebar */}
        <div
          className="flex items-center justify-between px-2"
          style={{
            height: "18%",
            background: "linear-gradient(180deg, #3a3a3a 0%, #2e2e2e 100%)",
            borderBottom: "1px solid rgba(0,0,0,0.5)",
          }}
        >
          {/* Ubuntu has close on LEFT */}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#e95420]" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>
        <div className="flex-1 bg-white/5 flex items-center justify-center">
          <div className="w-[55%] h-[55%] rounded bg-white/10 border border-white/10" />
        </div>
      </div>
    );
  }

  return null;
};
