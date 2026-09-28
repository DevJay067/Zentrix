import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Connecting to MST Testnet...");

  useEffect(() => {
    const messages = [
      { at: 0, text: "Connecting to MST Testnet..." },
      { at: 700, text: "Loading escrow contracts..." },
      { at: 1400, text: "Verifying BridgeKey provider..." },
      { at: 2000, text: "Initialising Sarvam AI agent..." },
    ];

    messages.forEach(({ at, text }) => {
      setTimeout(() => setStatusText(text), at);
    });

    // Progress bar over 2400ms
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / 2400) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 20);

    // Fade-out then fire onComplete
    const holdTimer = setTimeout(() => setPhase("exit"), 2500);
    const doneTimer = setTimeout(() => onComplete(), 2900);

    return () => {
      clearInterval(interval);
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "var(--zx-ink)",
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 0.4s ease-out",
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--zx-primary)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--zx-primary-deep)" }}
        />
      </div>

      {/* Logo mark */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          {/* Outer pulse ring */}
          <div
            className="absolute inset-0 rounded-3xl animate-ping"
            style={{
              background: "transparent",
              border: "2px solid var(--zx-primary)",
              opacity: 0.3,
              animationDuration: "1.5s",
            }}
          />
          {/* Logo box */}
          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--zx-primary-deep), var(--zx-primary))",
              boxShadow: "0 0 60px rgba(216,64,64,0.5)",
            }}
          >
            <span
              className="text-white font-black text-4xl tracking-tight"
              style={{ fontFeatureSettings: '"ss01"' }}
            >
              Z
            </span>
          </div>
        </div>

        {/* Wordmark */}
        <div className="text-center space-y-1">
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ color: "var(--zx-cream)" }}
          >
            Zentrix
          </h1>
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--zx-muted)" }}
          >
            Decentralised Freelance · MST Blockchain
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 space-y-3">
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--zx-primary-deep), var(--zx-primary))",
                boxShadow: "0 0 8px var(--zx-primary)",
              }}
            />
          </div>

          {/* Status text */}
          <p
            className="text-center text-xs font-medium"
            style={{ color: "var(--zx-muted)" }}
          >
            {statusText}
          </p>
        </div>

        {/* Chain badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--zx-cream)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--zx-success)" }}
          />
          <span>Chain ID 91562037 · Testnet</span>
        </div>
      </div>
    </div>
  );
};
