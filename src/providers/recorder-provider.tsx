import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import {
  RecorderContext,
  type RecordingState,
} from "@/context/RecorderContext";

export function RecorderProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [blob, setBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [elapsedTime, setElapsedTime] = useState(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    // Stop all tracks to release the screen share
    streamRef.current?.getTracks().forEach((track) => track.stop());
    clearTimer();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      // MediaRecorder setup — collects chunks on dataavailable, builds blob on stop
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, {
          type: "video/webm",
        });

        // Revoke old object URL before creating a new one
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
        }

        const url = URL.createObjectURL(recordedBlob);
        setBlob(recordedBlob);
        setVideoUrl(url);
        setRecordingState("preview");

        // Navigate to studio page after recording stops
        navigate("/studio");
      };

      // Handle user manually stopping screen sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      recorder.start();
      setRecordingState("recording");
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } catch {
      console.log("Screen recording cancelled");
    }
  }, [videoUrl, stopRecording, navigate]);

  const discardRecording = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setBlob(null);
    setVideoUrl(null);
    setRecordingState("idle");
    setElapsedTime(0);
  }, [videoUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUploadedVideo = useCallback(
    (file: File) => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      const url = URL.createObjectURL(file);
      setBlob(file);
      setVideoUrl(url);
      setRecordingState("preview");
      navigate("/studio");
    },
    [videoUrl, navigate]
  );

  return (
    <RecorderContext.Provider
      value={{
        blob,
        videoUrl,
        recordingState,
        elapsedTime,
        startRecording,
        stopRecording,
        discardRecording,
        setUploadedVideo,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
}
