import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Typography } from "@/design-system/Typography";

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const Section = ({ title, defaultOpen = true, children }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-6 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full mb-3 cursor-pointer group"
      >
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`}
        />
        <Typography
          variant="label"
          className="text-muted-foreground group-hover:text-foreground transition-colors font-semibold tracking-wider text-[11px] uppercase"
        >
          {title}
        </Typography>
      </button>
      {isOpen && <div className="space-y-4 pl-1">{children}</div>}
    </div>
  );
};
