import React, { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  isActive: boolean; // управляется из AyahCard
  onStop?: () => void; // опционально
}

export default function AudioPlayer({ src, isActive, onStop }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.loop = isLoop;
  }, [volume, isLoop]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isActive) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.currentTime = 0;
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onStop?.();
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleLoop = () => setIsLoop(!isLoop);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime / audioRef.current.duration);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={toggleLoop}>Loop: {isLoop ? "On" : "Off"}</button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
      <progress className="w-full" value={progress} max={1}></progress>
      <audio ref={audioRef} src={src} />
    </div>
  );
}
