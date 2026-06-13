import { LucideGithub } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const params = useLocation();

  const isHidden =
    params.pathname === "/record" || params.pathname === "/privacy";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      style={{ display: isHidden ? "none" : "block" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Brand wordmark */}
        <div
          id="header-brand"
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-2.5"
        >
          <div className="relative inline-block">
            <span className="bg-brand-gradient text-primary-foreground px-3 py-1 inline-block type-label tracking-widest uppercase">
              FrameFul
            </span>
            {/* v1 badge */}
            <span
              className="absolute -top-2 -right-2 flex items-center justify-center rounded-full px-1.5 py-0.5 type-overline ring-1 ring-white/20 bg-brand-gradient text-primary-foreground"
              style={{ fontSize: "9px" }}
            >
              v1
            </span>
          </div>
        </div>

        {/* GitHub link */}
        <a
          href="https://github.com/dev-palwar/frameful"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Frameful on GitHub"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <LucideGithub className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
};

export default Header;
