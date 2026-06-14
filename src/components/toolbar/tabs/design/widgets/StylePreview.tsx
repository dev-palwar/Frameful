const TILE = "w-full h-full rounded-md overflow-hidden relative flex items-center justify-center";

interface StylePreviewProps {
  variant: string;
}

export const StylePreview = ({ variant }: StylePreviewProps) => {
  if (variant === "default") {
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
            backgroundSize: "12px 12px",
          }}
        />
        <div
          className="relative w-[62%] h-[62%] rounded-lg bg-white"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.9) inset" }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[40%] rounded-t-lg"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)" }}
          />
          <div className="absolute bottom-[22%] left-[15%] right-[15%] space-y-[4px]">
            <div className="h-[3px] rounded-full bg-black/10" />
            <div className="h-[3px] rounded-full bg-black/10 w-[70%]" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "glass-light") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #7c3aed 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.3) 0%, transparent 60%)" }}
        />
        <div
          className="relative w-[62%] h-[62%] rounded-lg"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 4px 20px rgba(100,50,200,0.25), 0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[45%] rounded-t-lg"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)" }}
          />
          <div className="absolute bottom-[20%] left-[15%] right-[15%] space-y-[4px]">
            <div className="h-[3px] rounded-full bg-white/60" />
            <div className="h-[3px] rounded-full bg-white/60 w-[65%]" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "glass-dark") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0d35 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(167,139,250,0.4) 0%, transparent 60%)",
          }}
        />
        <div
          className="relative w-[62%] h-[62%] rounded-lg"
          style={{
            background: "rgba(15,10,30,0.65)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(167,139,250,0.25)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(167,139,250,0.15) inset",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[35%] rounded-t-lg"
            style={{ background: "linear-gradient(180deg, rgba(167,139,250,0.18) 0%, rgba(255,255,255,0) 100%)" }}
          />
          <div className="absolute bottom-[20%] left-[15%] right-[15%] space-y-[4px]">
            <div className="h-[3px] rounded-full bg-white/20" />
            <div className="h-[3px] rounded-full bg-white/20 w-[65%]" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "outline") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #0f0820 0%, #1c0f3a 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.3) 1px,transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        <div
          className="relative w-[62%] h-[62%] rounded-lg"
          style={{
            background: "rgba(139,92,246,0.06)",
            border: "1.5px solid rgba(139,92,246,0.65)",
            boxShadow: "0 0 12px rgba(139,92,246,0.35), 0 0 4px rgba(139,92,246,0.2) inset",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-lg"
            style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)" }}
          />
          <div className="absolute bottom-[20%] left-[15%] right-[15%] space-y-[4px]">
            <div className="h-[3px] rounded-full" style={{ background: "rgba(167,139,250,0.5)" }} />
            <div className="h-[3px] rounded-full w-[65%]" style={{ background: "rgba(167,139,250,0.5)" }} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "border") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #f5f0ff 0%, #ede5ff 100%)" }}
      >
        <div
          className="relative w-[68%] h-[68%] rounded-lg bg-white"
          style={{ border: "4px solid #e4d8f8", boxShadow: "0 2px 12px rgba(139,92,246,0.12)" }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[40%] rounded-t-md"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)" }}
          />
          <div className="absolute bottom-[22%] left-[15%] right-[15%] space-y-[4px]">
            <div className="h-[3px] rounded-full bg-black/10" />
            <div className="h-[3px] rounded-full bg-black/10 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "border-dark") {
    return (
      <div
        className={TILE}
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)" }}
      >
        <div
          className="relative w-[68%] h-[68%] rounded-lg bg-white"
          style={{ border: "4px solid #2a2a2a", boxShadow: "0 0 0 1px #111, 0 4px 20px rgba(0,0,0,0.8)" }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[40%] rounded-t-md"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)" }}
          />
          <div className="absolute bottom-[22%] left-[15%] right-[15%] space-y-[4px]">
            <div className="h-[3px] rounded-full bg-black/12" />
            <div className="h-[3px] rounded-full bg-black/12 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
