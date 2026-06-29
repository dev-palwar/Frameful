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
      { threshold },
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
    <section className="relative py-24 md:py-36 overflow-hidden" ref={ref}>
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div
          className="h-[400px] w-[600px] rounded-full blur-[120px] opacity-20 animate-pulse"
          style={{
            background: "radial-gradient(circle, var(--primary), transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 relative z-10">
        <div
          className={`group relative overflow-hidden rounded-3xl bg-card/40 p-8 md:p-16 backdrop-blur-xl transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Subtle animated border gradient overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" /> */}

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 transition-colors group-hover:bg-primary/20">
              <Mail className="h-4 w-4 text-primary" />
              <Typography
                variant="label"
                className="font-semibold text-primary"
              >
                {cfg.badgeLabel}
              </Typography>
            </div>

            <Typography
              variant="h2"
              as="h2"
              className="text-foreground"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              {cfg.headline}
            </Typography>

            <Typography
              variant="body"
              className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed"
              style={{ fontSize: "1.1rem" }}
            >
              {cfg.subtext}
            </Typography>

            {state === "success" ? (
              <div className="mx-auto mt-10 max-w-md animate-text-reveal">
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 px-8 py-5 backdrop-blur-sm shadow-inner">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <Typography
                    variant="body"
                    className="font-semibold text-foreground"
                  >
                    {cfg.successMessage}
                  </Typography>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row relative items-center"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="waitlist-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={state === "submitting"}
                    placeholder={cfg.inputPlaceholder}
                    className="w-full rounded-xl border border-border/50 bg-background/50 pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground backdrop-blur-sm outline-none transition-all duration-200 focus:border-primary/50 focus:bg-background/80 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>
                <Button
                  id="waitlist-submit-btn"
                  type="submit"
                  size="lg"
                  disabled={state === "submitting"}
                  className="gap-2.5 px-8 py-3.5 font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>{cfg.ctaLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {state === "error" && (
              <div className="mt-4 flex items-center justify-center gap-1.5 text-destructive animate-pulse">
                <AlertCircle className="h-4 w-4" />
                <Typography variant="caption" className="font-medium">
                  {cfg.errorMessage}
                </Typography>
              </div>
            )}

            <Typography
              variant="caption"
              className="mt-8 text-muted-foreground/50 font-medium tracking-widest uppercase"
            >
              {cfg.disclaimer}
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
