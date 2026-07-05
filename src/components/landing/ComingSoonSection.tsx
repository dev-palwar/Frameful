import { useEffect, useRef, useState } from "react";
import { COMING_SOON_CONFIG } from "@/configs/landing.config";
import { Typography } from "@/design-system/Typography";
import { Sparkles, Code, MousePointerClick } from "lucide-react";

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

const ITEM_ICONS = [Sparkles, MousePointerClick, Code];

export default function ComingSoonSection() {
  const { sectionLabel, headline, subtext, items, statusColors } =
    COMING_SOON_CONFIG;
  const { ref, inView } = useInView();

  return (
    <section className="relative py-24 md:py-36 overflow-hidden" ref={ref}>
      {}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full blur-[150px] opacity-8"
          style={{ background: "radial-gradient(circle, var(--chart-2), transparent)" }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {}
        <div className="mx-auto max-w-2xl text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-4 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Typography variant="overline" className="text-primary">
              {sectionLabel}
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
            {headline}
          </Typography>
          <Typography
            variant="body"
            className={`mt-4 text-muted-foreground transition-all duration-700 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {subtext}
          </Typography>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => {
            const { bg, text } = statusColors[item.status];
            const Icon = ITEM_ICONS[i];

            return (
              <div
                key={i}
                className={`group relative rounded-2xl border border-dashed border-border/60 bg-card/30 p-7 backdrop-blur-sm
                  transition-all duration-500 hover:border-solid hover:border-primary/15 hover:bg-card/60
                  hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${400 + i * 150}ms` }}
              >
                {}
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary/60 transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                {}
                <div
                  className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background: bg, color: text }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: text }}
                  />
                  <Typography variant="overline" style={{ color: text } as React.CSSProperties}>
                    {item.status}
                  </Typography>
                </div>

                <Typography variant="h3" as="h3" className="text-foreground font-bold">
                  {item.title}
                </Typography>
                <Typography
                  variant="body-sm"
                  className="mt-2 text-muted-foreground"
                >
                  {item.description}
                </Typography>

                {}
                <div className="absolute top-0 right-0 h-12 w-px bg-gradient-to-b from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute top-0 right-0 h-px w-12 bg-gradient-to-l from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
