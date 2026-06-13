/**
 * src/export — Public API
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the ONLY import surface the rest of the application uses.
 * Nothing from sub-modules (ffmpeg/, pipeline/, hooks/) should ever be
 * imported directly by code outside this directory.
 *
 * Usage in StudioPage:
 *   import { useExport } from "@/export";
 *   import type { ExportOptions } from "@/export";
 */
export { useExport } from "./hooks";
export type { ExportOptions, ExportState } from "./types";
