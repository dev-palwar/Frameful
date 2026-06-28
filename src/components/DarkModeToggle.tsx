import { useContext } from "react";
import { Sun, Moon, Palette } from "lucide-react";
import { ThemeProviderContext } from "@/providers/theme-provider";
import type { Theme } from "@/context/theme";

const CYCLE: Theme[] = ["light", "dark", "gruvbox-dark"];

const META: Record<string, { label: string; icon: React.ReactNode; dot: string }> = {
  light:         { label: "Light",   icon: <Sun     className="w-3.5 h-3.5" />, dot: "bg-muted-foreground/30" },
  dark:          { label: "Dark",    icon: <Moon    className="w-3.5 h-3.5" />, dot: "bg-primary"              },
  "gruvbox-dark":{ label: "Gruvbox", icon: <Palette className="w-3.5 h-3.5" />, dot: "bg-[#d79921]"           },
};

export function DarkModeToggle() {
  const { theme, setTheme } = useContext(ThemeProviderContext);

  // Resolve current: if somehow not in cycle (e.g. "system"), default to light
  const current: Theme = CYCLE.includes(theme as Theme) ? (theme as Theme) : "light";
  const next: Theme = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
  const meta = META[current];

  return (
    <button
      id="dark-mode-toggle"
      onClick={() => setTheme(next)}
      title={`Switch to ${META[next].label}`}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground shadow-sm hover:shadow transition-all duration-150 hover:scale-[1.03] active:scale-95 cursor-pointer select-none"
    >
      {meta.icon}
      <span className="text-[10px] font-semibold tracking-widest uppercase">
        {meta.label}
      </span>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
    </button>
  );
}
