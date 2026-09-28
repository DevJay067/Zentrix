import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import {
  Bot,
  Send,
  Zap,
  AlertCircle,
  User,
  RefreshCw,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  creditsLeft?: number;
}

/* ─── Animated loading dots ─────────────────────────────────────────────── */
const LoadingDots: React.FC = () => (
  <span className="inline-flex items-center gap-1" aria-label="AI is thinking">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "var(--zx-muted)",
          display: "inline-block",
          animation: `zx-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </span>
);

/* ─── Example prompts per role ───────────────────────────────────────────── */
const CLIENT_PROMPTS = [
  "Find me a senior Solidity developer experienced with OpenZeppelin v5.",
  "Who has built frontend apps with BridgeKey wallet integration?",
  "Recommend auditors for invariant fuzz testing and Slither reports.",
];

const FREELANCER_PROMPTS = [
  "What gigs match my skills in smart contracts and DeFi?",
  "Show open frontend projects requiring React and TypeScript.",
  "Find gigs with milestone-based escrow paying more than 2 tMSTC.",
];

export const AgentPage: React.FC = () => {
  const { profile, currentRole } = useAuth();
  const { address, isConnected, connectWallet } = useWallet();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number>(2);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const samplePrompts = currentRole === "client" ? CLIENT_PROMPTS : FREELANCER_PROMPTS;

  /* Auto-scroll to bottom when messages change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    setErrorBanner(null);

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
          walletAddress: address || "anonymous",
          role: currentRole || "freelancer",
          tier: 0,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setPaywallOpen(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ Daily query quota exhausted (2/2 for Free Tier). Reset happens at midnight IST. Upgrade your ZentrixPass to unlock more queries.",
            isError: true,
          },
        ]);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || `Agent request failed (${res.status})`);
      }

      if (typeof data.creditsLeft === "number") {
        setCreditsLeft(data.creditsLeft);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No response generated.",
          creditsLeft: data.creditsLeft,
        },
      ]);
    } catch (err: any) {
      const errMsg = err.message || "Failed to contact Sarvam AI service.";
      setErrorBanner(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errMsg,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Dot-bounce keyframe injected inline so it's co-located */}
      <style>{`
        @keyframes zx-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-4">

        {/* ─── Top Banner ─── */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4"
          style={{
            background: "var(--zx-surface)",
            border: "1px solid var(--zx-border)",
            borderRadius: "1rem",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: "var(--zx-primary-deep)", borderRadius: "0.75rem" }}
            >
              <Bot className="w-5 h-5" style={{ color: "var(--zx-cream)" }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[var(--zx-ink)]">Zentrix AI Agent</h1>
              <p className="text-xs text-[var(--zx-muted)]">
                Powered by Sarvam 30B ·{" "}
                <span className="font-semibold text-[var(--zx-primary-deep)] uppercase">
                  {currentRole || "Freelancer"}
                </span>
                {" "}· Server-side only
              </p>
            </div>
          </div>

          {/* Credit meter */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-[var(--zx-ink)]">{creditsLeft} Credits Left</div>
              <div className="text-[10px] text-[var(--zx-muted)]">Resets Midnight IST</div>
            </div>
            <Link to="/pricing" className="btn-secondary text-xs py-1.5 px-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Upgrade Pass</span>
            </Link>
          </div>
        </div>

        {/* ─── Error Banner ─── */}
        {errorBanner && (
          <div
            className="flex items-start gap-2 px-4 py-3 text-sm"
            style={{
              background: "color-mix(in srgb, var(--zx-danger) 10%, transparent)",
              border: "1px solid var(--zx-danger)",
              borderRadius: "0.75rem",
              color: "var(--zx-danger)",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorBanner}</span>
            <button
              onClick={() => setErrorBanner(null)}
              className="ml-auto text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* ─── Chat Thread ─── */}
        <div
          className="flex flex-col"
          style={{
            background: "var(--zx-surface)",
            border: "1px solid var(--zx-border)",
            borderRadius: "1rem",
            minHeight: "420px",
            maxHeight: "540px",
            overflowY: "auto",
            padding: "1.25rem",
            gap: "1rem",
          }}
        >
          {/* ── Empty state ── */}
          {isEmpty && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center py-8">
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{ background: "var(--zx-surface-alt)", borderRadius: "1.25rem" }}
              >
                <Bot className="w-8 h-8" style={{ color: "var(--zx-primary-deep)" }} />
              </div>
              <div>
                <p className="text-base font-bold text-[var(--zx-ink)]">Ask Zentrix AI</p>
                <p className="text-sm text-[var(--zx-muted)] mt-1 max-w-xs">
                  I can match gigs, evaluate requirements, and surface verified talent — all server-side and privacy-preserving.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-md">
                <p className="text-[11px] font-semibold text-[var(--zx-muted)] uppercase tracking-wider">
                  Try an example
                </p>
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="text-xs p-3 text-left transition-colors"
                    style={{
                      background: "var(--zx-cream)",
                      border: "1px solid var(--zx-border)",
                      borderRadius: "0.75rem",
                      color: "var(--zx-ink)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--zx-surface-alt)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--zx-cream)")
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Messages ── */}
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              style={{ maxWidth: "88%", alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: m.role === "user" ? "var(--zx-primary-deep)" : "var(--zx-surface-alt)",
                  color: m.role === "user" ? "var(--zx-cream)" : "var(--zx-primary-deep)",
                }}
              >
                {m.role === "user"
                  ? <User className="w-3.5 h-3.5" />
                  : <Bot className="w-3.5 h-3.5" />
                }
              </div>

              {/* Bubble */}
              <div
                className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: m.role === "user" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                  background: m.isError
                    ? "color-mix(in srgb, var(--zx-danger) 10%, transparent)"
                    : m.role === "user"
                    ? "var(--zx-primary-deep)"
                    : "var(--zx-cream)",
                  color: m.isError
                    ? "var(--zx-danger)"
                    : m.role === "user"
                    ? "white"
                    : "var(--zx-ink)",
                  border: m.role === "assistant"
                    ? `1px solid ${m.isError ? "var(--zx-danger)" : "var(--zx-border)"}`
                    : "none",
                }}
              >
                {m.isError && <AlertCircle className="w-3.5 h-3.5 inline mr-1 mb-0.5" />}
                {m.content}
              </div>
            </div>
          ))}

          {/* ── Loading indicator ── */}
          {isLoading && (
            <div className="flex items-end gap-2" style={{ maxWidth: "88%", alignSelf: "flex-start" }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }}
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "1rem 1rem 1rem 0.25rem",
                  background: "var(--zx-cream)",
                  border: "1px solid var(--zx-border)",
                }}
              >
                <LoadingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ─── Suggested Prompts (when chat is active) ─── */}
        {!isEmpty && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[var(--zx-muted)] uppercase tracking-wider">
              Suggested Queries
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  disabled={isLoading}
                  className="text-xs p-2 transition-colors disabled:opacity-50"
                  style={{
                    background: "var(--zx-surface)",
                    border: "1px solid var(--zx-border)",
                    borderRadius: "0.625rem",
                    color: "var(--zx-ink)",
                    textAlign: "left",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Powered-by label ─── */}
        <p className="text-center text-[10px] text-[var(--zx-muted)]">
          Powered by <span className="font-semibold">Sarvam 30B</span> · Server-side only · Zero-PII
        </p>

        {/* ─── Input Bar ─── */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask Sarvam AI to match gigs or evaluate requirements…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{
              background: "var(--zx-surface)",
              border: "1px solid var(--zx-border)",
              borderRadius: "0.75rem",
              color: "var(--zx-ink)",
              padding: "0.875rem 1rem",
              outline: "none",
              flex: 1,
              fontSize: "0.8125rem",
              transition: "box-shadow 0.15s",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 0 2px var(--zx-focus-ring)")
            }
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary py-3.5 px-5 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        {/* ─── Paywall Modal ─── */}
        {paywallOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(42, 15, 15, 0.45)", backdropFilter: "blur(4px)" }}
          >
            <div
              className="w-full max-w-md p-6 text-center space-y-4"
              style={{
                background: "var(--zx-surface)",
                border: "1px solid var(--zx-border)",
                borderRadius: "1.25rem",
                boxShadow: "0 25px 50px -12px rgba(42, 15, 15, 0.25)",
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center mx-auto"
                style={{ background: "var(--zx-surface-alt)", borderRadius: "9999px" }}
              >
                <Zap className="w-6 h-6 text-[var(--zx-primary-deep)]" />
              </div>
              <h3 className="text-xl font-extrabold text-[var(--zx-ink)]">Daily Free Limit Reached</h3>
              <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
                You have used your 2 free queries for today. Upgrade with a ZentrixPass NFT on MST
                Testnet to unlock up to 15 queries daily.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button onClick={() => setPaywallOpen(false)} className="btn-secondary text-xs">
                  Close
                </button>
                <Link to="/pricing" onClick={() => setPaywallOpen(false)} className="btn-primary text-xs">
                  View Pass Tiers
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
