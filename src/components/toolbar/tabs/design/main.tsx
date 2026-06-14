import React from "react";
import type { ToolBarProps } from "../../types";
import {
  Section,
  CustomSlider,
  OptionButton,
  StylePreview,
  ShadowPreview,
  BorderShapePreview,
  AspectRatioSelect,
  BlurPreview,
} from "./widgets";

const STYLE_VARIANTS = [
  "default",
  "glass-light",
  "glass-dark",
  "outline",
  "border",
  "border-dark",
] as const;

const STYLE_LABELS: Record<(typeof STYLE_VARIANTS)[number], string> = {
  default: "Default",
  "glass-light": "Glass Light",
  "glass-dark": "Glass Dark",
  outline: "Outline",
  border: "Border",
  "border-dark": "Border Dark",
};

const BORDER_VARIANTS = ["sharp", "curved", "round"] as const;
const SHADOW_VARIANTS = ["none", "hug", "soft", "strong"] as const;
const BLUR_VARIANTS  = ["none", "subtle", "medium", "heavy"] as const;

const DesignTab: React.FC<ToolBarProps> = ({ designSettings, setDesignSettings }) => {
  const update = (key: keyof typeof designSettings, value: unknown) =>
    setDesignSettings((prev) => ({ ...prev, [key]: value }));

  const { style, padding, opacity, borderStyle, radius, scale, shadow, shadowIntensity, aspectRatio, blur, blurAmount } = designSettings;

  return (
    <div className="grid grid-cols-1 gap-2">
      {/* ── Aspect Ratio ── */}
      <Section title="Canvas">
        <AspectRatioSelect
          value={aspectRatio}
          onChange={(v) => update("aspectRatio", v)}
        />
      </Section>

      {/* ── Style ── */}
      <Section title="Style">
        <div className="grid grid-cols-3 gap-x-4 gap-y-4 mb-4">
          {STYLE_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={STYLE_LABELS[v]}
              isActive={style === v}
              onClick={() => update("style", v)}
            >
              <StylePreview variant={v} />
            </OptionButton>
          ))}
        </div>

        <div className="space-y-2">
          <CustomSlider
            label="Padding"
            value={padding}
            onChange={(v) => update("padding", v)}
            min={0}
            max={5}
            step={0.1}
            formatValue={(v) => v.toFixed(1)}
          />
          <CustomSlider
            label="Opacity"
            value={opacity}
            onChange={(v) => update("opacity", v)}
            min={0}
            max={100}
            step={1}
            formatValue={(v) => `${v}%`}
          />
        </div>
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <div className="grid grid-cols-3 gap-x-4 gap-y-4 mb-4">
          {BORDER_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              isActive={borderStyle === v}
              onClick={() => update("borderStyle", v)}
            >
              <BorderShapePreview variant={v} />
            </OptionButton>
          ))}
        </div>

        <div className="space-y-2">
          <CustomSlider
            label="Radius"
            value={radius}
            onChange={(v) => update("radius", v)}
            min={0}
            max={100}
            step={1}
          />
          <CustomSlider
            label="Scale"
            value={scale}
            onChange={(v) => update("scale", v)}
            min={0.1}
            max={2.0}
            step={0.1}
            formatValue={(v) => v.toFixed(1)}
          />
        </div>
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4">
          {SHADOW_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              isActive={shadow === v}
              onClick={() => update("shadow", v)}
            >
              <ShadowPreview variant={v} />
            </OptionButton>
          ))}
        </div>

        <CustomSlider
          label="Intensity"
          value={shadowIntensity}
          onChange={(v) => update("shadowIntensity", v)}
          min={0}
          max={100}
          step={1}
          formatValue={(v) => `${v}%`}
        />
      </Section>

      {/* ── Blur ── */}
      <Section title="Blur">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4">
          {BLUR_VARIANTS.map((v) => (
            <OptionButton
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              isActive={blur === v}
              onClick={() => update("blur", v)}
            >
              <BlurPreview variant={v} />
            </OptionButton>
          ))}
        </div>

        <CustomSlider
          label="Amount"
          value={blurAmount}
          onChange={(v) => update("blurAmount", v)}
          min={0}
          max={100}
          step={1}
          formatValue={(v) => `${v}%`}
        />
      </Section>
    </div>
  );
};

export default DesignTab;
