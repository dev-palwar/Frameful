import { useNavigate } from "react-router";
import { ArrowLeft, Loader2, ZoomIn, X } from "lucide-react";
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
  id: string;
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

  const [dismissedExtensionBanner, setDismissedExtensionBanner] =
    useState(false);
  const isRecorded = recordingState === "preview" && blob !== null;

  const [placingZoom, setPlacingZoom] = useState<PlacingZoom | null>(null);

  const handleAddZoom = useCallback(
    (time: number) => {
      const newId = crypto.randomUUID();
      const newEvent: ZoomEvent = {
        id: newId,
        time,
        duration: DEFAULT_ZOOM_DURATION,
        zoomFactor: DEFAULT_ZOOM_FACTOR,
        originX: 0.5,
        originY: 0.5,
        source: "manual",
      };
      setZoomEvents((prev) => [...prev, newEvent]);
      setPlacingZoom({ id: newId, time, originX: 0.5, originY: 0.5 });
    },
    [setZoomEvents],
  );

  const handleSelectZoom = useCallback(
    (id: string | null) => {
      if (id) {
        const event = zoomEvents.find((e) => e.id === id);
        if (event) {
          setPlacingZoom({
            id: event.id,
            time: event.time,
            originX: event.originX,
            originY: event.originY,
          });
        }
      } else {
        setPlacingZoom(null);
      }
    },
    [zoomEvents],
  );

  const handleFocusChange = useCallback(
    (x: number, y: number) => {
      setPlacingZoom((prev) =>
        prev ? { ...prev, originX: x, originY: y } : null,
      );
      setZoomEvents((prev) =>
        prev.map((e) =>
          placingZoom && e.id === placingZoom.id
            ? { ...e, originX: x, originY: y }
            : e,
        ),
      );
    },
    [placingZoom, setZoomEvents],
  );

  const handleConfirmZoom = useCallback(() => {
    setPlacingZoom(null);
  }, []);

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

    const BASE_W = 1280;
    const scaledW = Math.round(BASE_W * preset.widthMultiplier);

    const outputWidth = scaledW % 2 === 0 ? scaledW : scaledW + 1;
    const numericRatio = resolveRatio(designSettings.aspectRatio);
    const outputHeight = numericRatio
      ? Math.round(outputWidth / numericRatio)
      : Math.round((outputWidth * 9) / 16);

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
      {}
      <header className="relative z-50 h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        {}
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

        {}
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

      {}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {}
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
            onSelectZoom={handleSelectZoom}
            placingZoom={placingZoom}
            onFocusChange={handleFocusChange}
            onConfirmZoom={handleConfirmZoom}
          />
        </div>

        {}
        {isRecorded && !extensionInstalled && !dismissedExtensionBanner && (
          <div className="absolute bottom-24 left-6 z-50 pointer-events-none max-w-sm">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
              <ZoomIn className="w-4 h-4 text-amber-500 shrink-0" />
              <Typography
                variant="caption"
                className="text-amber-500/80 flex-1"
              >
                Install the{" "}
                <a
                  href="https://chromewebstore.google.com/detail/cutline-%E2%80%94-auto-zoom/aedjplkmogphloannjfdbomnpnokpdbe?authuser=1&hl=en-GB"
                  target="_blank"
                  className="underline underline-offset-2 pointer-events-auto hover:text-amber-400 transition-colors"
                >
                  Cutline extension
                </a>{" "}
                to enable auto-zoom detection from your clicks.
              </Typography>
              <button
                onClick={() => setDismissedExtensionBanner(true)}
                className="pointer-events-auto p-1 hover:bg-amber-500/10 rounded-md transition-colors text-amber-500/60 hover:text-amber-500 shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {}
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
