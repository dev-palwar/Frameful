import React from "react";
import { cn } from "@/lib/utils";

// ─── Variant → semantic HTML tag mapping ─────────────────────────────────────
const TAG_MAP = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "p",
  label: "span",
  overline: "span",
  code: "code",
} as const;

type Variant = keyof typeof TAG_MAP;

// ─── Props ────────────────────────────────────────────────────────────────────
interface TypographyProps<T extends keyof React.JSX.IntrinsicElements = "p"> {
  /** Semantic scale variant — drives font-size, line-height, weight & tracking */
  variant: Variant;
  /** Override the rendered HTML element. Falls back to the semantic default. */
  as?: T;
  /** Apply the brand gradient clip effect (violet → fuchsia) */
  gradient?: boolean;
  /** Extra Tailwind / CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Typography
 * ──────────────────────────────────────────────────────────────────────────
 * The sole component for rendering text in Frameful.
 *
 * Usage:
 *   <Typography variant="h2">Section Title</Typography>
 *   <Typography variant="body-sm" className="text-muted-foreground">...</Typography>
 *   <Typography variant="display" gradient>Make it beautiful.</Typography>
 *
 * Variants map 1-to-1 with the .type-* utility classes in index.css.
 * Never pass raw font-size, font-weight, or line-height classes directly to
 * this component — use a different variant or extend the scale in index.css.
 */
function Typography<T extends keyof React.JSX.IntrinsicElements = "p">({
  variant,
  as,
  gradient = false,
  className,
  style,
  children,
}: TypographyProps<T>) {
  const Tag = (as ?? TAG_MAP[variant]) as React.ElementType;

  return (
    <Tag
      className={cn(
        `type-${variant}`,
        gradient && "text-brand-gradient",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}

export { Typography };
export type { TypographyProps, Variant };
