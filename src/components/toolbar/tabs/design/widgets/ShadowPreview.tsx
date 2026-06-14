const TILE = "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";
const BASE_STYLE = { background: "linear-gradient(135deg, #1a1030 0%, #0d0920 100%)" };

interface ShadowPreviewProps {
  variant: string;
}

export const ShadowPreview = ({ variant }: ShadowPreviewProps) => {
  if (variant === "none") {
    return (
      <div className={TILE} style={BASE_STYLE}>
        <div className="w-[58%] h-[58%] rounded-lg bg-white" style={{ boxShadow: "none" }} />
      </div>
    );
  }
  if (variant === "hug") {
    return (
      <div className={TILE} style={BASE_STYLE}>
        <div
          className="w-[55%] h-[55%] rounded-lg bg-white"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)" }}
        />
      </div>
    );
  }
  if (variant === "soft") {
    return (
      <div className={TILE} style={BASE_STYLE}>
        <div
          className="w-[52%] h-[52%] rounded-lg bg-white"
          style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)" }}
        />
      </div>
    );
  }
  if (variant === "strong") {
    return (
      <div className={TILE} style={BASE_STYLE}>
        <div
          className="w-[50%] h-[50%] rounded-lg bg-white"
          style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.85), 0 6px 18px rgba(0,0,0,0.6)" }}
        />
      </div>
    );
  }
  return null;
};
