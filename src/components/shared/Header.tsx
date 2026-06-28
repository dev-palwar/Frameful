import { useEffect, useState } from "react";
import { LucideGithub, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl shadow-sm shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Brand wordmark */}
        <div
          id="header-brand"
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="relative inline-block">
            <span className="bg-brand-gradient text-primary-foreground px-3.5 py-1.5 inline-block type-label tracking-widest uppercase font-bold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
              FrameFul
            </span>
            {/* v1 badge */}
            <span
              className="absolute -top-2 -right-2.5 flex items-center justify-center rounded-full px-1.5 py-0.5 type-overline ring-1 ring-white/20 bg-brand-gradient text-primary-foreground"
              style={{ fontSize: "9px" }}
            >
              v1
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* GitHub link */}
          <a
            href="https://github.com/dev-palwar/frameful"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Frameful on GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200"
          >
            <LucideGithub className="w-[18px] h-[18px]" />
          </a>

          {/* CTA */}
          <Button
            id="header-record-btn"
            size="sm"
            className="gap-1.5 rounded-lg hidden sm:inline-flex"
            onClick={() => navigate("/record")}
          >
            Start recording
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
