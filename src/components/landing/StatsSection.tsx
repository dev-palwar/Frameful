import { useEffect, useRef, useState } from "react";
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

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 100, suffix: "%", label: "Private & Local" },
  { value: 0, suffix: "", label: "Sign-ups Required", displayValue: "Zero" },
  { value: 0, suffix: "", label: "Data Uploaded", displayValue: "None" },
  { value: 60, suffix: "fps", label: "Recording Quality" },
];

export default function StatsSection() {
  const { ref, inView } = useInView();

  return (
    <section className="relative py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-1">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--primary) 5%, transparent), transparent, color-mix(in srgb, var(--chart-4) 5%, transparent))" }} />

          <div className="relative grid grid-cols-2 gap-1 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`relative flex flex-col items-center justify-center rounded-xl py-10 px-4 text-center
                  transition-all duration-700 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Typography
                  variant="display"
                  className="text-foreground font-extrabold"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.1 }}
                >
                  {stat.displayValue ? (
                    stat.displayValue
                  ) : (
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      inView={inView}
                    />
                  )}
                </Typography>
                <Typography variant="caption" className="mt-2 text-muted-foreground">
                  {stat.label}
                </Typography>

                {/* Divider — only between items, not after last */}
                {i < stats.length - 1 && (
                  <div className="absolute right-0 top-1/4 bottom-1/4 hidden w-px bg-border/50 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
