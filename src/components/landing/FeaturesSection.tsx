import { useEffect, useRef, useState } from "react";
import {
  Monitor,
  Palette,
  Scissors,
  Download,
  Lock,
  ZoomIn,
} from "lucide-react";
import { Typography } from "@/design-system/Typography";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function ScreenCaptureAnimation() {
  return (
    <div className="relative h-48 w-full bg-card/20 rounded-xl flex items-center justify-center overflow-hidden mb-6 border border-border/40 group-hover:border-chart-1/30 transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--chart-1)_0%,transparent_70%)] opacity-5" />
      <div className="relative w-36 h-24 bg-card rounded-lg border border-border shadow-xl flex items-center justify-center">
        <div className="absolute inset-1 border-2 border-dashed border-chart-1/50 rounded animate-[spin_8s_linear_infinite]" />
        <div className="absolute -top-2 -right-2 h-4 w-4 bg-destructive rounded-full animate-pulse border-2 border-background shadow-lg shadow-destructive/20" />
      </div>
      <div
        className="absolute animate-bounce"
        style={{ bottom: "20%", right: "25%", animationDuration: "2s" }}
      >
        <svg width="20" height="24" viewBox="0 0 16 20" fill="none">
          <path
            d="M1 1L1 15L5 11L9 19L12 17.5L8 10L14 10L1 1Z"
            className="fill-foreground stroke-background"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}

function BackgroundsAnimation() {
  return (
    <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6 border border-border/40 group-hover:border-chart-2/30 transition-colors flex bg-card/20 p-4 gap-4">
      {/* LEFT: Video Preview Area */}
      <div className="flex-1 relative rounded-lg border border-border/50 overflow-hidden shadow-inner flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
        {/* Background Layers */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-chart-1/80 to-chart-2/80"
          style={{ animation: "bgFade1 9s infinite" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-chart-3/80 to-chart-4/80"
          style={{ animation: "bgFade2 9s infinite" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-chart-5/80 to-primary/80"
          style={{ animation: "bgFade3 9s infinite" }}
        />

        {/* The "Video" mockup */}
        <div className="relative w-[75%] h-[65%] bg-background/90 backdrop-blur-md rounded border border-border/50 shadow-2xl flex flex-col overflow-hidden">
          <div className="h-3 bg-foreground/5 w-full flex items-center px-2 gap-1.5 border-b border-border/50">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
          </div>
          <div className="flex-1 flex items-center justify-center bg-black/10">
            <div className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center shadow-lg backdrop-blur-md border border-border/20">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-foreground border-b-[5px] border-b-transparent ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Background Swatches */}
      <div className="w-12 shrink-0 flex flex-col gap-3 justify-center">
        {/* Swatch 1 */}
        <div className="relative w-full aspect-square rounded-md bg-gradient-to-br from-chart-1 to-chart-2 shadow-sm border border-border/20">
          <div
            className="absolute -inset-1 border-2 border-chart-2 rounded-lg"
            style={{ animation: "bgFade1 9s infinite" }}
          />
        </div>
        {/* Swatch 2 */}
        <div className="relative w-full aspect-square rounded-md bg-gradient-to-br from-chart-3 to-chart-4 shadow-sm border border-border/20">
          <div
            className="absolute -inset-1 border-2 border-chart-2 rounded-lg"
            style={{ animation: "bgFade2 9s infinite" }}
          />
        </div>
        {/* Swatch 3 */}
        <div className="relative w-full aspect-square rounded-md bg-gradient-to-br from-chart-5 to-primary shadow-sm border border-border/20">
          <div
            className="absolute -inset-1 border-2 border-chart-2 rounded-lg"
            style={{ animation: "bgFade3 9s infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes bgFade1 {
          0%, 28% { opacity: 1; }
          33%, 95% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes bgFade2 {
          0%, 28% { opacity: 0; }
          33%, 61% { opacity: 1; }
          66%, 100% { opacity: 0; }
        }
        @keyframes bgFade3 {
          0%, 61% { opacity: 0; }
          66%, 95% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function PrivateAnimation() {
  return (
    <div className="relative h-48 w-full bg-card/20 rounded-xl flex items-center justify-center overflow-hidden mb-6 border border-border/40 group-hover:border-chart-3/30 transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--chart-3)_0%,transparent_70%)] opacity-5" />
      <div className="relative w-24 h-24 rounded-full border-2 border-chart-3/30 flex items-center justify-center bg-chart-3/5 shadow-[0_0_30px_color-mix(in_srgb,var(--chart-3)_20%,transparent)]">
        <Lock className="w-8 h-8 text-chart-3" />
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-chart-3 rounded-full shadow-[0_0_10px_var(--chart-3)]" />
        </div>
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite_reverse]">
          <div className="absolute bottom-0 right-1/4 -ml-1 w-1.5 h-1.5 bg-chart-2 rounded-full shadow-[0_0_10px_var(--chart-2)]" />
        </div>
      </div>
    </div>
  );
}

function TrimmingAnimation() {
  return (
    <div className="relative h-48 w-full bg-card/20 rounded-xl flex flex-col items-center justify-center overflow-hidden mb-6 border border-border/40 group-hover:border-chart-4/30 transition-colors p-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--chart-4)_0%,transparent_70%)] opacity-5" />

      {/* Container for Video & Timeline */}
      <div className="relative w-full max-w-[220px] flex flex-col gap-2">
        {/* TOP: Video Mockup */}
        <div className="w-full aspect-video bg-background/90 rounded border border-border/50 shadow-lg flex flex-col overflow-hidden">
          {/* Chrome */}
          <div className="h-2.5 bg-foreground/5 w-full flex items-center px-1.5 gap-1 border-b border-border/50">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
          </div>
          {/* Video Content */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black/30">
            {/* Scrubbing visual */}
            <div
              className="absolute w-12 h-12 rounded-lg border-2 border-dashed border-chart-4/60 opacity-60"
              style={{
                animation:
                  "videoScrub 8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
              }}
            />
            <div
              className="w-5 h-5 rounded bg-chart-4 shadow-[0_0_15px_var(--chart-4)]"
              style={{
                animation:
                  "videoScale 8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
              }}
            />
          </div>
        </div>

        {/* BOTTOM: Timeline Mockup */}
        <div className="relative h-8 w-full bg-background rounded-md border border-border/50 shadow-sm flex items-center overflow-hidden">
          {/* Waveform */}
          <div className="absolute inset-x-1 h-5 flex gap-[2px] items-end opacity-20">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-foreground rounded-full"
                style={{
                  height: `${20 + Math.sin(i * 0.5) * 40 + Math.random() * 40}%`,
                }}
              />
            ))}
          </div>

          {/* Unselected overlays */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-background/70 backdrop-blur-[1px] border-r border-chart-4/40 z-10"
            style={{
              animation:
                "trimLeftOverlay 8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          />
          <div className="absolute top-0 bottom-0 right-0 w-[10%] bg-background/70 backdrop-blur-[1px] border-l border-chart-4/40 z-10" />

          {/* Active Highlighted Region */}
          <div
            className="absolute top-0 bottom-0 bg-chart-4/10 border-y-2 border-chart-4/60 z-0"
            style={{
              animation:
                "trimActiveRegion 8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          />

          {/* Left Handle */}
          <div
            className="absolute top-0 bottom-0 w-2 bg-chart-4 border-x border-background/20 rounded-sm z-20 flex items-center justify-center shadow-lg -ml-1"
            style={{
              animation:
                "trimLeftHandle 8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          >
            <div className="w-[1px] h-3 bg-background/60 rounded-full" />
          </div>

          {/* Right Handle */}
          <div className="absolute top-0 bottom-0 w-2 bg-chart-4 border-x border-background/20 rounded-sm z-20 left-[90%] flex items-center justify-center -ml-1">
            <div className="w-[1px] h-3 bg-background/60 rounded-full" />
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-foreground z-30 shadow-[0_0_5px_var(--foreground)] -ml-[0.75px]"
            style={{ animation: "trimPlayhead 8s ease-in-out infinite" }}
          />
        </div>

        {/* Mouse cursor dragging */}
        <div
          className="absolute z-50 drop-shadow-md"
          style={{
            animation:
              "trimCursorMove 8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        >
          <svg width="18" height="22" viewBox="0 0 16 20" fill="none">
            <path
              d="M1 1L1 15L5 11L9 19L12 17.5L8 10L14 10L1 1Z"
              className="fill-foreground stroke-background"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes trimCursorMove {
          0%, 10% { left: 50%; top: 40%; }
          20% { left: 10%; top: 85%; transform: scale(1); }
          25% { left: 10%; top: 85%; transform: scale(0.9); }
          40%, 65% { left: 35%; top: 85%; transform: scale(0.9); }
          70% { left: 35%; top: 85%; transform: scale(1); }
          85%, 100% { left: 50%; top: 40%; transform: scale(1); }
        }
        @keyframes trimLeftHandle {
          0%, 25% { left: 10%; }
          40%, 100% { left: 35%; }
        }
        @keyframes trimLeftOverlay {
          0%, 25% { width: 10%; }
          40%, 100% { width: 35%; }
        }
        @keyframes trimActiveRegion {
          0%, 25% { left: 10%; right: 10%; }
          40%, 100% { left: 35%; right: 10%; }
        }
        @keyframes trimPlayhead {
          0%, 35% { left: 50%; opacity: 0; }
          45% { left: 35%; opacity: 1; }
          70%, 100% { left: 90%; opacity: 1; }
        }
        @keyframes videoScrub {
          0%, 25% { transform: translateX(-30px) rotate(0deg); border-color: color-mix(in srgb, var(--chart-4) 60%, transparent); }
          40%, 100% { transform: translateX(30px) rotate(90deg); border-color: color-mix(in srgb, var(--primary) 60%, transparent); }
        }
        @keyframes videoScale {
          0%, 25% { transform: scale(1); background-color: var(--chart-4); }
          40%, 100% { transform: scale(1.3); background-color: var(--primary); }
        }
      `}</style>
    </div>
  );
}

function AutoZoomAnimation() {
  return (
    <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6 border border-border/40 group-hover:border-chart-5/30 transition-colors flex items-center justify-center bg-card/20 p-4">
      {/* Video Frame */}
      <div className="relative w-full max-w-[240px] aspect-video rounded-lg border border-border/50 shadow-2xl overflow-hidden flex flex-col bg-black/40">
        {/* The video background (this represents the "background already applied" to the canvas) */}
        {/* We place it INSIDE the zoom layer so the background zooms too,
            which accurately mimics zooming into a framed video! */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            animation: "autoZoom 7s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        >
          {/* Background applied to video */}
          <div className="absolute inset-0 bg-gradient-to-br from-chart-4/30 to-chart-5/30" />

          {/* Fake Window inside the video (the actual screen recording) */}
          <div className="absolute inset-3 bg-background/95 rounded border border-border/50 shadow-lg flex flex-col overflow-hidden">
            {/* Window Chrome */}
            <div className="h-3 bg-foreground/5 w-full flex items-center px-1.5 gap-1 border-b border-border/50">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
            </div>
            {/* Content */}
            <div className="flex-1 p-2 flex flex-col gap-1.5 relative">
              <div className="w-16 h-1 bg-foreground/10 rounded-full" />
              <div className="w-10 h-1 bg-foreground/10 rounded-full" />

              {/* Button to click */}
              <div className="absolute bottom-1 right-1 w-10 h-3.5 bg-chart-5/20 border border-chart-5/30 rounded flex items-center justify-center">
                <div className="w-4 h-0.5 bg-chart-5/60 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Cursor & Effects Layer (outside zoom layer so they don't scale) */}

        {/* Zoom Ring pinging on click */}
        <div
          className="absolute w-6 h-6 rounded-full border-2 border-chart-5/60 pointer-events-none -ml-3 -mt-3"
          style={{
            top: "76%",
            left: "85%",
            animation: "zoomRing 7s ease-out infinite",
          }}
        />

        {/* Mouse cursor */}
        <div
          className="absolute z-20 drop-shadow-md pointer-events-none"
          style={{
            animation: "cursorMove 7s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        >
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path
              d="M1 1L1 15L5 11L9 19L12 17.5L8 10L14 10L1 1Z"
              className="fill-foreground stroke-background"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes cursorMove {
          0%, 15% { left: 20%; top: 30%; }
          25%, 75% { left: 85%; top: 76%; }
          85%, 100% { left: 20%; top: 30%; }
        }
        @keyframes autoZoom {
          0%, 30% { transform: scale(1); transform-origin: 85% 76%; }
          35%, 70% { transform: scale(2.2); transform-origin: 85% 76%; }
          75%, 100% { transform: scale(1); transform-origin: 85% 76%; }
        }
        @keyframes zoomRing {
          0%, 25% { opacity: 0; transform: scale(0.5); }
          28% { opacity: 1; transform: scale(1.2); }
          33%, 100% { opacity: 0; transform: scale(2); }
        }
      `}</style>
    </div>
  );
}

function ExportAnimation() {
  return (
    <div className="relative h-48 w-full bg-card/20 rounded-xl flex flex-col items-center justify-center overflow-hidden mb-6 border border-border/40 group-hover:border-primary/30 transition-colors gap-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-5" />
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_20%,transparent)]">
        <Download className="w-6 h-6 animate-bounce" />
      </div>
      <div className="w-40 h-1.5 rounded-full bg-foreground/10 overflow-hidden relative">
        <div
          className="absolute top-0 left-0 bottom-0 bg-primary"
          style={{
            animation: "shimmer 2s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

const features = [
  {
    icon: Monitor,
    title: "Screen Capture",
    description:
      "Record your full screen, a window, or a browser tab in crystal-clear HD with no time limit.",
    iconColor: "var(--chart-1)",
    Animation: ScreenCaptureAnimation,
    span: "",
  },
  {
    icon: Palette,
    title: "Beautiful Backgrounds",
    description:
      "Choose from a curated gallery of gradients and patterns, or upload your own.",
    iconColor: "var(--chart-2)",
    Animation: BackgroundsAnimation,
    span: "",
  },
  {
    icon: Lock,
    title: "Fully Private",
    description:
      "Everything runs locally in your browser. No data leaves your device, ever.",
    iconColor: "var(--chart-3)",
    Animation: PrivateAnimation,
    span: "",
  },
  {
    icon: Scissors,
    title: "Timeline Trimming",
    description:
      "Cut and trim your recording with a precise timeline editor. Keep only what matters.",
    iconColor: "var(--chart-4)",
    Animation: TrimmingAnimation,
    span: "",
  },
  {
    icon: ZoomIn,
    title: "Auto-Zoom",
    description:
      "Automatically zoom into key actions and clicks, highlighting exactly what viewers need to see.",
    iconColor: "var(--chart-5)",
    Animation: AutoZoomAnimation,
    span: "",
  },
  {
    icon: Download,
    title: "Instant Export",
    description:
      "Hit download and your edited video renders locally in WebM — ready to share.",
    iconColor: "var(--primary)",
    Animation: ExportAnimation,
    span: "",
  },
];

export default function FeaturesSection() {
  const { ref, inView } = useInView();

  return (
    <section className="relative py-24 md:py-36 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[150px] opacity-8"
          style={{
            background: "radial-gradient(circle, var(--primary), transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-4 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Typography variant="overline" className="text-primary">
              Features
            </Typography>
          </div>
          <Typography
            variant="h2"
            as="h2"
            className={`text-foreground transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Everything you need.{" "}
            <span className="text-brand-gradient">Nothing you don't.</span>
          </Typography>
          <Typography
            variant="body"
            className={`mt-4 text-muted-foreground transition-all duration-700 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            A focused set of tools to create beautiful screen recordings — right
            in your browser.
          </Typography>
        </div>

        {/* Bento grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm
                transition-all duration-500 hover:border-primary/15 hover:bg-card/70
                hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${feature.span} ${
                  inView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              {/* Animation Component */}
              <feature.Animation />

              {/* Content */}
              <div className="relative z-10 flex items-start gap-4">
                {/* Icon */}
                <div
                  className="mt-1 shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${feature.iconColor} 12%, transparent)`,
                    color: feature.iconColor,
                  }}
                >
                  <feature.icon className="h-5 w-5" />
                </div>

                <div>
                  <Typography
                    variant="h4"
                    as="h3"
                    className="text-foreground font-bold"
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="mt-1.5 text-muted-foreground"
                  >
                    {feature.description}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
