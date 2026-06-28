const TILE =
  "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";

interface StylePreviewProps {
  variant: string;
}

export const StylePreview = ({ variant }: StylePreviewProps) => {
  // ── Default ──────────────────────────────────────────────────────────────
  // Dark bg, plain white card — no border frame, clean.
  if (variant === "default") {
    return (
      <div className={TILE} style={{ background: "#2e2e2e" }}>
        <div className="relative translate-x-4 translate-y-[22px]">
          <div className="w-[5vw] h-[8vh] rounded-t-md bg-white" />
        </div>
      </div>
    );
  }

  // ── Glass Light ───────────────────────────────────────────────────────────
  // Medium-dark bg, white card inside a visible border container.
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

  // ── Glass Dark ────────────────────────────────────────────────────────────
  // Near-black bg, dark gray card inside a subtle border container.
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

  // ── Outline ───────────────────────────────────────────────────────────────
  // Dark bg, card is transparent — only the border stroke is visible.
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

  // ── Border ────────────────────────────────────────────────────────────────
  // Light gray bg, white card with a thick gray border frame.
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

  // ── Border Dark ───────────────────────────────────────────────────────────
  // Near-black bg, white card with a thick dark border frame.
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
