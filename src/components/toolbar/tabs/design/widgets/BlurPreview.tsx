const TILE = "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";
const BASE_STYLE = { background: "linear-gradient(135deg, #1a1030 0%, #0d0920 100%)" };

/** px values used purely for the thumbnail visual */
const BLUR_PX: Record<string, number> = {
  none:   0,
  subtle: 2,
  medium: 5,
  heavy:  10,
};

interface BlurPreviewProps {
  variant: string;
}

export const BlurPreview = ({ variant }: BlurPreviewProps) => {
  const px = BLUR_PX[variant] ?? 0;

  if (variant === "none") {
    return (
      <div className={TILE} style={BASE_STYLE}>
        {/* Clean, crisp card */}
        <div
          className="w-[58%] h-[58%] rounded-lg bg-white"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.45)" }}
        >
          <div
            className="w-full h-[45%] rounded-t-lg"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={TILE} style={BASE_STYLE}>
      {/* Blurred source layer behind the card */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 40% 55%, rgba(139,92,246,0.5) 0%, rgba(30,10,60,0.3) 60%)",
          filter: `blur(${px * 1.5}px)`,
        }}
      />
      {/* Card rendered with the blur amount */}
      <div
        className="relative w-[58%] h-[58%] rounded-lg"
        style={{
          background: "rgba(255,255,255,0.18)",
          backdropFilter: `blur(${px}px)`,
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          filter: `blur(${px * 0.4}px)`,
        }}
      />
    </div>
  );
};
