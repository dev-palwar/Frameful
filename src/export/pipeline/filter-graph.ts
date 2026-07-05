import type { ExportOptions, CanvasLayout } from "../types";

export function buildFilterGraph(
  opts: ExportOptions,
  layout: CanvasLayout,
): string {
  const { outputWidth: W, outputHeight: H, trimStart, designSettings } = opts;
  const { svw, svh, vx, vy, effectiveTrimEnd } = layout;

  const ds = designSettings ?? {};
  const padding      = ds.padding      ?? 0;           
  const opacity      = ds.opacity      ?? 100;          
  const shadow       = ds.shadow       ?? "none";
  const shadowInt    = (ds.shadowIntensity ?? 75) / 100; 
  const blur         = ds.blur         ?? "none";
  const blurAmount   = (ds.blurAmount  ?? 50) / 100;   
  const designScale  = ds.scale        ?? 1.0;

  const paddingFrac = Math.min(padding / 10, 0.35); 
  const paddedW = Math.round(svw * (1 - paddingFrac * 2) * designScale);
  const paddedH = Math.round(svh * (1 - paddingFrac * 2) * designScale);
  
  const paddedX = Math.round(vx + (svw - paddedW) / 2);
  const paddedY = Math.round(vy + (svh - paddedH) / 2);

  const opacityVal = (opacity / 100).toFixed(3);

  const blurBase =
    blur === "subtle" ? 6 :
    blur === "medium" ? 15 :
    blur === "heavy"  ? 30 : 0;
  const blurSigma = (blurBase * blurAmount).toFixed(1);

  const shadowSigma =
    shadow === "hug"    ? Math.round(8  * shadowInt) :
    shadow === "soft"   ? Math.round(20 * shadowInt) :
    shadow === "strong" ? Math.round(35 * shadowInt) : 0;

  const vidTrimScale = [
    `[0:v] trim=start=${trimStart}:end=${effectiveTrimEnd}`,
    `setpts=PTS-STARTPTS`,
    `scale=${paddedW}:${paddedH} [vidscaled]`,
  ].join(", ");

  const vidOpacity =
    opacity < 100
      ? `[vidscaled] colorchannelmixer=aa=${opacityVal} [vid]`
      : `[vidscaled] copy [vid]`;

  let bgFilter: string;
  if (opts.backgroundUrl) {
    const blurPart = blurSigma !== "0.0" ? `gblur=sigma=${blurSigma}` : null;
    const parts = [
      `[1:v] scale=${W}:${H}:force_original_aspect_ratio=increase`,
      `crop=${W}:${H}`,
      blurPart,
      `colorchannelmixer=aa=0.85`,
    ].filter(Boolean);
    bgFilter = `${parts.join(", ")} [bg]`;
  } else {
    bgFilter = `color=black:size=${W}x${H}:rate=30 [bg]`;
  }

  if (shadow !== "none" && shadowSigma > 0) {
    const shadowX = paddedX - shadowSigma;
    const shadowY = paddedY - shadowSigma;

    return [
      bgFilter,
      vidTrimScale,
      vidOpacity,
      
      `[vid] split [vid1][vidforshadow]`,
      
      `[vidforshadow] colorchannelmixer=rr=0:gg=0:bb=0:aa=${(shadowInt * 0.75).toFixed(3)}, gblur=sigma=${shadowSigma}, pad=iw+${shadowSigma * 2}:ih+${shadowSigma * 2}:${shadowSigma}:${shadowSigma}:color=black@0 [shadow]`,
      
      `[bg][shadow] overlay=${shadowX}:${shadowY}:format=auto [withshadow]`,
      `[withshadow][vid1] overlay=${paddedX}:${paddedY}:format=auto [out]`,
    ].join("; ");
  }

  return [
    bgFilter,
    vidTrimScale,
    vidOpacity,
    `[bg][vid] overlay=${paddedX}:${paddedY}:format=auto [out]`,
  ].join("; ");
}
