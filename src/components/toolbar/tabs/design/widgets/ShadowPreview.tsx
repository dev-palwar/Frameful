const TILE =
  "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";
const BASE_STYLE = { background: "#d2d2d6" };

const SHADOWS: Record<string, string> = {
  none: "none",
  hug: "0 2px 6px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)",
  soft: "0 8px 24px rgba(0,0,0,0.60), 0 2px 8px rgba(0,0,0,0.4)",
  strong: "0 18px 44px rgba(0,0,0,0.85), 0 6px 16px rgba(0,0,0,0.6)",
};

interface ShadowPreviewProps {
  variant: string;
}

export const ShadowPreview = ({ variant }: ShadowPreviewProps) => {
  const shadow = SHADOWS[variant] ?? "none";
  return (
    <div className={TILE} style={BASE_STYLE}>
      <div className="relative translate-x-[38px] translate-y-[30px] h-[12vh] w-[11vw]">
        {}
        <div
          className="h-full w-full rounded-t-md bg-white"
          style={{ boxShadow: shadow }}
        />
      </div>
    </div>
  );
};
