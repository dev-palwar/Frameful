const TILE =
  "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";
const BASE_STYLE = { background: "#222222" };

const BLUR_PX: Record<string, number> = {
  none: 0,
  subtle: 2,
  medium: 5,
  heavy: 10,
};

interface BlurPreviewProps {
  variant: string;
}

export const BlurPreview = ({ variant }: BlurPreviewProps) => {
  const px = BLUR_PX[variant] ?? 0;
  return (
    <div className={TILE} style={BASE_STYLE}>
      <div className="relative translate-x-[38px] translate-y-[30px] h-[12vh] w-[11vw]">
        {}
        <div
          className="h-full w-full rounded-t-md bg-white"
          style={{ filter: px > 0 ? `blur(${px}px)` : "none" }}
        />
      </div>
    </div>
  );
};
