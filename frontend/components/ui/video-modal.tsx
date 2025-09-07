"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  MoveDiagonal,
  MoveDiagonal2,
} from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  duration?: number;
}

export function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  title = "Video",
}: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Sync state with video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setForceUpdate(prev => prev + 1);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setCurrentTime(video.currentTime);
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("volumechange", handleVolumeChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Set initial states
    setIsPlaying(!video.paused);
    setIsMuted(video.muted);
    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);
    setVolume(video.volume);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("volumechange", handleVolumeChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [videoUrl]);

  // Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // Mute/Unmute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    if (video) {
      video.volume = newVolume;
      video.muted = newVolume === 0;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Fullscreen (use container)
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Fit/Fill toggle
  const toggleFitMode = () => {
    setFitMode((prev) => (prev === 'contain' ? 'cover' : 'contain'));
  };

  // Reset
  const resetVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setCurrentTime(0);
    video.pause();
    setIsPlaying(false);
  };

  // Format time
  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get current time and duration directly from video element
  const getCurrentTime = () => {
    const video = videoRef.current;
    return video ? video.currentTime : 0;
  };

  const getDuration = () => {
    const video = videoRef.current;
    const duration = video ? video.duration : 0;
    console.log("getDuration called:", duration);
    return duration;
  };

  // Progress bar seeking
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const videoDuration = getDuration();
    if (videoDuration > 0) {
      const newTime = percent * videoDuration;
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Drag seeking
  const handleSeekStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSeeking(true);
    handleProgressBarClick(e);
    window.addEventListener("mousemove", handleSeekMove);
    window.addEventListener("mouseup", handleSeekEnd);
  };
  const handleSeekMove = (e: MouseEvent) => {
    if (!isSeeking || !progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const videoDuration = getDuration();
    if (videoDuration > 0) {
      const newTime = percent * videoDuration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const handleSeekEnd = () => {
    setIsSeeking(false);
    window.removeEventListener("mousemove", handleSeekMove);
    window.removeEventListener("mouseup", handleSeekEnd);
  };

  // Fullscreen styles
  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-black w-screen h-screen"
    : "relative bg-black rounded-lg overflow-hidden";
  const videoClass = isFullscreen
    ? `w-screen h-screen ${fitMode === 'contain' ? 'object-contain' : 'object-cover'}`
    : "w-full h-auto max-h-[70vh] object-contain";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isFullscreen ? "max-w-none w-screen h-screen p-0 m-0" : "max-w-4xl w-full p-0"}>
        {!isFullscreen && (
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </DialogHeader>
        )}

        <div ref={containerRef} className={containerClass}>
          <video
            ref={videoRef}
            src={videoUrl}
            className={videoClass}
            controls
            preload="metadata"
            onError={(e) => console.error("Video failed to load:", e, videoUrl)}
            tabIndex={-1}
          />

          {/* Custom Controls */}
          {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"> */}
            {/* Progress Bar */}
            {/* <div className="mb-4">
              <div
                ref={progressBarRef}
                className="w-full bg-gray-800 rounded-full h-2 cursor-pointer relative"
                onClick={handleProgressBarClick}
                onMouseDown={handleSeekStart}
              >
                <div
                  className="bg-white h-2 rounded-full transition-all duration-200 shadow-lg"
                  style={{
                    width: getDuration() > 0 ? `${(getCurrentTime() / getDuration()) * 100}%` : "20%",
                  }}
                />
              </div>
            </div> */}

            {/* Controls */}
            {/* <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 p-2"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button> */}
{/* 
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 p-2"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button> */}

                {/* Volume Slider */}
                {/* <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 accent-white bg-gray-400 rounded-full mx-2"
                  style={{ verticalAlign: 'middle' }}
                  aria-label="Volume"
                /> */}

                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetVideo}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div> */}

              {/* <div className="flex items-center space-x-4"> */}
                {/* <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span> */}

                {/* Fit/Fill Toggle Button */}
                {/* {isFullscreen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFitMode}
                    className="text-white hover:bg-white/20 p-2"
                    aria-label={fitMode === 'contain' ? 'Fill screen' : 'Fit to screen'}
                  >
                    {fitMode === 'contain' ? <MoveDiagonal className="w-5 h-5" /> : <MoveDiagonal2 className="w-5 h-5" />}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Maximize2 className="w-5 h-5" />
                </Button> */}
              {/* </div> */}
            {/* </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
