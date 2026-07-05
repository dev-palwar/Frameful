import { ArrowLeft, Chrome, HelpCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Typography } from "@/design-system/Typography";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function ComingSoonExtPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-between overflow-hidden">
      {}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      {}
      <header className="w-full max-w-4xl mx-auto px-6 h-20 flex items-center justify-between z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <Typography variant="label" as="span" className="font-medium">
            Back to home
          </Typography>
        </button>

        <DarkModeToggle />
      </header>

      {}
      <main className="flex-1 flex items-center justify-center px-4 w-full max-w-md z-10">
        <div className="w-full text-center space-y-8 py-12">
          {}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-card border border-border shadow-lg">
            <div className="absolute inset-0 rounded-3xl bg-primary/5 animate-pulse" />
            <div className="relative flex items-center justify-center">
              <Chrome className="w-12 h-12 text-primary/80 animate-[spin_12s_linear_infinite]" />
              <Loader2 className="absolute -top-1 -right-1 w-5 h-5 text-amber-500 animate-spin" />
            </div>
          </div>

          <div className="space-y-4">
            <Typography
              variant="overline"
              className="text-primary font-bold uppercase tracking-widest"
            >
              Chrome Extension
            </Typography>

            <Typography
              variant="h2"
              className="text-foreground font-extrabold tracking-tight"
            >
              Review in Progress
            </Typography>

            <Typography
              variant="body"
              className="text-muted-foreground leading-relaxed max-w-sm mx-auto"
            >
              The extension is currently undergoing review with the Chrome Web
              Store. We'll be live and ready for download very soon!
            </Typography>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() =>
                window.open("https://github.com/dev-palwar/Frameful", "_blank")
              }
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/20"
            >
              Self Host
            </button>
            <a
              href="mailto:devpalwar06@gmail.com"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </a>
          </div>
        </div>
      </main>

      {}
      <footer className="w-full py-6 text-center z-10">
        <Typography variant="caption" className="text-muted-foreground/40">
          © {new Date().getFullYear()} Cutline. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
}
