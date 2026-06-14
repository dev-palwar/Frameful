const TILE = "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";
const BASE_STYLE = { background: "linear-gradient(135deg, #1a1030 0%, #0d0920 100%)" };

const RADII: Record<string, string> = {
  sharp: "0px",
  curved: "8px",
  round: "24px",
};

interface BorderShapePreviewProps {
  variant: string;
}

export const BorderShapePreview = ({ variant }: BorderShapePreviewProps) => {
  const r = RADII[variant] ?? "0px";
  return (
    <div className={TILE} style={BASE_STYLE}>
      <div
        className="w-[58%] h-[58%] bg-white"
        style={{
          borderRadius: r,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.85) inset",
        }}
      >
        <div
          className="w-full h-[45%]"
          style={{
            borderRadius: `${r} ${r} 0 0`,
            background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
    </div>
  );
};
