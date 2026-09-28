import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Bot,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  ExternalLink,
  TrendingUp,
  Globe,
} from "lucide-react";

// Animated counter hook
function useCountUp(target: number, duration = 1200, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

export const HomePage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const gigs = useCountUp(247, 1400, visible);
  const paid = useCountUp(9180, 1600, visible);
  const users = useCountUp(512, 1200, visible);

  return (
    <div className="space-y-12">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] px-8 py-16 md:py-24 text-center space-y-8"
        style={{
          background: "linear-gradient(135deg, var(--zx-ink) 0%, var(--zx-primary-deep) 60%, var(--zx-primary) 100%)",
        }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full blur-3xl opacity-30"
            style={{ background: "var(--zx-primary)" }} />
        </div>

        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "var(--zx-cream)",
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--zx-success)" }} />
            Live on MST Blockchain · Chain 91562037
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]"
            style={{ color: "var(--zx-cream)" }}>
            Freelance that lives<br />
            <span style={{ color: "var(--zx-primary)" }}>on-chain.</span>
          </h1>

          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: "rgba(236,220,191,0.7)" }}>
            Milestone escrow locked in a smart contract. Sarvam AI finds your best match.
            Reputation minted as soulbound NFTs. Zero platform commission.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/marketplace"
              className="inline-flex items-center gap-2 font-bold rounded-2xl px-6 py-3 text-sm shadow-lg transition-all hover:scale-105"
              style={{
                background: "var(--zx-primary)",
                color: "var(--zx-cream)",
                boxShadow: "0 0 24px rgba(216,64,64,0.45)",
              }}>
              Explore Gigs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/agent"
              className="inline-flex items-center gap-2 font-semibold rounded-2xl px-6 py-3 text-sm transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "var(--zx-cream)",
              }}>
              <Bot className="w-4 h-4" /> AI Agent
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bento Stats + Features ─────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {/* Stat 1 — large span */}
          <div className="col-span-2 rounded-3xl p-6 flex flex-col justify-between min-h-[140px]"
            style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--zx-muted)" }}>
              Active Gigs on Testnet
            </div>
            <div>
              <div className="text-5xl font-black font-mono" style={{ color: "var(--zx-primary-deep)" }}>
                {gigs}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--zx-muted)" }}>
                open projects · escrow-backed
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="rounded-3xl p-6 flex flex-col justify-between min-h-[140px]"
            style={{ background: "var(--zx-ink)", border: "1px solid var(--zx-border)" }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(236,220,191,0.5)" }}>
              tMSTC Paid Out
            </div>
            <div>
              <div className="text-4xl font-black font-mono" style={{ color: "var(--zx-cream)" }}>
                {paid.toLocaleString()}
              </div>
              <div className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--zx-primary)" }}>
                <TrendingUp className="w-3 h-3" /> testnet
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="rounded-3xl p-6 flex flex-col justify-between min-h-[140px]"
            style={{ background: "var(--zx-surface-alt)", border: "1px solid var(--zx-border)" }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--zx-muted)" }}>
              Verified Users
            </div>
            <div>
              <div className="text-4xl font-black font-mono" style={{ color: "var(--zx-ink)" }}>
                {users}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--zx-muted)" }}>
                Firebase + BridgeKey bound
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature bento grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Escrow card — tall */}
          <div className="md:row-span-2 rounded-3xl p-7 flex flex-col justify-between gap-6"
            style={{
              background: "linear-gradient(160deg, var(--zx-ink) 0%, var(--zx-primary-deep) 100%)",
              border: "1px solid rgba(216,64,64,0.2)",
            }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(216,64,64,0.15)" }}>
              <Lock className="w-6 h-6" style={{ color: "var(--zx-primary)" }} />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold" style={{ color: "var(--zx-cream)" }}>
                Trust-Minimized Escrow
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(236,220,191,0.6)" }}>
                Client deposits tMSTC into a non-custodial smart contract. Funds release per
                milestone approval, or auto-release after 72h if client is inactive.
              </p>
            </div>
            <ul className="space-y-2.5">
              {["Pull-payment pattern", "Negotiable deadline consensus", "Fair arbiter resolution"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs"
                  style={{ color: "rgba(236,220,191,0.7)" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--zx-success)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold"
              style={{ color: "var(--zx-primary)" }}>
              Browse Escrow Gigs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* AI Matching */}
          <div className="rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--zx-surface-alt)" }}>
              <Bot className="w-5 h-5" style={{ color: "var(--zx-primary-deep)" }} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: "var(--zx-ink)" }}>Sarvam AI Matchmaker</h3>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--zx-muted)" }}>
                Sarvam 30B evaluates skills, budgets, and delivery history — server-side only,
                zero PII in output. Pass NFT tiers control query credits.
              </p>
            </div>
            <Link to="/agent" className="inline-flex items-center gap-1 text-xs font-bold mt-auto"
              style={{ color: "var(--zx-primary-deep)" }}>
              Try AI Agent <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Soulbound creds */}
          <div className="rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--zx-surface-alt)" }}>
              <Award className="w-5 h-5" style={{ color: "var(--zx-primary-deep)" }} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: "var(--zx-ink)" }}>Soulbound Credentials</h3>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--zx-muted)" }}>
                Completing gigs mints non-transferable ERC-721 reputation NFTs. Cryptographic
                proof of work — can&apos;t be purchased, faked, or transferred.
              </p>
            </div>
            <Link to="/pricing" className="inline-flex items-center gap-1 text-xs font-bold mt-auto"
              style={{ color: "var(--zx-primary-deep)" }}>
              View Pass Tiers <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Zero commission pill + chain info */}
          <div className="rounded-3xl p-6 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: "var(--zx-surface-alt)", border: "1px solid var(--zx-border)" }}>
            <div>
              <div className="text-3xl font-black" style={{ color: "var(--zx-primary-deep)" }}>0%</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: "var(--zx-muted)" }}>Platform Commission</div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold"
              style={{
                background: "var(--zx-surface)",
                border: "1px solid var(--zx-border)",
                color: "var(--zx-ink)",
              }}>
              <Globe className="w-3.5 h-3.5" style={{ color: "var(--zx-primary)" }} />
              <span>MST Testnet</span>
              <a href="https://testnet.mstscan.com" target="_blank" rel="noreferrer">
                <ExternalLink className="w-3 h-3" style={{ color: "var(--zx-muted)" }} />
              </a>
            </div>
          </div>

          {/* ZentrixPass */}
          <div className="rounded-3xl p-6 flex flex-col gap-3"
            style={{
              background: "linear-gradient(135deg, var(--zx-primary-deep) 0%, var(--zx-primary) 100%)",
              border: "none",
            }}>
            <Layers className="w-6 h-6 text-white opacity-80" />
            <div>
              <h3 className="font-bold text-base text-white">ZentrixPass NFT</h3>
              <p className="text-xs mt-1 text-white opacity-70 leading-relaxed">
                Soulbound access pass granting daily AI query credits. Three tiers: Scout, Builder, Architect.
              </p>
            </div>
            <Link to="/pricing"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl w-fit"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
              Mint Pass <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Golden Path lifecycle ──────────────────────────────────── */}
      <section className="rounded-3xl p-8 space-y-6"
        style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}>
        <div>
          <h2 className="text-2xl font-black" style={{ color: "var(--zx-ink)" }}>
            The Golden Path
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--zx-muted)" }}>
            From contract creation to milestone payout — end-to-end on MST Testnet.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: "01", label: "Post Gig", desc: "Client defines milestones, amounts, and acceptance criteria on Firestore." },
            { step: "02", label: "AI Match", desc: "Sarvam AI recommends top talent. Client assigns and deposits tMSTC to escrow." },
            { step: "03", label: "Deliver", desc: "Freelancer submits evidence CID. Client reviews within 72h or funds auto-release." },
            { step: "04", label: "Payout", desc: "Funds withdraw to freelancer. Final milestone mints a Soulbound Reputation NFT." },
          ].map(({ step, label, desc }) => (
            <div key={step} className="rounded-2xl p-5 space-y-2 group hover:scale-[1.02] transition-transform"
              style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}>
              <div className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--zx-primary-deep)" }}>
                Step {step}
              </div>
              <div className="font-bold text-sm" style={{ color: "var(--zx-ink)" }}>{label}</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--zx-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center pt-2">
          <Link to="/marketplace"
            className="inline-flex items-center gap-2 font-bold rounded-2xl px-6 py-3 text-sm transition-all hover:scale-105"
            style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}>
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────────── */}
      <section className="flex flex-wrap items-center justify-center gap-6 py-4">
        {[
          { icon: <ShieldCheck className="w-4 h-4" />, text: "Non-custodial escrow" },
          { icon: <Lock className="w-4 h-4" />, text: "Checks-effects-interactions" },
          { icon: <Zap className="w-4 h-4" />, text: "72h auto-release" },
          { icon: <Award className="w-4 h-4" />, text: "Soulbound reputation" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs font-semibold"
            style={{ color: "var(--zx-muted)" }}>
            <span style={{ color: "var(--zx-primary-deep)" }}>{icon}</span>
            {text}
          </div>
        ))}
      </section>
    </div>
  );
};
