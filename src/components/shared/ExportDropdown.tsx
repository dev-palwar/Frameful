import { useState, useRef, useEffect } from "react";
import {
  Download,
  ChevronDown,
  Film,
  Zap,
  Star,
  Cpu,
  FileVideo,
} from "lucide-react";
import { Typography } from "@/design-system";
import { DarkModeToggle } from "../DarkModeToggle";

export interface ExportPreset {
  id: string;
  label: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  widthMultiplier: number;
  crf: number;
  icon: React.ReactNode;
  isRaw?: boolean;
}

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: "4k",
    label: "4K Ultra HD",
    description: "3840 × 2160 · Best quality",
    badge: "Slow",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    widthMultiplier: 3,
    crf: 16,
    icon: <Star className="w-3.5 h-3.5" />,
  },
  {
    id: "1080p",
    label: "1080p Full HD",
    description: "1920 × 1080 · Recommended",
    badge: "Best",
    badgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    widthMultiplier: 1.5,
    crf: 18,
    icon: <Zap className="w-3.5 h-3.5" />,
  },
  {
    id: "720p",
    label: "720p HD",
    description: "1280 × 720 · Balanced",
    widthMultiplier: 1,
    crf: 22,
    icon: <Film className="w-3.5 h-3.5" />,
  },
  {
    id: "480p",
    label: "480p SD",
    description: "854 × 480 · Small file",
    widthMultiplier: 0.667,
    crf: 26,
    icon: <Cpu className="w-3.5 h-3.5" />,
  },
];

export const RAW_PRESET: ExportPreset = {
  id: "raw",
  label: "Raw Recording",
  description: "Original unprocessed file",
  badge: "No effects",
  badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  widthMultiplier: 1,
  crf: 0,
  isRaw: true,
  icon: <FileVideo className="w-3.5 h-3.5" />,
};

interface ExportDropdownProps {
  onExport: (preset: ExportPreset) => void;
  disabled?: boolean;
}

export function ExportDropdown({ onExport, disabled }: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {}
      <div className="flex justify-between items-center gap-4">
        {" "}
        <button
          id="export-dropdown-btn"
          disabled={disabled}
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 py-1.5 pl-4 pr-3 bg-brand-gradient text-primary-foreground cursor-pointer rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          <Download className="w-3.5 h-3.5" />
          <Typography variant="label" as="span">
            Export Video
          </Typography>
          <div className="w-px h-3.5 bg-white/25 mx-0.5" />
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <DarkModeToggle />
      </div>

      {}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden z-50"
          style={{ animation: "dropdownIn 0.15s ease-out" }}
        >
          {}
          <div className="p-2">
            <div className="px-2 py-1.5 mb-1">
              <Typography
                variant="caption"
                className="text-muted-foreground uppercase tracking-wider font-semibold text-[10px]"
              >
                Export Quality
              </Typography>
            </div>
            {EXPORT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setOpen(false);
                  onExport(preset);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer group text-left"
              >
                <span className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                  {preset.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Typography variant="label" className="text-foreground">
                      {preset.label}
                    </Typography>
                    {preset.badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${preset.badgeColor}`}
                      >
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    {preset.description}
                  </Typography>
                </div>
              </button>
            ))}
          </div>

          {}
          <div className="mx-3 border-t border-border" />

          {}
          <div className="p-2">
            <div className="px-2 py-1.5 mb-1">
              <Typography
                variant="caption"
                className="text-muted-foreground uppercase tracking-wider font-semibold text-[10px]"
              >
                Original File
              </Typography>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                onExport(RAW_PRESET);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer group text-left"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                {RAW_PRESET.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Typography variant="label" className="text-foreground">
                    {RAW_PRESET.label}
                  </Typography>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${RAW_PRESET.badgeColor}`}
                  >
                    {RAW_PRESET.badge}
                  </span>
                </div>
                <Typography variant="caption" className="text-muted-foreground">
                  {RAW_PRESET.description}
                </Typography>
              </div>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}
