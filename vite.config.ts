import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Prevent Vite from pre-bundling FFmpeg — it loads itself via WASM
  // dynamic imports and Vite's pre-bundler breaks that process.
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  server: {
    headers: {
      // Required for SharedArrayBuffer (multi-threaded FFmpeg upgrade path).
      // Also needed so fonts load correctly — fonts are now self-hosted via
      // @fontsource-variable (same origin), so COEP is safe.
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
