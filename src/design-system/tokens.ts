

export const VIOLET = "#8b5cf6";
export const PURPLE = "#a855f7";
export const FUCHSIA = "#d946ef";
export const VIOLET_DARK = "#7c3aed";
export const VIOLET_LIGHT = "#a78bfa";

export const GRADIENT =
  "linear-gradient(135deg, rgb(139, 92, 246) 0%, rgb(217, 70, 239) 100%)";
export const GRADIENT_REVERSE =
  "linear-gradient(135deg, rgb(217, 70, 239) 0%, rgb(139, 92, 246) 100%)";

export const STATUS_COLORS = {
  "In Development": { bg: "rgba(139, 92, 246, 0.10)", text: VIOLET },
  Planned: { bg: "rgba(217, 70, 239, 0.10)", text: FUCHSIA },
} as const;

export const STEP_COLORS = {
  record: { color: VIOLET, bgColor: "rgba(139, 92, 246, 0.08)" },
  customize: { color: PURPLE, bgColor: "rgba(168, 85, 247, 0.08)" },
  export: { color: FUCHSIA, bgColor: "rgba(217, 70, 239, 0.08)" },
} as const;
