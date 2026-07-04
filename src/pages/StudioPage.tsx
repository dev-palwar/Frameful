import { useNavigate } from "react-router";
import { ArrowLeft, Loader2, ZoomIn } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { useRecorder } from "@/hooks";
import { ToolBar } from "@/components/toolbar";
import { VideoPlayer } from "@/components/video";
import type { VideoPlayerHandle } from "@/components/video";
import { Typography } from "@/design-system";
import { useExport } from "@/export";
import type { DesignSettings, FrameSettings } from "@/components/toolbar/types";
import { resolveRatio } from "@/components/toolbar/tabs/design/widgets/AspectRatioSelect";
import type { ZoomEvent } from "@/lib/zoom";
import { DEFAULT_ZOOM_DURATION, DEFAULT_ZOOM_FACTOR } from "@/lib/zoom";
import { ExportDropdown } from "@/components/shared/ExportDropdown";
import type { ExportPreset } from "@/components/shared/ExportDropdown";

interface PlacingZoom {
  time: number;
  originX: number;
  originY: number;
}

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
    theme: "dark",
    buttonControls: "all",
    buttonPosition: "top-left",
    url: "Cutline.com",
  });
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);

  const {
    videoUrl,
    blob,
    discardRecording,
    recordingState,
    zoomEvents,
    setZoomEvents,
    extensionInstalled,
  } = useRecorder();
  const { exportVideo, isExporting, loadingWasm, progress } = useExport();

  // Whether this is a recorded video (not uploaded) — determines if we show extension banner
  const isRecorded = recordingState === "preview" && blob !== null;

  // ── Zoom placement mode ─────────────────────────────────────────────────
  const [placingZoom, setPlacingZoom] = useState<PlacingZoom | null>(null);

  // Enter placement mode — picker appears on the video
  const handleAddZoom = useCallback((time: number) => {
    setPlacingZoom({ time, originX: 0.5, originY: 0.5 });
  }, []);

  // Live update as user drags the focus indicator
  const handleFocusChange = useCallback((x: number, y: number) => {
    setPlacingZoom((prev) =>
      prev ? { ...prev, originX: x, originY: y } : null,
    );
  }, []);

  // Confirm: create the ZoomEvent and exit placement mode
  const handleConfirmZoom = useCallback(() => {
    if (!placingZoom) return;
    const newEvent: ZoomEvent = {
      id: crypto.randomUUID(),
      time: placingZoom.time,
      duration: DEFAULT_ZOOM_DURATION,
      zoomFactor: DEFAULT_ZOOM_FACTOR,
      originX: placingZoom.originX,
      originY: placingZoom.originY,
      source: "manual",
    };
    setZoomEvents([...zoomEvents, newEvent]);
    setPlacingZoom(null);
  }, [placingZoom, zoomEvents, setZoomEvents]);

  // Cancel placement without creating a zoom
  const handleCancelZoom = useCallback(() => setPlacingZoom(null), []);

  const handleDeleteZoom = useCallback(
    (id: string) => {
      setZoomEvents(zoomEvents.filter((e) => e.id !== id));
    },
    [zoomEvents, setZoomEvents],
  );

  const handleUpdateZoomTime = useCallback(
    (id: string, time: number) => {
      setZoomEvents(zoomEvents.map((e) => (e.id === id ? { ...e, time } : e)));
    },
    [zoomEvents, setZoomEvents],
  );

  const handleGoBack = () => {
    discardRecording();
    navigate("/");
  };

  const handleDownload = async (preset: ExportPreset) => {
    if (!videoUrl || !blob) return;

    // Raw: just download the original blob directly, no processing
    if (preset.isRaw) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Cutline-raw-${new Date().toISOString().slice(0, 10)}.webm`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return;
    }

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

    // Derive export canvas size from the chosen aspect ratio + quality multiplier
    const BASE_W = 1280;
    const scaledW = Math.round(BASE_W * preset.widthMultiplier);
    // Make width even (H.264 requirement)
    const outputWidth = scaledW % 2 === 0 ? scaledW : scaledW + 1;
    const numericRatio = resolveRatio(designSettings.aspectRatio);
    const outputHeight = numericRatio
      ? Math.round(outputWidth / numericRatio)
      : Math.round((outputWidth * 9) / 16);
    // Make height even too
    const finalHeight =
      outputHeight % 2 === 0 ? outputHeight : outputHeight + 1;

    await exportVideo({
      videoBlob: blob,
      trimStart: videoPlayerRef.current?.trimStart ?? 0,
      trimEnd: videoPlayerRef.current?.trimEnd ?? Infinity,
      backgroundUrl: background || undefined,
      outputWidth,
      outputHeight: finalHeight,
      crf: preset.crf,
      designSettings,
      zoomEvents,
      ...layout,
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Studio header */}
      <header className="relative z-50 h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            id="back-to-home-btn"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <Typography variant="label" as="span">
              Back
            </Typography>
          </button>
          <div className="h-5 w-px bg-border" />
          <Typography
            variant="label"
            as="h1"
            className="text-brand-gradient font-semibold"
          >
            Cutline Studio
          </Typography>
        </div>

        {/* Right side: Export */}
        <div className="flex items-center">
          {loadingWasm ? (
            <div className="py-1.5 px-3 border border-border bg-card flex items-center gap-2 rounded-md">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              <Typography variant="label" className="text-muted-foreground">
                Loading FFmpeg…
              </Typography>
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
              <Typography variant="caption">
                {Math.round(progress * 100)}%
              </Typography>
            </div>
          ) : (
            <ExportDropdown
              onExport={handleDownload}
              disabled={!videoUrl || !blob}
            />
          )}
        </div>
      </header>

      {/* Studio layout — split screen */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Video preview */}
        <div className="flex-1 flex flex-col bg-background min-h-0 min-w-0">
          <VideoPlayer
            ref={videoPlayerRef}
            videoUrl={videoUrl as string}
            background={background}
            designSettings={designSettings}
            frameSettings={frameSettings}
            zoomEvents={zoomEvents}
            onAddZoom={handleAddZoom}
            onDeleteZoom={handleDeleteZoom}
            onUpdateZoomTime={handleUpdateZoomTime}
            placingZoom={placingZoom}
            onFocusChange={handleFocusChange}
            onConfirmZoom={handleConfirmZoom}
            onCancelZoom={handleCancelZoom}
          />
        </div>

        {/* Extension install banner — only for recorded videos without extension */}
        {isRecorded && !extensionInstalled && (
          <div className="absolute bottom-24 left-6 z-50 pointer-events-none max-w-sm">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
              <ZoomIn className="w-4 h-4 text-amber-500 shrink-0" />
              <Typography variant="caption" className="text-amber-500/80">
                Install the{" "}
                <a
                  href="https://github.com/dev-palwar/Cutline"
                  className="underline underline-offset-2 pointer-events-auto hover:text-amber-400 transition-colors"
                >
                  Cutline extension
                </a>{" "}
                to enable auto-zoom detection from your clicks.
              </Typography>
            </div>
          </div>
        )}

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
