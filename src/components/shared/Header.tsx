import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { DarkModeToggle } from "../DarkModeToggle";
import { GithubIcon } from "lucide-react";

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
        {}
        <div
          id="header-brand"
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <img
            src="/cutline-logo.png"
            alt="Cutline Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="font-extrabold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 hidden sm:inline-block">
            Cutline
          </span>
          <span className="flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-primary/30 bg-primary/10 text-primary uppercase tracking-wider hidden sm:flex">
            Beta
          </span>
        </div>

        {}
        <div className="flex items-center gap-8">
          <DarkModeToggle />
          <a
            href="https://github.com/dev-palwar/Cutline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <GithubIcon className="size-6" />
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Header;
