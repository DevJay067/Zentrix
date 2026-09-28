import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  User,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  creditsLeft?: number;
}

export const AgentPage: React.FC = () => {
  const { profile, currentRole } = useAuth();
  const { address, isConnected, connectWallet } = useWallet();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am Zentrix AI, powered by Sarvam 30B. I can evaluate requirements, query open gigs, and match verified talent on MST Blockchain with strict zero-PII privacy. What are you looking to accomplish today?`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number>(2);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const samplePrompts =
    currentRole === "client"
      ? [
          "Find senior Solidity engineers experienced with OpenZeppelin v5 and escrow contracts.",
          "Who has built frontend apps with BridgeKey wallet integration?",
          "Recommend auditors for invariant fuzz testing and Slither reports.",
        ]
      : [
          "Show open smart contract and DeFi gigs paying more than 2 tMSTC.",
          "Find frontend projects requiring Next.js and TypeScript.",
          "What gigs have a 72-hour review window and milestone-based escrow?",
        ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          walletAddress: address || "anonymous",
          role: currentRole || "freelancer",
          tier: 0, // In demo, tier 0 gives 2 queries/day
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setPaywallOpen(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ Daily query quota exhausted (2/2 for Free Tier). Reset happens at midnight IST. You can purchase a ZentrixPass NFT to unlock 5 queries/day (Pro) or 15 queries/day (Enterprise).`,
          },
        ]);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Agent request failed");
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err.message || "Failed to contact Sarvam AI service."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--zx-surface)] border border-[var(--zx-border)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--zx-primary-deep)] text-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-[var(--zx-cream)]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[var(--zx-ink)]">Zentrix AI Mode</h1>
            <p className="text-xs text-[var(--zx-muted)]">
              Powered by Sarvam 30B · Role:{" "}
              <span className="font-semibold text-[var(--zx-primary-deep)] uppercase">
                {currentRole || "Freelancer"}
              </span>
            </p>
          </div>
        </div>

        {/* Credit Meter Pill */}
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

      {/* Chat Thread */}
      <div className="card-surface p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4 flex flex-col">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-[85%] ${
              m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user"
                  ? "bg-[var(--zx-primary-deep)] text-white"
                  : "bg-[var(--zx-surface-alt)] text-[var(--zx-primary-deep)]"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--zx-primary-deep)] text-white rounded-tr-none shadow-xs"
                  : "bg-[var(--zx-cream)] border border-[var(--zx-border)] text-[var(--zx-ink)] rounded-tl-none whitespace-pre-wrap"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-[var(--zx-surface-alt)] text-[var(--zx-primary-deep)] flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-muted)]">
              Sarvam AI is analyzing query and querying marketplace tools...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-[var(--zx-muted)] uppercase tracking-wider">
          Suggested Queries
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-xs p-2 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] text-[var(--zx-ink)] hover:bg-[var(--zx-surface-alt)] text-left transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask Sarvam AI to match gigs or evaluate requirements..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 p-3.5 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] text-xs sm:text-sm text-[var(--zx-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--zx-primary-deep)]"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary py-3.5 px-6 shadow-sm disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      {/* Paywall Modal */}
      {paywallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[var(--zx-surface)] border border-[var(--zx-border)] shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--zx-surface-alt)] text-[var(--zx-primary-deep)] flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[var(--zx-ink)]">Daily Free Limit Reached</h3>
            <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
              You have used your 2 free queries for today. Upgrade your wallet with a ZentrixPass NFT on MST Testnet to
              get up to 15 queries daily!
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
  );
};
