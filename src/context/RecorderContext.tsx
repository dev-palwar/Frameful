import { createContext } from "react";

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
}

// Context that holds all recorder state and actions
export const RecorderContext = createContext<RecorderContextValue | null>(null);
