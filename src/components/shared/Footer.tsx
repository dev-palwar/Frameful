import { Link } from "react-router";
import { FOOTER_CONFIG } from "@/configs/landing.config";
import { Typography } from "@/design-system/Typography";
import { Heart } from "lucide-react";

export default function Footer() {
  const { brandName, links } = FOOTER_CONFIG;

  return (
    <footer className="relative border-t border-border/50">
      {/* Subtle gradient glow at top */}
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/cutline-logo.png" alt="Cutline Logo" className="h-8 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            <span className="bg-brand-gradient text-primary-foreground px-3 py-1 type-label tracking-widest uppercase font-bold">
              {brandName}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {links.map((link) =>
              link.internal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="type-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1.5">
            <Typography variant="caption" className="text-muted-foreground">
              Made with
            </Typography>
            <Heart className="h-3 w-3 text-primary fill-primary animate-pulse" />
            <Typography variant="caption" className="text-muted-foreground">
              © 2026 Cutline
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}
