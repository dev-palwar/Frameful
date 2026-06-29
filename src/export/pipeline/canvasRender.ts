import type { ExportOptions, CanvasLayout } from "../types";
import { resolveZoomTransform } from "@/lib/zoom";

/** Clips ctx to a rounded rect path. */
function clipRounded(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y,     x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x,     y + h, rr);
  ctx.arcTo(x,     y + h, x,     y,     rr);
  ctx.arcTo(x,     y,     x + w, y,     rr);
  ctx.closePath();
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

/**
 * Renders the full composition (background + all design effects + video)
 * to a <canvas> via real-time playback and MediaRecorder.
 * Returns a WebM Blob containing the rendered video (no audio).
 */
export async function renderToCanvasBlob(
  opts: ExportOptions,
  layout: CanvasLayout,
  onProgress?: (t: number) => void,
): Promise<Blob> {
  const { outputWidth: W, outputHeight: H, designSettings: ds } = opts;
  const { svw, svh, vx, vy, effectiveTrimEnd: layoutTrimEnd } = layout;

  // ── Resolve design values ───────────────────────────────────────────────────
  const padding     = ds.padding      ?? 0;
  const opacity     = (ds.opacity     ?? 100) / 100;
  const shadow      = ds.shadow       ?? "none";
  const shadowInt   = (ds.shadowIntensity ?? 75) / 100;
  const blur        = ds.blur         ?? "none";
  const blurAmount  = (ds.blurAmount  ?? 50) / 100;
  const designScale = ds.scale        ?? 1.0;
  const style       = ds.style        ?? "default";
  const borderStyle = ds.borderStyle  ?? "sharp";
  const radius      = ds.radius       ?? 0;

  // Padded video slot (mirrors filter-graph + VideoPlayer logic)
  const paddingFrac = Math.min(padding / 10, 0.35);
  const vidW = Math.round(svw * (1 - paddingFrac * 2) * designScale);
  const vidH = Math.round(svh * (1 - paddingFrac * 2) * designScale);
  const vidX = Math.round(vx + (svw * designScale - vidW) / 2 + (svw * (1 - designScale)) / 2);
  const vidY = Math.round(vy + (svh * designScale - vidH) / 2 + (svh * (1 - designScale)) / 2);

  // Container (style background covers the full scaled slot)
  const conW = Math.round(svw * designScale);
  const conH = Math.round(svh * designScale);
  const conX = Math.round(vx + (svw - conW) / 2);
  const conY = Math.round(vy + (svh - conH) / 2);

  // Border radius
  const borderRadius =
    borderStyle === "round"  ? 9999 :
    borderStyle === "curved" ? radius : 0;

  // Shadow params (scale to output canvas)
  const scale = W / 1280;
  const shadowBlur   =
    shadow === "hug"    ? 8  * shadowInt * scale :
    shadow === "soft"   ? 25 * shadowInt * scale :
    shadow === "strong" ? 45 * shadowInt * scale : 0;
  const shadowAlpha  =
    shadow === "hug"    ? 0.35 * shadowInt :
    shadow === "soft"   ? 0.5  * shadowInt :
    shadow === "strong" ? 0.75 * shadowInt : 0;
  const shadowOffset =
    shadow === "hug"    ? 4  * scale :
    shadow === "soft"   ? 12 * scale :
    shadow === "strong" ? 20 * scale : 0;

  // Background blur px
  const blurBase = blur === "subtle" ? 8 : blur === "medium" ? 18 : blur === "heavy" ? 36 : 0;
  const blurPx   = blurBase * blurAmount;

  // ── Setup canvas + video element ───────────────────────────────────────────
  const canvas  = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const bgImg = opts.backgroundUrl ? await loadImage(opts.backgroundUrl) : null;

  const blobUrl = URL.createObjectURL(opts.videoBlob);
  const videoEl = document.createElement("video");
  videoEl.muted       = true;
  videoEl.playsInline = true;
  videoEl.preload     = "auto";
  videoEl.src         = blobUrl;

  // Wait for metadata so duration may be available
  await new Promise<void>((res, rej) => {
    videoEl.onerror = () => rej(new Error("Export: failed to load video blob"));
    videoEl.onloadedmetadata = () => res();
    videoEl.load();
  });

  // MediaRecorder WebM blobs have no duration in their header, so the browser
  // reports Infinity. Seek to a huge time — the browser will clamp to the real
  // end and update videoEl.duration to the true value.
  if (!isFinite(videoEl.duration)) {
    await new Promise<void>((res) => {
      const onSeeked = () => { videoEl.removeEventListener("seeked", onSeeked); res(); };
      videoEl.addEventListener("seeked", onSeeked);
      videoEl.currentTime = 1e9;
    });
  }

  // Now seek to the actual trim-start position
  await new Promise<void>((res) => {
    const onSeeked = () => { videoEl.removeEventListener("seeked", onSeeked); res(); };
    videoEl.addEventListener("seeked", onSeeked);
    videoEl.currentTime = opts.trimStart;
  });

  // Resolve the true effective trim-end now that the browser knows the duration
  const realDuration     = isFinite(videoEl.duration) ? videoEl.duration : layoutTrimEnd;
  const clampedTrimEnd   = isFinite(layoutTrimEnd) ? layoutTrimEnd : realDuration;
  const effectiveTrimEnd = Math.min(clampedTrimEnd, realDuration);
  const duration         = Math.max(effectiveTrimEnd - opts.trimStart, 0.001);

  // ── Frame draw ─────────────────────────────────────────────────────────────
  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // 1. Background
    if (bgImg) {
      const bgAR = bgImg.width / bgImg.height;
      const canvasAR = W / H;
      let bw = W, bh = H, bx = 0, by = 0;
      if (bgAR > canvasAR) { bh = H; bw = bh * bgAR; bx = (W - bw) / 2; }
      else { bw = W; bh = bw / bgAR; by = (H - bh) / 2; }

      ctx.save();
      if (blurPx > 0) ctx.filter = `blur(${blurPx}px)`;
      ctx.globalAlpha = 0.85;
      ctx.drawImage(bgImg, bx, by, bw, bh);
      ctx.filter = "none";
      ctx.globalAlpha = 1;
      ctx.restore();
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Shadow (drawn as a dark blurred rect behind the container)
    if (shadow !== "none" && shadowBlur > 0) {
      ctx.save();
      ctx.shadowColor   = `rgba(0,0,0,${shadowAlpha})`;
      ctx.shadowBlur    = shadowBlur;
      ctx.shadowOffsetY = shadowOffset;
      ctx.fillStyle     = "rgba(0,0,0,0.01)";
      clipRounded(ctx, conX, conY, conW, conH, borderRadius * scale);
      ctx.fill();
      ctx.restore();
    }

    // 3. Style container background
    ctx.save();
    clipRounded(ctx, conX, conY, conW, conH, borderRadius * scale);
    ctx.clip();
    switch (style) {
      case "glass-light":
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fillRect(conX, conY, conW, conH);
        break;
      case "glass-dark":
        ctx.fillStyle = "rgba(15,10,30,0.65)";
        ctx.fillRect(conX, conY, conW, conH);
        break;
      case "border":
        ctx.fillStyle = "white";
        ctx.fillRect(conX, conY, conW, conH);
        break;
      case "border-dark":
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(conX, conY, conW, conH);
        break;
    }
    ctx.restore();

    // 4. Video (clipped to border-radius + zoom transform applied)
    //    Resolve the zoom state at the current playhead position.
    const zoom = resolveZoomTransform(videoEl.currentTime, opts.zoomEvents);

    ctx.save();
    ctx.globalAlpha = opacity;

    // Clip to the video slot (respects border-radius)
    if (borderRadius > 0) {
      clipRounded(ctx, vidX, vidY, vidW, vidH, Math.max(0, borderRadius - padding * 5) * scale);
      ctx.clip();
    } else {
      // Always clip to slot bounds so zoom doesn't bleed outside the container
      ctx.beginPath();
      ctx.rect(vidX, vidY, vidW, vidH);
      ctx.clip();
    }

    if (zoom && zoom.scale > 1) {
      // Compute the canvas-space focal point (origin is 0–1 within the video slot)
      const focalX = vidX + zoom.originX * vidW;
      const focalY = vidY + zoom.originY * vidH;

      // Translate so focal point stays fixed, scale around it
      ctx.translate(focalX, focalY);
      ctx.scale(zoom.scale, zoom.scale);
      ctx.translate(-focalX, -focalY);
    }

    ctx.drawImage(videoEl, vidX, vidY, vidW, vidH);
    ctx.restore();

    // 5. Style border / outline on top
    if (style === "outline") {
      ctx.save();
      clipRounded(ctx, conX, conY, conW, conH, borderRadius * scale);
      ctx.strokeStyle = "rgba(139,92,246,0.65)";
      ctx.lineWidth   = 2 * scale;
      ctx.stroke();
      ctx.restore();
    } else if (style === "border") {
      ctx.save();
      clipRounded(ctx, conX, conY, conW, conH, borderRadius * scale);
      ctx.strokeStyle = "#e4d8f8";
      ctx.lineWidth   = 4 * scale;
      ctx.stroke();
      ctx.restore();
    } else if (style === "border-dark") {
      ctx.save();
      clipRounded(ctx, conX, conY, conW, conH, borderRadius * scale);
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth   = 4 * scale;
      ctx.stroke();
      ctx.restore();
    }
  }

  // ── MediaRecorder loop ─────────────────────────────────────────────────────
  const stream   = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm",
  });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise<Blob>((resolve, reject) => {
    recorder.onstop  = () => {
      URL.revokeObjectURL(blobUrl);
      resolve(new Blob(chunks, { type: "video/webm" }));
    };
    recorder.onerror = reject;
    recorder.start(100); // emit data every 100 ms

    // `duration` and `effectiveTrimEnd` are resolved above from the real video duration

    const tick = () => {
      try {
        drawFrame();
        onProgress?.((videoEl.currentTime - opts.trimStart) / duration);
        if (videoEl.currentTime < effectiveTrimEnd && !videoEl.ended && !videoEl.paused) {
          requestAnimationFrame(tick);
        } else {
          if (recorder.state === "recording") recorder.stop();
        }
      } catch (err) {
        // Errors inside rAF are otherwise uncaught and cause an infinite hang
        if (recorder.state === "recording") recorder.stop();
        reject(err);
      }
    };

    videoEl.onended = () => { if (recorder.state === "recording") recorder.stop(); };
    videoEl.play().then(() => requestAnimationFrame(tick)).catch(reject);
  });
}
