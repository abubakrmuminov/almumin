import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Loader2,
} from "lucide-react";

interface GlobalAudioPlayerProps {
  audioUrl: string | null;
  title: string;
  subtitle: string;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const GlobalAudioPlayer: React.FC<GlobalAudioPlayerProps> = ({
  audioUrl,
  title,
  subtitle,
  onClose,
  onNext,
  onPrevious,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setIsLoading(true);

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      setIsLoading(false);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      if (onNext) onNext();
    });

    audio.addEventListener("error", () => {
      setIsLoading(false);
    });

    return () => {
      audio.pause();
      audio.remove();
    };
  }, [audioUrl, onNext]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!audioUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl"
      >
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between flex-1 gap-4">
              <div className="flex items-center flex-1 min-w-0 gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{
                      duration: 3,
                      repeat: isPlaying ? Infinity : 0,
                      ease: "linear",
                    }}
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {title}
                  </h4>
                  <p className="text-xs text-indigo-200 truncate">{subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onPrevious && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onPrevious}
                    className="p-2 text-white transition rounded-lg hover:bg-white/10"
                  >
                    <SkipBack className="w-4 h-4" />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="flex items-center justify-center w-10 h-10 text-white transition rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </motion.button>

                {onNext && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onNext}
                    className="p-2 text-white transition rounded-lg hover:bg-white/10"
                  >
                    <SkipForward className="w-4 h-4" />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-white transition rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center flex-1 gap-3">
              <span className="text-xs font-medium text-indigo-200 shrink-0">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(139, 92, 246) ${
                    (currentTime / duration) * 100
                  }%, rgba(255,255,255,0.2) ${
                    (currentTime / duration) * 100
                  }%, rgba(255,255,255,0.2) 100%)`,
                }}
              />

              <span className="text-xs font-medium text-indigo-200 shrink-0">
                {formatTime(duration)}
              </span>

              <div className="items-center hidden gap-2 sm:flex">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-2 text-white transition rounded-lg hover:bg-white/10"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </motion.button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(139, 92, 246) ${
                      (isMuted ? 0 : volume) * 100
                    }%, rgba(255,255,255,0.2) ${
                      (isMuted ? 0 : volume) * 100
                    }%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
