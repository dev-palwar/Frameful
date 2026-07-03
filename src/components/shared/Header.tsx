import { useEffect, useState } from "react";
import { LucideGithub, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const navigate = useNavigate();
  const params = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isHidden =
    params.pathname === "/record" || params.pathname === "/privacy";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isHidden) return null;

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between h-14 px-4 sm:px-6 rounded-full border transition-all duration-500 w-full max-w-4xl ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl shadow-primary/5 translate-y-0"
            : "bg-background/40 backdrop-blur-md border-border/30 shadow-lg translate-y-2"
        }`}
      >
        {/* LEFT: Brand */}
        <div
          id="header-brand"
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <span className="font-extrabold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 hidden sm:inline-block">
            Cutline
          </span>
          <span className="flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-primary/30 bg-primary/10 text-primary uppercase tracking-wider hidden sm:flex">
            Beta
          </span>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2 mr-2 border-r border-border/50 pr-4">
            <a
              href="https://github.com/dev-palwar/frameful"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Cutline on GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LucideGithub className="w-4 h-4" />
            </a>

            <div className="scale-90">
              <ThemeToggle />
            </div>
          </div>

          <Button
            id="header-record-btn"
            size="sm"
            className="gap-2 rounded-full px-5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            onClick={() => navigate("/record")}
          >
            <span className="font-semibold hidden sm:inline-block">
              Start Studio
            </span>
            <span className="font-semibold sm:hidden">Start</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Header;
