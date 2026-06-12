import { useNavigate } from "react-router";
import { ArrowLeft, Download } from "lucide-react";
import { useRef, useState } from "react";
import { useRecorder } from "@/hooks/useRecorder";
import ToolBar from "@/components/toolbar/ToolBar";
import VideoPlayer, {
  type VideoPlayerHandle,
} from "@/components/video/VideoPlayer";
import { Typography } from "@/design-system/Typography";

export default function StudioPage() {
  const navigate = useNavigate();
  const [background, setBackground] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const { videoUrl, discardRecording } = useRecorder();

  const handleGoBack = () => {
    discardRecording();
    navigate("/");
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    setIsDownloading(true);

    try {
      const trimStart = videoPlayerRef.current?.trimStart ?? 0;
      const trimEnd = videoPlayerRef.current?.trimEnd ?? Infinity;
      // ── Accurate layout from live DOM measurements ──────────────────────────
      const layout = videoPlayerRef.current?.getExportLayout() ?? {
        scale: 1,
        posX_frac: 0,
        posY_frac: 0,
        paddingX_frac: 0.05,
        paddingY_frac: 0.05,
      };

      // ── 1. Off-screen video element ──────────────────────────────────────
      const video = document.createElement("video");
      video.src = videoUrl;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Video load failed"));
        video.load();
      });
      const effectiveTrimEnd = isFinite(trimEnd)
        ? Math.min(trimEnd, video.duration)
        : video.duration;

      // ── 2. Off-screen canvas 1280×720 (16:9) ─────────────────────────────
      const W = 1280,
        H = 720;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // ── 3. Pre-load background image ──────────────────────────────────────
      let bgImg: HTMLImageElement | null = null;
      if (background) {
        bgImg = new Image();
        bgImg.src = background;
        await new Promise<void>((resolve) => {
          bgImg!.onload = () => resolve();
          bgImg!.onerror = () => resolve();
        });
      }

      // ── 4. Set up MediaRecorder (with audio if available) ─────────────────
      const canvasStream = canvas.captureStream(30);
      let recordStream: MediaStream = canvasStream;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const audioCtx = new AudioCtx();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        if (dest.stream.getAudioTracks().length > 0) {
          recordStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...dest.stream.getAudioTracks(),
          ]);
        }
      } catch {
        // No audio — export video-only
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const recorder = new MediaRecorder(recordStream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      const recordingDone = new Promise<Blob>((resolve) => {
        recorder.onstop = () =>
          resolve(new Blob(chunks, { type: "video/webm" }));
      });

      // ── 5. Seek to trim start ─────────────────────────────────────────────
      video.currentTime = trimStart;
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
        if (video.readyState >= 2) resolve();
      });

      // ── 6. rAF loop: draw background + video onto canvas ──────────────────
      //
      // We replicate the preview transform exactly:
      //   1. object-contain the video inside the padded area
      //   2. apply the user's scale(scale) translate(posX, posY) around the canvas centre
      //
      // PADDING_X/Y are derived from the live DOM measurements in layout,
      // so they match the actual CSS padding — not a hardcoded guess.
      const PADDING_X = layout.paddingX_frac * W;
      const PADDING_Y = layout.paddingY_frac * H;
      // Position offsets are stored as fractions of the container size,
      // so multiplying by canvas size gives canvas-space offsets.
      const canvasPosX = layout.posX_frac * W;
      const canvasPosY = layout.posY_frac * H;

      const renderFrame = () => {
        if (video.currentTime >= effectiveTrimEnd || video.ended) {
          video.pause();
          recorder.stop();
          return;
        }

        ctx.clearRect(0, 0, W, H);

        // Background layer (blurred, scaled 110%, 80% opacity)
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.save();
          ctx.filter = "blur(1px)";
          ctx.globalAlpha = 0.8;
          const bgR = bgImg.naturalWidth / bgImg.naturalHeight;
          const canR = W / H;
          let bw, bh;
          if (bgR > canR) {
            bh = H * 1.1;
            bw = bh * bgR;
          } else {
            bw = W * 1.1;
            bh = bw / bgR;
          }
          ctx.drawImage(bgImg, (W - bw) / 2, (H - bh) / 2, bw, bh);
          ctx.restore();
        } else {
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, W, H);
        }

        // Video layer: object-contain → user scale+translate
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const vR = video.videoWidth / video.videoHeight;
          const aW = W - PADDING_X * 2;
          const aH = H - PADDING_Y * 2;
          let vw, vh;
          if (vR > aW / aH) {
            vw = aW;
            vh = aW / vR;
          } else {
            vh = aH;
            vw = aH * vR;
          }

          // Apply user scale + position around canvas centre
          const cx = W / 2 + canvasPosX;
          const cy = H / 2 + canvasPosY;
          const svw = vw * layout.scale;
          const svh = vh * layout.scale;
          const vx = cx - svw / 2;
          const vy = cy - svh / 2;

          ctx.save();
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(vx, vy, svw, svh, 8);
          } else {
            ctx.rect(vx, vy, svw, svh);
          }
          ctx.clip();
          ctx.drawImage(video, vx, vy, svw, svh);
          ctx.restore();
        }

        requestAnimationFrame(renderFrame);
      };

      recorder.start(100);
      await video.play();
      renderFrame();

      // ── 7. Wait for recording then trigger download ───────────────────────
      const resultBlob = await recordingDone;
      const url = URL.createObjectURL(resultBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `frameful-edited-${new Date().toISOString().slice(0, 10)}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Studio header */}
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-6 gap-4 shrink-0">
        <button
          id="back-to-home-btn"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <Typography variant="label" as="span">Back</Typography>
        </button>
        <div className="h-5 w-px bg-border" />
        <Typography variant="label" as="h1" className="text-brand-gradient font-semibold">
          Frameful Studio
        </Typography>
      </header>

      {/* Studio layout — split screen */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video preview */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-muted/20">
          <div className="w-full max-w-4xl">
            {/* Player card */}
            <div className="border border-border bg-card overflow-hidden flex flex-col gap-8">
              <VideoPlayer
                ref={videoPlayerRef}
                videoUrl={videoUrl as string}
                background={background}
              />
            </div>

            {/* Download CTA */}
            <button
              id="download-video-btn"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full mt-4 py-3.5 bg-brand-gradient text-primary-foreground cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download
                className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`}
              />
              <Typography variant="label" as="span">
                {isDownloading ? "Exporting edited video…" : "Download Edited Video"}
              </Typography>
            </button>
            <Typography
              variant="caption"
              className="text-muted-foreground mt-2 text-center block"
            >
              Your recorded screen capture · .webm format
            </Typography>
          </div>
        </div>

        {/* Right: Tools panel */}
        <ToolBar onBackgroundSelect={setBackground} />
      </div>
    </div>
  );
}
