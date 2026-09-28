import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState<number>(12);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  const statusPhases = [
    "INITIALIZING PROTOCOL // MST CHAIN 91562037",
    "RESOLVING NON-CUSTODIAL ESCROW REGISTRY",
    "ESTABLISHING SARVAM-30B AI AGENT PIPELINE",
    "VERIFIED // ENTERING ZENTRIX MARKETPLACE",
  ];

  useEffect(() => {
    // 1.5-second (1500ms) total timeline
    const startTime = Date.now();
    const duration = 1250; // ticker stops at 1250ms

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setPercent(progress);

      if (elapsed < 350) {
        setPhaseIndex(0);
      } else if (elapsed < 700) {
        setPhaseIndex(1);
      } else if (elapsed < 1100) {
        setPhaseIndex(2);
      } else {
        setPhaseIndex(3);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 25);

    // Fade out at 1350ms, call onComplete at 1500ms
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1350);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col justify-between p-6 sm:p-12 font-mono select-none"
      style={{
        background: "var(--zx-ink)",
        color: "var(--zx-cream)",
        opacity: isFading ? 0 : 1,
        transition: "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: isFading ? "none" : "all",
      }}
    >
      {/* Top Meta Line */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs tracking-widest uppercase opacity-60">
        <span>Zentrix Protocol</span>
        <span>MST Testnet · 91562037</span>
      </div>

      {/* Center Minimal Typography */}
      <div className="space-y-4 max-w-xl">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--zx-primary)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--zx-primary)] animate-pulse" />
          <span>System Boot</span>
        </div>

        <div className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
          {statusPhases[phaseIndex]}
        </div>

        {/* Minimal Thin Progress Track */}
        <div
          className="w-48 h-[1px] relative overflow-hidden"
          style={{ background: "rgba(236, 220, 191, 0.15)" }}
        >
          <div
            className="h-full transition-all duration-75"
            style={{
              width: `${percent}%`,
              background: "var(--zx-primary)",
            }}
          />
        </div>
      </div>

      {/* Bottom Counter & Index */}
      <div className="flex items-end justify-between text-xs tracking-wider">
        <span className="opacity-40 text-[10px] sm:text-xs">
          MST BUILDATHON 2026 // BENGALURU
        </span>
        <span className="text-xl sm:text-3xl font-black font-mono" style={{ color: "var(--zx-cream)" }}>
          {percent < 10 ? `00${percent}` : percent < 100 ? `0${percent}` : percent}%
        </span>
      </div>
    </div>
  );
};
