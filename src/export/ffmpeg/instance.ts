import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

/**
 * Returns the shared FFmpeg instance, lazy-loading the WASM binary on first
 * call. Subsequent calls return the cached instance immediately.
 *
 * The `loadPromise` guard prevents a double-load race if two callers invoke
 * this before the first load resolves.
 *
 * @param onProgress  Optional callback — receives progress 0.0 → 1.0 from
 *                    FFmpeg's `progress` event during exec.
 */
export async function getFFmpeg(
  onProgress?: (progress: number) => void,
): Promise<FFmpeg> {
  if (instance) return instance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();

    if (onProgress) {
      ffmpeg.on("progress", ({ progress }) => onProgress(progress));
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
