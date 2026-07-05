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
import {
  isExtensionInstalled,
  startSession,
  stopSession,
} from "@/lib/extension-bridge";
import { clicksToZoomEvents, type ZoomEvent } from "@/lib/zoom";

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

  const [zoomEvents, setZoomEvents] = useState<ZoomEvent[]>([]);
  const [extensionInstalled, setExtensionInstalled] = useState(false);

  useEffect(() => {
    isExtensionInstalled().then((installed) => {
      console.log("[Cutline] Extension installed:", installed);
      setExtensionInstalled(installed);
    });
  }, []);

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

      console.log("[Cutline] startSession called");
      await startSession();
      console.log("[Cutline] startSession done");

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        
        console.log("[Cutline] Recording stopped, fetching clicks...");
        const clicks = await stopSession();
        console.log("[Cutline] Clicks received:", clicks.length, clicks);
        const detectedZooms = clicksToZoomEvents(clicks);
        console.log(
          "[Cutline] Zoom events generated:",
          detectedZooms.length,
          detectedZooms,
        );

        const recordedBlob = new Blob(chunksRef.current, {
          type: "video/webm",
        });

        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
        }

        const url = URL.createObjectURL(recordedBlob);
        setBlob(recordedBlob);
        setVideoUrl(url);
        setZoomEvents(detectedZooms);
        setRecordingState("preview");

        navigate("/studio");
      };

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
    setZoomEvents([]);
  }, [videoUrl]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
    
  }, []);

  const setUploadedVideo = useCallback(
    (file: File) => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      const url = URL.createObjectURL(file);
      setBlob(file);
      setVideoUrl(url);
      
      setZoomEvents([]);
      setRecordingState("preview");
      navigate("/studio");
    },
    [videoUrl, navigate],
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
        zoomEvents,
        setZoomEvents,
        extensionInstalled,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
}
