import React from "react";

interface ButtonPositionPreviewProps {
  /** "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center" */
  variant: string;
}

const DOT_ROW = (
  <>
    <div className="rounded-full" style={{ width: 5, height: 5, background: "#ff5f57" }} />
    <div className="rounded-full" style={{ width: 5, height: 5, background: "#ffbd2e" }} />
    <div className="rounded-full" style={{ width: 5, height: 5, background: "#28c840" }} />
  </>
);

export const ButtonPositionPreview = ({ variant }: ButtonPositionPreviewProps) => {
  const isTop = variant.startsWith("top");
  const isLeft = variant.endsWith("left");
  const isRight = variant.endsWith("right");
  const isCenter = variant.endsWith("center");

  const justify = isLeft ? "flex-start" : isRight ? "flex-end" : "center";

  const bar = (
    <div
      className="flex items-center px-2"
      style={{
        height: "22%",
        background: "#2e2e2e",
        borderBottom: isTop ? "1px solid rgba(0,0,0,0.4)" : "none",
        borderTop: !isTop ? "1px solid rgba(0,0,0,0.4)" : "none",
        justifyContent: justify,
        gap: 3,
      }}
    >
      {DOT_ROW}
    </div>
  );

  const content = (
    <div
      className="flex-1 flex items-center justify-center"
      style={{ background: "#1e1e1e" }}
    >
      <div className="w-[50%] h-[50%] rounded bg-white/10 border border-white/8" />
    </div>
  );

  return (
    <div
      className="w-full h-full rounded-md overflow-hidden flex flex-col"
      style={{ background: "#1e1e1e" }}
    >
      {isTop ? (
        <>
          {bar}
          {content}
        </>
      ) : (
        <>
          {content}
          {bar}
        </>
      )}
    </div>
  );
};
