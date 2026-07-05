import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

let currentProgressHandler: ((e: { progress: number }) => void) | null = null;

export async function getFFmpeg(
  onProgress?: (progress: number) => void,
): Promise<FFmpeg> {
  
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
