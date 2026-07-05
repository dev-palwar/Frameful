const TILE =
  "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";

interface StylePreviewProps {
  variant: string;
}

export const StylePreview = ({ variant }: StylePreviewProps) => {

  if (variant === "default") {
    return (
      <div className={TILE} style={{ background: "#2e2e2e" }}>
        <div className="relative translate-x-4 translate-y-[22px]">
          <div className="w-[5vw] h-[8vh] rounded-t-md bg-white" />
        </div>
      </div>
    );
  }

  if (variant === "glass-light") {
    return (
      <div className={TILE} style={{ background: "#3a3a3a" }}>
        <div className="relative translate-x-4 translate-y-[22px]">
          <div className="w-[5vw] h-[8vh] rounded-t-md bg-white" />
          <div className="absolute -inset-[3px] rounded-t-md border border-white/30 pointer-events-none" />
        </div>
      </div>
    );
  }

  if (variant === "glass-dark") {
    return (
      <div className={TILE} style={{ background: "#1a1a1a" }}>
        <div className="relative translate-x-4 translate-y-[22px]">
          <div
            className="w-[5vw] h-[8vh] rounded-t-md"
            style={{ background: "#555" }}
          />
          <div className="absolute -inset-[3px] rounded-t-md border border-white/20 pointer-events-none" />
        </div>
      </div>
    );
  }

  if (variant === "outline") {
    return (
      <div className={TILE} style={{ background: "#2e2e2e" }}>
        <div className="relative translate-x-4 translate-y-[22px]">
          <div
            className="w-[5vw] h-[8vh] rounded-t-md"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.50)",
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === "border") {
    return (
      <div className={TILE} style={{ background: "#c8c8c8" }}>
        <div className="relative translate-x-4 translate-y-[22px]">
          <div className="w-[5vw] h-[8vh] rounded-t-md bg-white" />
          <div className="absolute -inset-[4px] rounded-t-md border-[4px] border-[#a0a0a0] pointer-events-none" />
        </div>
      </div>
    );
  }

  if (variant === "border-dark") {
    return (
      <div className={TILE} style={{ background: "#c9c9cd" }}>
        <div className="relative translate-x-4 translate-y-[22px]">
          <div className="w-[5vw] h-[8vh] rounded-t-md bg-white" />
          <div className="absolute -inset-[4px] rounded-t-md border-[4px] border-[#2a2a2a] pointer-events-none" />
        </div>
      </div>
    );
  }

  return null;
};
