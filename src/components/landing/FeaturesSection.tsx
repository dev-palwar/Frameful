import { useEffect, useRef, useState } from "react";
import {
  Monitor,
  Palette,
  Scissors,
  Download,
  Lock,
  Cpu,
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
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const features = [
  {
    icon: Monitor,
    title: "Screen Capture",
    description: "Record your full screen, a window, or a browser tab in crystal-clear HD with no time limit.",
    gradient: "from-chart-1/10 to-chart-2/10",
    iconColor: "var(--chart-1)",
    span: "md:col-span-2",
  },
  {
    icon: Palette,
    title: "Beautiful Backgrounds",
    description: "Choose from a curated gallery of gradients and patterns, or upload your own background.",
    gradient: "from-chart-2/10 to-chart-3/10",
    iconColor: "var(--chart-2)",
    span: "",
  },
  {
    icon: Lock,
    title: "Fully Private",
    description: "Everything runs in your browser. No uploads, no servers, no data leaves your device.",
    gradient: "from-chart-3/10 to-chart-4/10",
    iconColor: "var(--chart-3)",
    span: "",
  },
  {
    icon: Scissors,
    title: "Timeline Trimming",
    description: "Cut and trim your recording with a precise timeline editor. Keep only what matters.",
    gradient: "from-chart-4/10 to-chart-5/10",
    iconColor: "var(--chart-4)",
    span: "md:col-span-2",
  },
  {
    icon: Cpu,
    title: "Browser-Native",
    description: "No installs, no extensions needed. Works on Chrome, Edge, Brave, and Firefox.",
    gradient: "from-chart-5/10 to-primary/10",
    iconColor: "var(--chart-5)",
    span: "",
  },
  {
    icon: Download,
    title: "Instant Export",
    description: "Hit download and your edited video renders locally in WebM — fast and ready to share.",
    gradient: "from-primary/10 to-chart-1/10",
    iconColor: "var(--primary)",
    span: "md:col-span-2",
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
          style={{ background: "radial-gradient(circle, var(--primary), transparent)" }}
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
            A focused set of tools to create beautiful screen recordings — right in your browser.
          </Typography>
        </div>

        {/* Bento grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-border/50 bg-card/40 p-8 backdrop-blur-sm
                transition-all duration-500 hover:border-primary/15 hover:bg-card/70
                hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${feature.span} ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `color-mix(in srgb, ${feature.iconColor} 12%, transparent)`, color: feature.iconColor }}
                >
                  <feature.icon className="h-6 w-6" />
                </div>

                <Typography variant="h3" as="h3" className="text-foreground font-bold">
                  {feature.title}
                </Typography>
                <Typography variant="body-sm" className="mt-2 text-muted-foreground">
                  {feature.description}
                </Typography>
              </div>

              {/* Corner decoration */}
              <div
                className="absolute -top-px -right-px h-16 w-16 rounded-bl-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(225deg, color-mix(in srgb, ${feature.iconColor} 15%, transparent) 0%, transparent 60%)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
