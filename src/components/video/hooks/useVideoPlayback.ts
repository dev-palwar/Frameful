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
  seekTo: (time: number) => void;
}

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

  const lastTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const prevTime = lastTimeRef.current;
      const currTime = video.currentTime;
      setCurrentTime(currTime);

      if (prevTime < trimEnd && currTime >= trimEnd && !video.paused) {
        video.pause();
        setIsPlaying(false);
        video.currentTime = trimStart;
      }
      lastTimeRef.current = currTime;
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
      video.play();
    }
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  };

  return { videoRef, duration, currentTime, isPlaying, handlePlayPause, seekTo };
}
