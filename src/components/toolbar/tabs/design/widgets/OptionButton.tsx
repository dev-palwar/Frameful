import React from "react";
import { Typography } from "@/design-system/Typography";

interface OptionButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const OptionButton = ({ label, isActive, onClick, children }: OptionButtonProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 cursor-pointer w-full group"
  >
    <div
      className={`w-full aspect-square rounded-xl overflow-hidden transition-all duration-150 ${
        isActive
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "ring-1 ring-border/50 group-hover:ring-border"
      }`}
    >
      <div className="w-full h-full">{children}</div>
    </div>
    <Typography
      variant="caption"
      className={`text-[10px] ${
        isActive
          ? "text-foreground font-semibold"
          : "text-muted-foreground group-hover:text-foreground"
      }`}
    >
      {label}
    </Typography>
  </button>
);
