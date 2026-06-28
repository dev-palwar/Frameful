import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, Loader2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WAITLIST_CONFIG } from "@/configs/landing.config";
import { Typography } from "@/design-system/Typography";

type FormState = "idle" | "submitting" | "success" | "error";

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

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const cfg = WAITLIST_CONFIG;
  const { ref, inView } = useInView();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "submitting") return;

    setState("submitting");

    try {
      const res = await fetch(cfg.formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setState(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="py-24 md:py-36" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        <div
          className={`relative overflow-hidden rounded-3xl transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-brand-gradient" />

          {/* Animated mesh overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary-foreground/5 blur-[80px] animate-mesh-float"
            />
            <div
              className="absolute -bottom-1/2 -right-1/4 h-[500px] w-[500px] rounded-full bg-primary-foreground/10 blur-[80px] animate-mesh-float"
              style={{ animationDelay: "-7s" }}
            />
          </div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(color-mix(in srgb, var(--primary-foreground) 30%, transparent) 1px, transparent 1px),
                linear-gradient(90deg, color-mix(in srgb, var(--primary-foreground) 30%, transparent) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 py-20 text-center text-primary-foreground md:px-16 md:py-24">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
              <Mail className="h-4 w-4" />
              <Typography variant="label" className="font-semibold">{cfg.badgeLabel}</Typography>
            </div>

            <Typography
              variant="h2"
              as="h2"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
            >
              {cfg.headline}
            </Typography>

            <Typography
              variant="body"
              className="mx-auto mt-4 max-w-lg text-primary-foreground/75 leading-relaxed"
              style={{ fontSize: "1.1rem" }}
            >
              {cfg.subtext}
            </Typography>

            {state === "success" ? (
              <div className="mx-auto mt-10 max-w-md animate-text-reveal">
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 px-8 py-5 backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                    <Check className="h-4 w-4" />
                  </div>
                  <Typography variant="body-sm" className="font-semibold">
                    {cfg.successMessage}
                  </Typography>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/40" />
                  <input
                    id="waitlist-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={state === "submitting"}
                    placeholder={cfg.inputPlaceholder}
                    className="w-full rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 pl-11 pr-4 py-3.5 text-primary-foreground placeholder-primary-foreground/40 backdrop-blur-sm outline-none transition-all duration-200 focus:border-primary-foreground/30 focus:bg-primary-foreground/15 focus:ring-2 focus:ring-primary-foreground/10 disabled:opacity-60 type-body-sm"
                  />
                </div>
                <Button
                  id="waitlist-submit-btn"
                  type="submit"
                  size="lg"
                  disabled={state === "submitting"}
                  className="gap-2.5 bg-primary-foreground px-8 py-3.5 font-semibold rounded-xl hover:bg-primary-foreground/90 disabled:opacity-70 text-primary shadow-lg shadow-black/10 transition-all duration-200"
                >
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <Typography variant="body-sm">Sending…</Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body-sm">{cfg.ctaLabel}</Typography>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {state === "error" && (
              <div className="mt-4 flex items-center justify-center gap-1.5 text-primary-foreground/70">
                <AlertCircle className="h-4 w-4" />
                <Typography variant="caption">{cfg.errorMessage}</Typography>
              </div>
            )}

            <Typography variant="caption" className="mt-6 text-primary-foreground/40">
              {cfg.disclaimer}
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
