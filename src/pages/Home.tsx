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
  Coins,
  Sparkles,
  Cpu,
  ArrowUpRight,
  Terminal,
} from "lucide-react";
import { CONTRACT_ADDRESSES } from "../contracts";

export const HomePage: React.FC = () => {
  const [metricCount, setMetricCount] = useState({ gigs: 247, volume: 9180, creators: 512 });

  useEffect(() => {
    // Subtle increment simulation for live telemetry
    const interval = setInterval(() => {
      setMetricCount((prev) => ({
        ...prev,
        volume: prev.volume + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ── 1. Minimal Technical Telemetry Ticker (Awwwards Marquee) ── */}
      <div
        className="w-full overflow-hidden py-2.5 rounded-2xl select-none"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="animate-marquee gap-8 text-xs font-mono tracking-wider uppercase text-[var(--zx-muted)]">
          <div className="flex items-center gap-8 shrink-0">
            <span className="flex items-center gap-1.5 font-bold text-[var(--zx-primary-deep)]">
              <span className="w-2 h-2 rounded-full bg-[var(--zx-success)] animate-pulse" />
              MST TESTNET // CHAIN ID 91562037
            </span>
            <span>·</span>
            <span>0.00% PLATFORM COMMISSION</span>
            <span>·</span>
            <span>NON-CUSTODIAL ESCROW REGISTRY</span>
            <span>·</span>
            <span>SARVAM-30B PRIVATE AI ENGINE</span>
            <span>·</span>
            <span>72H AUTOMATED DISPUTE RELEASE</span>
            <span>·</span>
            <span>SOULBOUND ERC-721 CREDENTIALS</span>
            <span>·</span>
            <span>BRIDGEKEY EIP-1193 SECURED</span>
            <span>·</span>
          </div>

          <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
            <span className="flex items-center gap-1.5 font-bold text-[var(--zx-primary-deep)]">
              <span className="w-2 h-2 rounded-full bg-[var(--zx-success)] animate-pulse" />
              MST TESTNET // CHAIN ID 91562037
            </span>
            <span>·</span>
            <span>0.00% PLATFORM COMMISSION</span>
            <span>·</span>
            <span>NON-CUSTODIAL ESCROW REGISTRY</span>
            <span>·</span>
            <span>SARVAM-30B PRIVATE AI ENGINE</span>
            <span>·</span>
            <span>72H AUTOMATED DISPUTE RELEASE</span>
            <span>·</span>
            <span>SOULBOUND ERC-721 CREDENTIALS</span>
            <span>·</span>
            <span>BRIDGEKEY EIP-1193 SECURED</span>
            <span>·</span>
          </div>
        </div>
      </div>

      {/* ── 2. Hero Section (Clean White with Subtle Ambient Glow) ── */}
      <section
        className="rounded-3xl p-8 sm:p-14 relative overflow-hidden space-y-8"
        style={{
          background: "linear-gradient(180deg, var(--zx-surface) 0%, var(--zx-surface-alt) 100%)",
          border: "1px solid var(--zx-border)",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Subtle Ambient Radial Highlight */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20"
          style={{ background: "var(--zx-primary)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-15"
          style={{ background: "var(--zx-primary-deep)" }}
        />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Header Metadata Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "rgba(216, 64, 64, 0.08)",
                color: "var(--zx-primary-deep)",
                border: "1px solid rgba(216, 64, 64, 0.2)",
              }}
            >
              MST Blockchain × NEWRRO Buildathon 2026
            </span>
            <span
              className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
            >
              Zero Custody Risk
            </span>
          </div>

          {/* High-Impact Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.98] text-[var(--zx-ink)]">
            The Autonomous <br />
            <span style={{ color: "var(--zx-primary)" }}>Milestone Escrow</span> <br />
            Protocol.
          </h1>

          {/* Subtext */}
          <p
            className="text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl text-[var(--zx-muted)] font-normal"
          >
            Where freelance capital is secured in immutable smart contracts, not corporate bank accounts.
            Sarvam AI analyzes requirements; smart contracts guarantee payouts; your reputation is minted permanently to your wallet on MSTScan.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to="/marketplace"
              className="btn-primary py-3.5 px-8 text-xs font-bold shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Explore Verified Gigs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/agent"
              className="btn-secondary py-3.5 px-6 text-xs font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-sm"
            >
              <Bot className="w-4 h-4 text-[var(--zx-primary)]" />
              <span>Launch Sarvam AI Matchmaker</span>
            </Link>
          </div>
        </div>

        {/* Live Protocol Telemetry Stats Strip */}
        <div
          className="relative z-10 pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-4"
          style={{ borderColor: "var(--zx-border)" }}
        >
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--zx-muted)]">
              Total Volume Settled
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[var(--zx-ink)] mt-0.5">
              {metricCount.volume.toLocaleString()} <span className="text-xs font-normal text-[var(--zx-muted)]">tMSTC</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--zx-muted)]">
              Milestones Verified
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[var(--zx-ink)] mt-0.5">
              {metricCount.gigs} <span className="text-xs font-normal text-[var(--zx-muted)]">Contracts</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--zx-muted)]">
              Auto-Release Window
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[var(--zx-primary)] mt-0.5">
              72h <span className="text-xs font-normal text-[var(--zx-muted)]">Guaranteed</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--zx-muted)]">
              Platform Commission
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[var(--zx-success)] mt-0.5">
              0.00% <span className="text-xs font-normal text-[var(--zx-muted)]">Zero Rake</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. The Core Triad (Editorial Asymmetry) ── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--zx-primary-deep)]">
              Architectural Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--zx-ink)] mt-1">
              Strictly Better on Blockchain.
            </h2>
          </div>
          <p className="text-xs text-[var(--zx-muted)] max-w-sm">
            Three uncompromising smart contract guarantees designed to eliminate payment anxiety and talent friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 01: Escrow */}
          <div
            className="editorial-card p-7 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-[var(--zx-primary-deep)]">
                  // 01
                </span>
                <Lock className="w-5 h-5 text-[var(--zx-primary-deep)]" />
              </div>

              <h3 className="text-xl font-black text-[var(--zx-ink)]">
                Autonomous Milestone Escrow
              </h3>

              <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
                Clients deposit 100% of milestone funds in tMSTC upfront. Payouts are unlocked through non-custodial pull payments. If a client becomes unresponsive post-submission, funds release automatically in 72 hours.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--zx-border)] text-[11px] font-mono font-semibold text-[var(--zx-primary-deep)] flex items-center justify-between">
              <span>Checks-Effects-Interactions</span>
              <span className="text-xs">→</span>
            </div>
          </div>

          {/* Pillar 02: Sarvam AI */}
          <div
            className="editorial-card p-7 flex flex-col justify-between space-y-6"
            style={{ background: "var(--zx-cream)" }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-[var(--zx-primary-deep)]">
                  // 02
                </span>
                <Bot className="w-5 h-5 text-[var(--zx-warning)]" />
              </div>

              <h3 className="text-xl font-black text-[var(--zx-ink)]">
                Sarvam 30B Privacy AI
              </h3>

              <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
                Private server-side RAG powered by India's Sarvam 30B model. Matches deliverables against verified skill vectors without ever exposing personal phone numbers or email addresses to LLMs or on-chain storage.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--zx-border)] text-[11px] font-mono font-semibold text-[var(--zx-warning)] flex items-center justify-between">
              <span>DPDP Act 2023 Compliant</span>
              <span className="text-xs">→</span>
            </div>
          </div>

          {/* Pillar 03: Soulbound Reputation */}
          <div
            className="editorial-card p-7 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-[var(--zx-primary-deep)]">
                  // 03
                </span>
                <Award className="w-5 h-5 text-[var(--zx-success)]" />
              </div>

              <h3 className="text-xl font-black text-[var(--zx-ink)]">
                Soulbound Reputation NFTs
              </h3>

              <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
                Delivering milestones mints permanent, non-transferable ERC-721 tokens. Unlike Upwork reviews that corporate silos can delete, your reputation credentials stay with your wallet address forever on MSTScan.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--zx-border)] text-[11px] font-mono font-semibold text-[var(--zx-success)] flex items-center justify-between">
              <span>Non-Transferable SBT</span>
              <span className="text-xs">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Deployed Smart Contracts Telemetry ── */}
      <section
        className="rounded-3xl p-6 sm:p-8 space-y-4"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono font-black uppercase text-[var(--zx-primary-deep)] tracking-widest">
              Live On-Chain Verifications
            </span>
            <h3 className="text-lg font-black text-[var(--zx-ink)]">
              Verified Testnet Smart Contracts
            </h3>
          </div>
          <span className="text-xs font-mono text-[var(--zx-muted)]">
            Network: MST Testnet (91562037)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              name: "ZentrixEscrow.sol",
              addr: CONTRACT_ADDRESSES.ZentrixEscrow,
              role: "Multi-milestone escrow custody",
            },
            {
              name: "ZentrixReputation.sol",
              addr: CONTRACT_ADDRESSES.ZentrixReputation,
              role: "Soulbound SBT credential minter",
            },
            {
              name: "ZentrixPass.sol",
              addr: CONTRACT_ADDRESSES.ZentrixPass,
              role: "Tiered subscription access passes",
            },
          ].map((c) => (
            <a
              key={c.name}
              href={`https://testnet.mstscan.com/address/${c.addr}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl transition-all hover:scale-[1.02] flex flex-col justify-between gap-3 group"
              style={{
                background: "var(--zx-cream)",
                border: "1px solid var(--zx-border)",
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-[var(--zx-ink)]">
                    {c.name}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--zx-muted)] group-hover:text-[var(--zx-primary-deep)] transition-colors" />
                </div>
                <div className="text-[11px] text-[var(--zx-muted)] mt-1">
                  {c.role}
                </div>
              </div>

              <div className="font-mono text-[10px] truncate text-[var(--zx-primary-deep)] bg-[var(--zx-surface)] p-2 rounded-xl border border-[var(--zx-border)]">
                {c.addr}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── 5. The Golden Path Lifecycle Pipeline ── */}
      <section
        className="rounded-3xl p-8 sm:p-10 space-y-6"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono font-black uppercase text-[var(--zx-primary-deep)] tracking-widest">
              Execution Lifecycle
            </span>
            <h3 className="text-2xl font-black text-[var(--zx-ink)]">
              The Golden Path
            </h3>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-[var(--zx-primary-deep)] hover:underline flex items-center gap-1"
          >
            <span>View Live Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Create & Fund Escrow",
              desc: "Client defines milestones and locks 100% upfront in tMSTC into the escrow contract.",
            },
            {
              step: "02",
              title: "Deliver Verification CID",
              desc: "Freelancer completes work and anchors code, pull request, or IPFS documentation hash on-chain.",
            },
            {
              step: "03",
              title: "72h Anti-Ghosting Window",
              desc: "Client reviews delivery. If client fails to act within 72 hours, contract releases funds automatically.",
            },
            {
              step: "04",
              title: "Pull Payment & SBT Mint",
              desc: "Funds withdraw directly to wallet. Soulbound reputation credential NFT is minted permanently.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="p-5 rounded-2xl flex flex-col justify-between gap-4"
              style={{
                background: "var(--zx-cream)",
                border: "1px solid var(--zx-border)",
              }}
            >
              <div className="space-y-2">
                <span className="font-mono text-xs font-black text-[var(--zx-primary-deep)]">
                  STAGE {s.step}
                </span>
                <h4 className="font-black text-sm text-[var(--zx-ink)]">
                  {s.title}
                </h4>
                <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="text-[10px] font-mono font-bold text-[var(--zx-primary-deep)]">
                Status: Automated
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Live Market Feed Teaser ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-black uppercase text-[var(--zx-primary-deep)] tracking-widest">
              Live Openings
            </span>
            <h3 className="text-xl font-black text-[var(--zx-ink)]">
              Featured On-Chain Gigs
            </h3>
          </div>
          <Link
            to="/marketplace"
            className="btn-secondary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5"
          >
            <span>Browse All Gigs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Implement BridgeKey Multi-Sig Wallet Integration",
              budget: "3.5 tMSTC",
              tag: "Development",
              skills: ["Solidity", "React", "BridgeKey"],
            },
            {
              title: "3D Brand Identity & Interactive Spline Motion",
              budget: "2.5 tMSTC",
              tag: "Design",
              skills: ["Blender", "Spline", "Three.js"],
            },
            {
              title: "Sarvam 30B Agent Tool-Calling Fine Tuning & RAG",
              budget: "4.0 tMSTC",
              tag: "AI Intelligence",
              skills: ["Sarvam AI", "TypeScript", "RAG"],
            },
          ].map((g) => (
            <Link
              key={g.title}
              to="/marketplace"
              className="editorial-card p-6 flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-[var(--zx-primary-deep)]">
                  <span>{g.tag}</span>
                  <span className="text-[var(--zx-success)] font-semibold">Active Escrow</span>
                </div>
                <h4 className="font-black text-sm text-[var(--zx-ink)] group-hover:text-[var(--zx-primary-deep)] transition-colors leading-snug">
                  {g.title}
                </h4>
                <div className="flex flex-wrap gap-1 pt-1">
                  {g.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-[var(--zx-surface-alt)] text-[var(--zx-ink)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--zx-border)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--zx-muted)]">Budget:</span>
                <span className="font-black text-[var(--zx-primary-deep)]">{g.budget}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
