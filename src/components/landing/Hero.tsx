import { ArrowRight, Play, Sparkles, Shield, Zap } from "lucide-react";
import demoVideo from "@/assets/display/frameful-edited-2026-02-22(1).webm";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { HERO_CONFIG } from "@/configs/landing.config";
import { Typography } from "@/design-system/Typography";

function GradientMeshBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {}
      <div
        className="absolute -top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full blur-[120px] opacity-30 animate-mesh-float"
        style={{
          background:
            "radial-gradient(circle, var(--chart-1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -top-1/3 -right-1/4 h-[600px] w-[600px] rounded-full blur-[100px] opacity-20 animate-mesh-float"
        style={{
          background:
            "radial-gradient(circle, var(--chart-4) 0%, transparent 70%)",
          animationDelay: "-5s",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-15 animate-mesh-rotate"
        style={{
          background:
            "radial-gradient(circle, var(--chart-2) 0%, transparent 70%)",
        }}
      />

      {}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(color-mix(in srgb, var(--primary) 30%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--primary) 30%, transparent) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/40 animate-float-particle"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + i}s`,
          }}
        />
      ))}

      {}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

function TrustBar() {
  const items = [
    { icon: Shield, text: "100% Private" },
    { icon: Zap, text: "No uploads" },
  ];

  return (
    <div className="animate-text-reveal delay-700 flex items-center justify-center gap-6 sm:gap-8 mt-8">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <item.icon className="h-3.5 w-3.5 text-primary/70" />
          <Typography variant="caption">{item.text}</Typography>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const cfg = HERO_CONFIG;

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      <GradientMeshBg />

      <div className="mx-auto max-w-5xl px-6 text-center">
        {}
        <div className="animate-text-reveal mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 backdrop-blur-sm">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </div>
          <Typography variant="label" className="text-primary font-semibold">
            {cfg.badge}
          </Typography>
        </div>

        {}
        <Typography
          variant="display"
          as="h1"
          className="animate-text-reveal delay-100"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
          }}
        >
          {cfg.headlineStatic}
          <br />
          <span className="text-brand-gradient">{cfg.headlineGradient}</span>
        </Typography>

        {}
        <Typography
          variant="body"
          className="animate-text-reveal delay-300 mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed"
          style={{ fontSize: "1.125rem" }}
        >
          {cfg.subtext}
        </Typography>

        {}
        <div className="animate-text-reveal delay-500 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to={"/record"}>
            <Button
              id="hero-record-btn"
              size="lg"
              className="gap-2.5 px-8 py-6 text-[0.95rem] font-semibold rounded-xl shadow-lg transition-all duration-300"
              style={{
                boxShadow:
                  "0 0 30px color-mix(in srgb, var(--primary) 25%, transparent)",
              }}
              onClick={() => navigate("/record")}
            >
              {cfg.primaryCtaLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            id="hero-how-btn"
            variant="outline"
            size="lg"
            className="gap-2.5 px-8 py-6 text-[0.95rem] rounded-xl backdrop-blur-sm"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Play className="h-4 w-4" />
            {cfg.secondaryCtaLabel}
          </Button>
        </div>

        {}
        <TrustBar />

        {}
        <div className="animate-text-reveal delay-800 relative mx-auto mt-20 max-w-4xl">
          {}
          <div
            className="absolute -inset-4 rounded-2xl opacity-50 blur-2xl animate-glow-pulse"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--chart-4) 10%, transparent))",
            }}
          />

          {}
          <div
            className="absolute -inset-8 rounded-2xl border border-primary/5 animate-orbit-reverse"
            style={{ borderRadius: "24px" }}
          />

          {}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/5">
            {}
            <div className="flex items-center gap-3 border-b border-border/50 bg-muted/30 px-5 py-3.5 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/50 transition-colors hover:bg-destructive" />
                <div className="h-3 w-3 rounded-full bg-amber-400/50 transition-colors hover:bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-500/50 transition-colors hover:bg-green-500" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 rounded-lg bg-background/60 px-4 py-1.5 border border-border/30">
                  <div className="h-3 w-3 rounded-full bg-green-500/40" />
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    {cfg.mockAddressBar}
                  </Typography>
                </div>
              </div>
              <div className="w-[52px]" /> {}
            </div>

            {}
            <div className="relative">
              <video
                src={demoVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full"
              />

              {}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {(["Custom Background", "Trim & Export", "1080p"] as const).map(
                  (label, i) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 rounded-full bg-background/80 border border-border/50 px-3 py-1 backdrop-blur-sm animate-fade-up"
                      style={{ animationDelay: `${1200 + i * 150}ms` }}
                    >
                      <Sparkles className="h-3 w-3 text-primary" />
                      <Typography variant="label" className="text-foreground">
                        {label}
                      </Typography>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
