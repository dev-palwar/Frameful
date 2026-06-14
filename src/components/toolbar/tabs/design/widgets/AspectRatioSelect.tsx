import { ChevronDown } from "lucide-react";
import { Typography } from "@/design-system/Typography";

export const ASPECT_RATIOS = [
  { key: "native", label: "Native",  ratio: null },
  { key: "21:9",   label: "21 : 9",  ratio: 21 / 9 },
  { key: "16:9",   label: "16 : 9",  ratio: 16 / 9 },
  { key: "16:10",  label: "16 : 10", ratio: 16 / 10 },
  { key: "3:2",    label: "3 : 2",   ratio: 3 / 2 },
  { key: "4:3",    label: "4 : 3",   ratio: 4 / 3 },
  { key: "1:1",    label: "1 : 1",   ratio: 1 },
  { key: "3:4",    label: "3 : 4",   ratio: 3 / 4 },
  { key: "2:3",    label: "2 : 3",   ratio: 2 / 3 },
  { key: "10:16",  label: "10 : 16", ratio: 10 / 16 },
  { key: "9:16",   label: "9 : 16",  ratio: 9 / 16 },
] as const;

/** Returns the numeric ratio for a given key, or null for "native". */
export function resolveRatio(key: string): number | null {
  const entry = ASPECT_RATIOS.find((r) => r.key === key);
  return entry ? entry.ratio : null;
}

interface AspectRatioSelectProps {
  value: string;
  onChange: (key: string) => void;
}

export const AspectRatioSelect = ({ value, onChange }: AspectRatioSelectProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <Typography variant="label" className="text-muted-foreground shrink-0">
        Aspect ratio
      </Typography>

      <div className="relative">
        <select
          id="aspect-ratio-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            appearance-none cursor-pointer
            pl-3 pr-7 py-1.5
            rounded-md text-[12px] font-medium
            bg-card border border-border
            text-foreground
            hover:border-primary/50 focus:border-primary
            focus:outline-none focus:ring-1 focus:ring-primary/30
            transition-colors duration-150
          "
        >
          {ASPECT_RATIOS.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <ChevronDown
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground"
        />
      </div>
    </div>
  );
};
