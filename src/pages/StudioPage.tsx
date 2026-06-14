import { useNavigate } from "react-router";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useRecorder } from "@/hooks";
import { ToolBar } from "@/components/toolbar";
import { VideoPlayer } from "@/components/video";
import type { VideoPlayerHandle } from "@/components/video";
import { Typography } from "@/design-system";
import { useExport } from "@/export";
import type { DesignSettings, FrameSettings } from "@/components/toolbar/types";
import { resolveRatio } from "@/components/toolbar/tabs/design/widgets/AspectRatioSelect";

export default function StudioPage() {
  const navigate = useNavigate();
  const [background, setBackground] = useState<string>("");
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    style: "default",
    padding: 0,
    opacity: 100,
    borderStyle: "sharp",
    radius: 0,
    scale: 1.0,
    shadow: "none",
    shadowIntensity: 75,
    aspectRatio: "native",
    blur: "none",
    blurAmount: 50,
  });
  const [frameSettings, setFrameSettings] = useState<FrameSettings>({
    osFrame: "none",
    browserFrame: "none",
    buttonControls: "all",
    buttonPosition: "top-left",
  });
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
      scale: 1,
      posX_frac: 0,
      posY_frac: 0,
      paddingX_frac: 0.05,
      paddingY_frac: 0.05,
      videoNativeWidth: 1280,
      videoNativeHeight: 720,
      borderRadius: 0,
      shadow: "none" as const,
    };

    // Derive export canvas size from the chosen aspect ratio
    const BASE_W = 1280;
    const numericRatio = resolveRatio(designSettings.aspectRatio);
    const outputWidth = BASE_W;
    const outputHeight = numericRatio ? Math.round(BASE_W / numericRatio) : 720;

    await exportVideo({
      videoBlob: blob,
      trimStart: videoPlayerRef.current?.trimStart ?? 0,
      trimEnd: videoPlayerRef.current?.trimEnd ?? Infinity,
      backgroundUrl: background || undefined,
      outputWidth,
      outputHeight,
      crf: 22,
      designSettings,
      ...layout,
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Studio header */}
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        {/* Left side */}
        <div className="flex items-center gap-4">
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
        </div>

        {/* Right side: Export */}
        <div className="flex items-center">
          {loadingWasm ? (
            <div className="py-1.5 px-3 border border-border bg-card flex items-center gap-2 rounded-md">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              <Typography variant="label" className="text-muted-foreground">Loading FFmpeg…</Typography>
            </div>
          ) : isExporting ? (
            <div className="py-1.5 px-3 border border-border bg-card rounded-md flex items-center gap-3 w-48">
              <Typography variant="label">Exporting</Typography>
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-gradient transition-all duration-150"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <Typography variant="caption">{Math.round(progress * 100)}%</Typography>
            </div>
          ) : (
            <button
              id="download-video-btn"
              onClick={handleDownload}
              className="py-1.5 px-5 bg-brand-gradient text-primary-foreground cursor-pointer flex items-center gap-2 rounded-md hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              <Typography variant="label" as="span">Export Video</Typography>
            </button>
          )}
        </div>
      </header>

      {/* Studio layout — split screen */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 bg-background min-h-0 min-w-0">
          <div className="w-full max-w-5xl flex flex-col">
            <VideoPlayer
              ref={videoPlayerRef}
              videoUrl={videoUrl as string}
              background={background}
              designSettings={designSettings}
              frameSettings={frameSettings}
            />
          </div>
        </div>

        {/* Right: Tools panel */}
        <ToolBar
          onBackgroundSelect={setBackground}
          designSettings={designSettings}
          setDesignSettings={setDesignSettings}
          frameSettings={frameSettings}
          setFrameSettings={setFrameSettings}
        />
      </div>
    </div>
  );
}
