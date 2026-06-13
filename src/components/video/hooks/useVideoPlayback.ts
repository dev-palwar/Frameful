import { useEffect, useRef, useState } from "react";

interface UseVideoPlaybackOptions {
  videoUrl: string;
  trimStart: number;
  trimEnd: number;
  setTrimStart: (v: number) => void;
  setTrimEnd: (v: number) => void;
}

interface VideoPlaybackState {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  handlePlayPause: () => void;
}

/**
 * Manages all HTMLVideoElement event listeners and play/pause logic.
 * Owns: duration, currentTime, isPlaying.
 * Handles: loadedmetadata, timeupdate, play, pause events.
 */
export function useVideoPlayback({
  videoUrl,
  trimStart,
  trimEnd,
  setTrimStart,
  setTrimEnd,
}: UseVideoPlaybackOptions): VideoPlaybackState {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load metadata and initialise trim range on source change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => {
      setDuration(video.duration);
      setTrimStart(0);
      setTrimEnd(video.duration);
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, [videoUrl, setTrimStart, setTrimEnd]);

  // Track time and enforce trim boundaries
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= trimEnd) {
        video.pause();
        setIsPlaying(false);
        video.currentTime = trimStart;
      }
    };
    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [trimStart, trimEnd]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      if (video.currentTime < trimStart || video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
      video.play();
    }
  };

  return { videoRef, duration, currentTime, isPlaying, handlePlayPause };
}
