import React, { useState, useRef } from "react";
import bg1 from "@/assets/bgs/9088083.jpg";
import bg2 from "@/assets/bgs/snowy-summit-landscape.jpg";
import bg3 from "@/assets/bgs/thomas-griesbeck-BS-Uxe8wU5Y-unsplash.jpg";
import bg4 from "@/assets/bgs/wallhaven-qrz8pl.jpg";
import bg5 from "@/assets/bgs/wallpaperflare.com_wallpaper.jpg";
import { Plus, Image as ImageIcon } from "lucide-react";
import type { ToolBarProps } from "../types";
import { Typography } from "@/design-system/Typography";
import { Section } from "./design/widgets/Section";

const BackgroundThumb = ({ bg, onClick }: { bg: string; onClick: () => void }) => {
  const isGradient = bg.includes("gradient(");
  return (
    <button
      className="group relative w-full aspect-square rounded-md border border-border cursor-pointer overflow-hidden hover:border-primary transition-colors flex-shrink-0"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          background: isGradient ? bg : undefined,
          backgroundImage: !isGradient ? `url(${bg})` : undefined,
        }}
      />
      {}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
      <div className="absolute bottom-1 right-1 p-1 rounded-sm bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
        <ImageIcon className="w-3 h-3 text-white" />
      </div>
    </button>
  );
};

const DEFAULT_BACKGROUNDS: string[] = [bg1, bg2, bg3, bg4, bg5];

const BG_CONFIG = {
  radiant: [] as string[],
  mesh: [] as string[],
  raycast: [] as string[],
};

const BackgroundTab: React.FC<ToolBarProps> = ({ onBackgroundSelect }) => {
  const [backgrounds, setBackgrounds] =
    useState<string[]>(DEFAULT_BACKGROUNDS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setBackgrounds((prev) => [result, ...prev]);
      onBackgroundSelect(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {}
      <button
        id="toolbar-upload-bg-btn"
        onClick={handleUploadClick}
        className="w-full h-20 rounded-md border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/40 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
      >
        <div className="p-1.5 rounded-md bg-muted">
          <Plus className="w-4 h-4 text-muted-foreground" />
        </div>
        <Typography variant="label" className="text-muted-foreground">
          Upload Custom
        </Typography>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </button>

      <div className="flex flex-col gap-4 mt-2">
        {}
        <Section title="MACOS" defaultOpen>
          <div className="grid grid-cols-4 gap-2">
            {backgrounds.map((bg, i) => (
              <BackgroundThumb
                key={`macos-${i}`}
                bg={bg}
                onClick={() => onBackgroundSelect(bg)}
              />
            ))}
          </div>
        </Section>

        {}
        <Section title="RADIANT" defaultOpen>
          {BG_CONFIG.radiant.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {BG_CONFIG.radiant.map((bg, i) => (
                <BackgroundThumb
                  key={`radiant-${i}`}
                  bg={bg}
                  onClick={() => onBackgroundSelect(bg)}
                />
              ))}
            </div>
          ) : (
            <Typography variant="caption" className="text-muted-foreground block py-2">
              None yet
            </Typography>
          )}
        </Section>

        {}
        <Section title="MESH" defaultOpen>
          {BG_CONFIG.mesh.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {BG_CONFIG.mesh.map((bg, i) => (
                <BackgroundThumb
                  key={`mesh-${i}`}
                  bg={bg}
                  onClick={() => onBackgroundSelect(bg)}
                />
              ))}
            </div>
          ) : (
            <Typography variant="caption" className="text-muted-foreground block py-2">
              None yet
            </Typography>
          )}
        </Section>

        {}
        <Section title="RAYCAST" defaultOpen>
          {BG_CONFIG.raycast.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {BG_CONFIG.raycast.map((bg, i) => (
                <BackgroundThumb
                  key={`raycast-${i}`}
                  bg={bg}
                  onClick={() => onBackgroundSelect(bg)}
                />
              ))}
            </div>
          ) : (
            <Typography variant="caption" className="text-muted-foreground block py-2">
              None yet
            </Typography>
          )}
        </Section>
      </div>
    </div>
  );
};

export default BackgroundTab;
