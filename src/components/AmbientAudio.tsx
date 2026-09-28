import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const AmbientAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/aud.mp3");
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    // Check if user previously enabled audio
    const savedAudio = localStorage.getItem("zx_ambient_audio");
    if (savedAudio === "true") {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        // Browser autoplay blocked until user interacts
        setIsPlaying(false);
      });
    }

    // Auto-enable on first user click if desired
    const handleFirstGesture = () => {
      if (localStorage.getItem("zx_ambient_audio") !== "false" && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          localStorage.setItem("zx_ambient_audio", "true");
        }).catch(() => {});
      }
      window.removeEventListener("pointerdown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture);

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem("zx_ambient_audio", "false");
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        localStorage.setItem("zx_ambient_audio", "true");
      }).catch((err) => {
        console.warn("Audio playback error:", err);
      });
    }
  };

  return (
    <button
      onClick={toggleAudio}
      title={isPlaying ? "Mute ambient audio" : "Play ambient audio"}
      aria-label="Toggle ambient soundtrack"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all hover:scale-105 active:scale-95 group"
      style={{
        background: isPlaying ? "var(--zx-surface-alt)" : "var(--zx-surface)",
        border: "1px solid var(--zx-border)",
        color: isPlaying ? "var(--zx-primary-deep)" : "var(--zx-muted)",
      }}
    >
      {/* Equalizer Waveform Indicator */}
      <div className="flex items-end gap-0.5 h-3 w-3.5">
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${isPlaying ? "animate-pulse" : "h-1"}`}
          style={{
            height: isPlaying ? "100%" : "30%",
            background: "var(--zx-primary-deep)",
            animationDelay: "0ms",
          }}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${isPlaying ? "animate-pulse" : "h-2"}`}
          style={{
            height: isPlaying ? "70%" : "50%",
            background: "var(--zx-primary-deep)",
            animationDelay: "150ms",
          }}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${isPlaying ? "animate-pulse" : "h-1.5"}`}
          style={{
            height: isPlaying ? "90%" : "40%",
            background: "var(--zx-primary-deep)",
            animationDelay: "300ms",
          }}
        />
      </div>

      <span className="font-semibold text-[11px] tracking-wider uppercase">
        {isPlaying ? "Sound: On" : "Sound: Off"}
      </span>
    </button>
  );
};
