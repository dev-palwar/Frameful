import { useEffect, useRef, useState, useCallback } from "react";
import { Typography } from "@/design-system/Typography";
import {
  Monitor,
  Palette,
  Download,
  Puzzle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── InView hook ──────────────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Step data ────────────────────────────────────────────────────────────── */
interface WorkflowStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: string;        // HSL main accent
  accentMuted: string;   // lower-opacity tint for backgrounds
}

const STEPS: WorkflowStep[] = [
  {
    number: "01",
    title: "Install",
    tagline: "add to browser",
    description:
      "Install the Frameful extension in one click. No sign-up required, works on all major browsers seamlessly.",
    icon: Puzzle,
    accent: "var(--chart-1)",
    accentMuted: "color-mix(in srgb, var(--chart-1) 10%, transparent)",
  },
  {
    number: "02",
    title: "Record or Upload",
    tagline: "start capturing",
    description:
      "Hit record and choose a screen, window, or browser tab. Or simply upload an existing video to begin.",
    icon: Monitor,
    accent: "var(--chart-2)",
    accentMuted: "color-mix(in srgb, var(--chart-2) 10%, transparent)",
  },
  {
    number: "03",
    title: "Edit in Browser",
    tagline: "style, frame, zoom, trim",
    description:
      "Wrap it in an OS window, add gorgeous backgrounds, auto-zoom on clicks, and trim the boring parts — all instantly.",
    icon: Palette,
    accent: "var(--chart-3)",
    accentMuted: "color-mix(in srgb, var(--chart-3) 10%, transparent)",
  },
  {
    number: "04",
    title: "Export",
    tagline: "multiple qualities",
    description:
      "Your polished video renders locally with FFmpeg in-browser. Download in 1080p, 4K, or GIF formats in seconds.",
    icon: Download,
    accent: "var(--primary)",
    accentMuted: "color-mix(in srgb, var(--primary) 10%, transparent)",
  },
];

/* ─── Animated illustrations for the preview area ──────────────────────────── */

function InstallScene() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full gap-4">
      {/* Extension popup mockup */}
      <div className="relative w-56 rounded-lg overflow-hidden border border-border shadow-2xl bg-card">
        {/* Header */}
        <div className="flex items-center gap-2 bg-foreground/5 px-3 py-2 border-b border-border">
          <Puzzle className="h-3.5 w-3.5 text-primary" />
          <div className="h-2 w-20 rounded bg-foreground/10" />
        </div>
        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Puzzle className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-2 w-full rounded-full bg-foreground/10" />
              <div className="h-2 w-3/4 rounded-full bg-foreground/10" />
            </div>
          </div>
          <div className="h-8 mt-2 w-full rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
            <div className="h-2 w-16 rounded bg-primary/60" />
          </div>
        </div>
      </div>
      {/* Floating particles for installation */}
      <div
        className="absolute -right-4 top-1/4 h-3 w-3 rounded-full bg-chart-2/40 animate-ping"
        style={{ animationDuration: "2s" }}
      />
      <div
        className="absolute -left-2 bottom-1/3 h-2 w-2 rounded-full bg-chart-1/50 animate-bounce"
        style={{ animationDuration: "1.5s" }}
      />
    </div>
  );
}

function RecordScene() {
  return (
    <div className="relative flex items-center justify-center h-full w-full">
      {/* Screen outline */}
      <div className="relative w-52 h-36 rounded-lg border-2 border-border/50 bg-foreground/5">
        {/* Screen content - fake UI */}
        <div className="absolute inset-3 flex flex-col gap-2">
          <div className="h-2 w-16 rounded-full bg-foreground/10" />
          <div className="h-2 w-24 rounded-full bg-foreground/5" />
          <div className="flex gap-2 mt-1">
            <div className="h-12 w-12 rounded bg-foreground/5" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-2 w-full rounded-full bg-foreground/5" />
              <div className="h-2 w-3/4 rounded-full bg-foreground/5" />
            </div>
          </div>
        </div>
        {/* Red record dot */}
        <div className="absolute -top-2 -right-2 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
          </div>
        </div>
        {/* Selection border animation */}
        <div
          className="absolute -inset-1 rounded-xl border-2 border-dashed animate-spin"
          style={{ borderColor: "color-mix(in srgb, var(--chart-1) 30%, transparent)", animationDuration: "8s" }}
        />
      </div>
      {/* Cursor */}
      <div
        className="absolute animate-pulse"
        style={{ bottom: "28%", right: "30%", animationDuration: "2s" }}
      >
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <path d="M1 1L1 15L5 11L9 19L12 17.5L8 10L14 10L1 1Z" className="fill-foreground/50 stroke-foreground/30" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}

function EditScene() {
  const swatches = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  ];
  return (
    <div className="relative flex items-center justify-center h-full w-full">
      {/* Video frame in centre */}
      <div className="relative w-40 h-24 rounded-lg bg-foreground/5 border border-border shadow-2xl flex items-center justify-center overflow-hidden">
        <div className="absolute inset-2 rounded bg-gradient-to-br from-foreground/10 to-transparent" />
        
        {/* Fake timeline at bottom */}
        <div className="absolute bottom-2 inset-x-3 h-1.5 rounded-full bg-foreground/10">
          <div className="absolute left-1/4 right-1/4 h-full rounded-full bg-primary/40" />
        </div>
      </div>
      {/* Swatches orbiting */}
      <div className="absolute inset-0 flex items-center justify-center">
        {swatches.map((bg, i) => {
          const angle = (360 / swatches.length) * i;
          const radius = 85;
          return (
            <div
              key={i}
              className="absolute h-7 w-7 rounded-lg transition-all duration-1000 hover:scale-125"
              style={{
                background: bg,
                transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
                opacity: 0.7,
                animation: `orbit 12s linear infinite`,
                animationDelay: `${-i * 2}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}



function ExportScene() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full gap-4">
      {/* File icon */}
      <div className="relative">
        <div className="w-14 h-18 rounded-lg bg-foreground/5 border border-border flex items-center justify-center">
          <div className="text-[10px] font-mono font-bold text-muted-foreground tracking-wide">.webm</div>
        </div>
        {/* Corner fold */}
        <div
          className="absolute -top-px -right-px w-4 h-4"
          style={{
            background: "linear-gradient(135deg, transparent 50%, color-mix(in srgb, var(--primary) 20%, transparent) 50%)",
            borderRadius: "0 6px 0 4px",
          }}
        />
        {/* Checkmark */}
        <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-28">
        <div className="h-1 w-full rounded-full bg-foreground/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, color-mix(in srgb, var(--primary) 60%, transparent), color-mix(in srgb, var(--primary) 30%, transparent))",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        </div>
        <p className="text-[9px] text-muted-foreground text-center mt-1 font-mono">rendered locally</p>
      </div>
    </div>
  );
}

const SCENES = [InstallScene, RecordScene, EditScene, ExportScene];

/* ─── Progress ring (SVG) ──────────────────────────────────────────────────── */
function ProgressRing({ progress, accent }: { progress: number; accent: string }) {
  const r = 11;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="shrink-0 -rotate-90">
      <circle cx="14" cy="14" r={r} fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/10" />
      <circle
        cx="14"
        cy="14"
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        className="transition-all duration-100 ease-linear"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

const CYCLE_MS = 5000;

export default function HowItWorksSection() {
  const { ref: sectionRef, inView } = useInView(0.1);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());

  // Auto-cycle through steps
  const tick = useCallback(() => {
    if (paused) return;
    const elapsed = Date.now() - startRef.current;
    const p = Math.min(elapsed / CYCLE_MS, 1);
    setProgress(p);
    if (p >= 1) {
      setActive((prev) => (prev + 1) % STEPS.length);
      startRef.current = Date.now();
      setProgress(0);
    }
  }, [paused]);

  useEffect(() => {
    if (!inView) return;
    intervalRef.current = setInterval(tick, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [inView, tick]);

  // Manual step selection
  const selectStep = (i: number) => {
    setActive(i);
    setProgress(0);
    startRef.current = Date.now();
  };

  const ActiveScene = SCENES[active];
  const step = STEPS[active];

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-36 overflow-hidden"
      ref={sectionRef}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full blur-[180px] opacity-[0.06] transition-colors duration-1000"
          style={{ background: step.accent }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-5">
            <Typography variant="overline" className="text-primary">
              How it works
            </Typography>
          </div>
          <Typography
            variant="h2"
            as="h2"
            className="text-foreground"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Four steps.{" "}
            <span className="text-muted-foreground">Zero learning curve.</span>
          </Typography>
        </div>

        {/* ── Main layout: preview + step list ─────────────────────────────── */}
        <div
          className={`grid gap-8 lg:grid-cols-[1fr_380px] items-start transition-all duration-700 delay-200 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* ── Left: Interactive Preview ──────────────────────────────────── */}
          <div
            className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at 30% 40%, color-mix(in srgb, ${step.accent} 6%, transparent), transparent 70%), var(--card)`,
              border: `1px solid color-mix(in srgb, ${step.accent} 12%, transparent)`,
              transition: "background 0.8s ease, border-color 0.8s ease",
            }}
          >
            {/* Grid dots */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Scene content */}
            <div className="relative z-10 h-full w-full">
              <ActiveScene />
            </div>

            {/* Bottom label bar */}
            <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-5 py-3 bg-gradient-to-t from-background/80 to-transparent">
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-mono font-bold tracking-widest"
                  style={{ color: step.accent }}
                >
                  {step.number}
                </span>
                <span className="text-[12px] font-semibold text-foreground/80">
                  {step.title}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {step.tagline}
              </span>
            </div>

            {/* Edge glow */}
            <div
              className="absolute top-0 left-0 w-full h-px transition-colors duration-800"
              style={{ background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${step.accent} 30%, transparent), transparent)` }}
            />
          </div>

          {/* ── Right: Step List ───────────────────────────────────────────── */}
          <div
            className="flex flex-col gap-1"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => {
              setPaused(false);
              startRef.current = Date.now() - progress * CYCLE_MS;
            }}
          >
            {STEPS.map((s, i) => {
              const isActive = i === active;
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => selectStep(i)}
                  className={`group relative w-full text-left rounded-xl px-4 py-3.5 transition-all duration-300 cursor-pointer outline-none
                    ${isActive
                      ? "bg-card/70 border border-border/60"
                      : "bg-transparent border border-transparent hover:bg-card/30 hover:border-border/30"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Progress ring / step indicator */}
                    <div className="mt-0.5">
                      {isActive ? (
                        <ProgressRing progress={progress} accent={s.accent} />
                      ) : (
                        <div className="h-7 w-7 rounded-full border border-border flex items-center justify-center">
                          <span className="text-[10px] font-mono text-muted-foreground/60">
                            {s.number}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-3.5 w-3.5 transition-colors duration-300 shrink-0 ${
                            isActive ? "" : "text-muted-foreground/50"
                          }`}
                          style={isActive ? { color: s.accent } : undefined}
                        />
                        <Typography
                          variant="body-sm"
                          className={`font-semibold transition-colors duration-300 ${
                            isActive ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {s.title}
                        </Typography>
                        <span
                          className={`text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                            isActive ? "text-muted-foreground/70" : "text-muted-foreground/30"
                          }`}
                        >
                          {s.tagline}
                        </span>
                      </div>

                      {/* Description - only visible on active */}
                      <div
                        className="overflow-hidden transition-all duration-400 ease-out"
                        style={{
                          maxHeight: isActive ? "80px" : "0px",
                          opacity: isActive ? 1 : 0,
                          marginTop: isActive ? "6px" : "0px",
                        }}
                      >
                        <Typography variant="caption" className="text-muted-foreground leading-relaxed">
                          {s.description}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Active indicator bar on the left */}
                  <div
                    className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? s.accent : "transparent",
                      opacity: isActive ? 0.8 : 0,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
