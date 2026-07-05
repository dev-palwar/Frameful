import React from "react";
import { cn } from "@/lib/utils";

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

interface TypographyProps<T extends keyof React.JSX.IntrinsicElements = "p"> {
    variant: Variant;
    as?: T;
    gradient?: boolean;
    className?: string;
    style?: React.CSSProperties;
  children: React.ReactNode;
}

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
