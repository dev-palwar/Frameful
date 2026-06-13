import { useNavigate } from "react-router";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useRecorder } from "@/hooks";
import { ToolBar } from "@/components/toolbar";
import { VideoPlayer } from "@/components/video";
import type { VideoPlayerHandle } from "@/components/video";
import { Typography } from "@/design-system";
import { useExport } from "@/export";

export default function StudioPage() {
  const navigate       = useNavigate();
  const [background, setBackground] = useState<string>("");
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);

  const { videoUrl, blob, discardRecording } = useRecorder();
  const { exportVideo, isExporting, loadingWasm, progress } = useExport();

  const handleGoBack = () => {
    discardRecording();
    navigate("/");
  };

  const handleDownload = async () => {
    if (!videoUrl || !blob) return;

    const layout = videoPlayerRef.current?.getExportLayout() ?? {
      scale: 1, posX_frac: 0, posY_frac: 0,
      paddingX_frac: 0.05, paddingY_frac: 0.05,
      videoNativeWidth: 1280, videoNativeHeight: 720,
      borderRadius: 0, shadow: "none" as const,
    };

    await exportVideo({
      videoBlob:     blob,
      trimStart:     videoPlayerRef.current?.trimStart ?? 0,
      trimEnd:       videoPlayerRef.current?.trimEnd   ?? Infinity,
      backgroundUrl: background || undefined,
      outputWidth:   1280,
      outputHeight:  720,
      crf:           22,
      ...layout,
    });
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

            {/* Export CTA — three states */}
            {loadingWasm ? (
              <div className="w-full mt-4 py-3.5 border border-border bg-card flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <Typography variant="label" className="text-muted-foreground">
                  Loading FFmpeg…
                </Typography>
              </div>
            ) : isExporting ? (
              <div className="w-full mt-4 p-4 border border-border bg-card space-y-2">
                <div className="flex justify-between">
                  <Typography variant="label">Exporting…</Typography>
                  <Typography variant="label">{Math.round(progress * 100)}%</Typography>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-gradient transition-all duration-150"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                id="download-video-btn"
                onClick={handleDownload}
                className="w-full mt-4 py-3.5 bg-brand-gradient text-primary-foreground cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <Typography variant="label" as="span">Download Edited Video</Typography>
              </button>
            )}

            <Typography variant="caption" className="text-muted-foreground mt-2 text-center block">
              Your recorded screen capture · .mp4 format
            </Typography>
          </div>
        </div>

        {/* Right: Tools panel */}
        <ToolBar onBackgroundSelect={setBackground} />
      </div>
    </div>
  );
}
