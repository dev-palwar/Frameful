const TILE =
  "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";
const BASE_STYLE = { background: "#2e2e2e" };

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
      <div className="relative translate-x-4 translate-y-[22px]">
        {/* White card — border-radius reflects the shape variant */}
        <div
          className="w-[5vw] h-[8vh] bg-white"
          style={{ borderRadius: `${r} ${r} 0 0` }}
        />
        {/* Border overlay — same radius as the card */}
        <div
          className="absolute -inset-[3px] border border-white/30 pointer-events-none"
          style={{ borderRadius: `calc(${r} + 3px) calc(${r} + 3px) 0 0` }}
        />
      </div>
    </div>
  );
};
