import React, { useState } from "react";
import {
  Wallet,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Shield,
  ArrowRight,
  UserCheck,
  Briefcase,
} from "lucide-react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (type: "bridgekey" | "injected" | "demo-client" | "demo-freelancer") => Promise<string | null>;
  isConnecting: boolean;
  hasExtension: boolean;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
  hasExtension,
}) => {
  const [connectingType, setConnectingType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = async (type: "bridgekey" | "injected" | "demo-client" | "demo-freelancer") => {
    setConnectingType(type);
    setErrorMessage(null);
    try {
      const res = await onConnect(type);
      if (res) {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to connect wallet.");
    } finally {
      setConnectingType(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(42, 15, 15, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isConnecting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
          boxShadow: "0 25px 60px -15px rgba(42, 15, 15, 0.4)",
        }}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-30 pointer-events-none blur-3xl"
          style={{ background: "var(--zx-primary)" }}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--zx-success)" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--zx-primary-deep)" }}
              >
                MST Blockchain Testnet (91562037)
              </span>
            </div>
            <h2 className="text-2xl font-black" style={{ color: "var(--zx-ink)" }}>
              Connect Your Wallet
            </h2>
            <p className="text-xs" style={{ color: "var(--zx-muted)" }}>
              Choose BridgeKey or test instantly with a prefunded testnet account.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isConnecting}
            className="p-2 rounded-xl transition-colors hover:scale-105"
            style={{
              background: "var(--zx-cream)",
              border: "1px solid var(--zx-border)",
              color: "var(--zx-muted)",
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div
            className="p-3.5 rounded-2xl flex items-start gap-2.5 text-xs"
            style={{
              background: "color-mix(in srgb, var(--zx-danger) 12%, transparent)",
              border: "1px solid var(--zx-danger)",
              color: "var(--zx-danger)",
            }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Connection Options List */}
        <div className="space-y-3 relative z-10">
          {/* 1. BridgeKey Extension (Primary) */}
          <button
            type="button"
            onClick={() => handleSelect("bridgekey")}
            disabled={isConnecting}
            className="w-full p-4 rounded-2xl flex items-center justify-between gap-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99] group"
            style={{
              background: "var(--zx-cream)",
              border: "1.5px solid var(--zx-primary)",
              boxShadow: "0 4px 16px -4px rgba(216, 64, 64, 0.15)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}
              >
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: "var(--zx-ink)" }}>
                    BridgeKey Extension
                  </span>
                  <span
                    className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                    style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}
                  >
                    Recommended
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--zx-muted)" }}>
                  Native wallet for MST Blockchain & BridgeKey ecosystem
                </p>
              </div>
            </div>

            {connectingType === "bridgekey" ? (
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--zx-primary-deep)" }} />
            ) : (
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: "var(--zx-primary-deep)" }} />
            )}
          </button>

          {/* 2. Injected EVM Wallet (MetaMask / Rabby / Brave) */}
          <button
            type="button"
            onClick={() => handleSelect("injected")}
            disabled={isConnecting}
            className="w-full p-4 rounded-2xl flex items-center justify-between gap-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99] group"
            style={{
              background: "var(--zx-cream)",
              border: "1px solid var(--zx-border)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }}
              >
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-sm" style={{ color: "var(--zx-ink)" }}>
                  Browser EVM Wallet
                </span>
                <p className="text-xs mt-0.5" style={{ color: "var(--zx-muted)" }}>
                  MetaMask, Rabby, Brave, or any EIP-1193 provider
                </p>
              </div>
            </div>

            {connectingType === "injected" ? (
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--zx-primary-deep)" }} />
            ) : (
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: "var(--zx-muted)" }} />
            )}
          </button>
        </div>

        {/* ── 1-Click Instant Demo Wallets (For Fast Testing & Evaluation) ── */}
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{
            background: "var(--zx-surface-alt)",
            border: "1px dashed var(--zx-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: "var(--zx-warning)" }} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--zx-ink)" }}>
                Instant Testnet Demo Mode
              </span>
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "var(--zx-cream)", color: "var(--zx-muted)" }}
            >
              No Extension Needed
            </span>
          </div>
          <p className="text-[11px]" style={{ color: "var(--zx-muted)" }}>
            Evaluate the live on-chain escrow & Sarvam AI matchmaking immediately with pre-funded MST Testnet accounts:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSelect("demo-client")}
              disabled={isConnecting}
              className="p-3 rounded-xl flex items-center gap-2.5 transition-all hover:scale-[1.02] text-left"
              style={{
                background: "var(--zx-cream)",
                border: "1px solid var(--zx-border)",
              }}
            >
              <Briefcase className="w-4 h-4 shrink-0" style={{ color: "var(--zx-primary-deep)" }} />
              <div className="truncate">
                <div className="text-xs font-bold" style={{ color: "var(--zx-ink)" }}>
                  Demo Client
                </div>
                <div className="text-[10px] font-mono truncate" style={{ color: "var(--zx-muted)" }}>
                  0x7FC1...1Cad · 0.5 tMSTC
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect("demo-freelancer")}
              disabled={isConnecting}
              className="p-3 rounded-xl flex items-center gap-2.5 transition-all hover:scale-[1.02] text-left"
              style={{
                background: "var(--zx-cream)",
                border: "1px solid var(--zx-border)",
              }}
            >
              <UserCheck className="w-4 h-4 shrink-0" style={{ color: "var(--zx-success)" }} />
              <div className="truncate">
                <div className="text-xs font-bold" style={{ color: "var(--zx-ink)" }}>
                  Demo Freelancer
                </div>
                <div className="text-[10px] font-mono truncate" style={{ color: "var(--zx-muted)" }}>
                  0x8cA0...Ec9e · 0.5 tMSTC
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Extension Installation link */}
        <div
          className="flex items-center justify-between text-xs pt-2"
          style={{ borderTop: "1px solid var(--zx-border)" }}
        >
          <span style={{ color: "var(--zx-muted)" }}>
            Don't have BridgeKey installed?
          </span>
          <a
            href="https://chromewebstore.google.com/detail/bridgekey/bfjojdcfenehemjgjlepdjomkpginlkg"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-bold hover:underline"
            style={{ color: "var(--zx-primary-deep)" }}
          >
            <span>Chrome Web Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
