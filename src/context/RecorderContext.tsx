import { createContext } from "react";
import type { ZoomEvent } from "@/lib/zoom";

export type RecordingState = "idle" | "recording" | "preview";

interface RecorderContextValue {
  blob: Blob | null;
  videoUrl: string | null;
  recordingState: RecordingState;
  elapsedTime: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  discardRecording: () => void;
  setUploadedVideo: (file: File) => void;
  // Auto-zoom
  zoomEvents: ZoomEvent[];
  setZoomEvents: (events: ZoomEvent[]) => void;
  extensionInstalled: boolean;
}

// Context that holds all recorder state and actions
export const RecorderContext = createContext<RecorderContextValue | null>(null);
