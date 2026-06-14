interface CustomSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (v: number) => string;
}

export const CustomSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (v: number) => v.toString(),
}: CustomSliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative h-8 w-full bg-muted/40 rounded-md flex items-center px-3 overflow-hidden group">
      <div
        className="absolute left-0 top-0 bottom-0 bg-muted-foreground/20 transition-all duration-75"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-muted-foreground/60 rounded-full transition-all duration-75"
        style={{ left: `calc(${percentage}% - 1px)` }}
      />

      <span className="relative z-10 text-xs text-muted-foreground pointer-events-none">
        {label}
      </span>
      <span className="relative z-10 text-xs text-foreground ml-auto pointer-events-none tabular-nums">
        {formatValue(value)}
      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full m-0"
      />
    </div>
  );
};
