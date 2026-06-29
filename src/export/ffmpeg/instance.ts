import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

// Track the currently-registered progress handler so we can swap it out.
let currentProgressHandler: ((e: { progress: number }) => void) | null = null;

/**
 * Returns the shared FFmpeg instance, lazy-loading the WASM binary on first
 * call. Subsequent calls return the cached instance immediately.
 *
 * The `loadPromise` guard prevents a double-load race if two callers invoke
 * this before the first load resolves.
 *
 * IMPORTANT: The progress callback is re-wired on every call so that a new
 * export always receives fresh progress events, even when using the cached
 * instance.
 *
 * @param onProgress  Optional callback — receives progress 0.0 → 1.0 from
 *                    FFmpeg's `progress` event during exec.
 */
export async function getFFmpeg(
  onProgress?: (progress: number) => void,
): Promise<FFmpeg> {
  // ── Already loaded: just swap the progress listener and return ──────────────
  if (instance) {
    if (currentProgressHandler) {
      instance.off("progress", currentProgressHandler);
      currentProgressHandler = null;
    }
    if (onProgress) {
      currentProgressHandler = ({ progress }) => onProgress(progress);
      instance.on("progress", currentProgressHandler);
    }
    return instance;
  }

  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();

    if (onProgress) {
      currentProgressHandler = ({ progress }) => onProgress(progress);
      ffmpeg.on("progress", currentProgressHandler);
    }

    await ffmpeg.load({
      coreURL: await toBlobURL("/ffmpeg/ffmpeg-core.js",   "text/javascript"),
      wasmURL: await toBlobURL("/ffmpeg/ffmpeg-core.wasm", "application/wasm"),
    });

    instance = ffmpeg;
    return ffmpeg;
  })();

  return loadPromise;
}
