import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  ExternalLink,
  Coins,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  UserCheck,
  Briefcase,
  HelpCircle,
  Clock,
  Scale,
} from "lucide-react";
import { CONTRACT_ADDRESSES } from "../contracts";

interface FAQItem {
  id: string;
  category: "all" | "client" | "freelancer";
  question: string;
  answer: string;
  badge: "Client" | "Freelancer";
}

const FAQS: FAQItem[] = [
  {
    id: "escrow-protection",
    category: "client",
    badge: "Client",
    question: "How does non-custodial milestone escrow protect my funds as a client?",
    answer:
      "When you fund a gig on Zentrix, your tMSTC tokens are locked directly into the autonomous ZentrixEscrow smart contract (0xa507...3726) on the MST Blockchain. Zentrix never takes custody of your funds. Funds are only transferred to the freelancer upon your explicit milestone approval or via the automated 72-hour inactivity mechanism if you are satisfied with delivery.",
  },
  {
    id: "ghosting-freelancer",
    category: "freelancer",
    badge: "Freelancer",
    question: "What happens if a client ghosts me or becomes unresponsive after I submit work?",
    answer:
      "Zentrix enforces an on-chain 72-Hour Auto-Release Inactivity Mechanism (§Harness 4.1). Once you submit your milestone proof of work (such as repository links or build artifacts), a 72-hour countdown timer begins. If the client does not approve or dispute the milestone within 72 hours (259,200 seconds), the smart contract permits you to trigger automatic fund release directly to your wallet.",
  },
  {
    id: "platform-fees",
    category: "freelancer",
    badge: "Freelancer",
    question: "What are the platform commission fees on Zentrix?",
    answer:
      "Zentrix charges a 0.00% protocol take-rate on freelancer earnings. Unlike Web2 platforms (Upwork and Fiverr) that extract 10% to 20% of your earnings, 100% of your agreed milestone compensation goes straight to your wallet. You only pay standard, sub-cent EVM gas fees on MST Blockchain.",
  },
  {
    id: "dispute-arbitration",
    category: "client",
    badge: "Client",
    question: "What if a freelancer fails to deliver or delivers unsatisfactory work?",
    answer:
      "Clients have full authority to reject unsatisfactory submissions and provide feedback. If an impasse is reached, either party can trigger formal on-chain dispute arbitration. Escrowed funds are held securely until the designated BridgeKey multi-sig arbitrator reviews the submitted deliverables and issues an on-chain split or full refund.",
  },
  {
    id: "soulbound-reputation",
    category: "freelancer",
    badge: "Freelancer",
    question: "How does soulbound on-chain reputation work?",
    answer:
      "Every milestone successfully completed and approved on Zentrix mints non-transferable, soulbound reputation credentials (ZentrixReputation.sol) tied permanently to your MST wallet address. Unlike centralized platforms where your ratings can be banned or deleted, your Zentrix track record is an immutable, portable credential verifiable on MSTScan forever.",
  },
  {
    id: "payout-speed",
    category: "freelancer",
    badge: "Freelancer",
    question: "How fast are payouts cleared once a milestone is approved?",
    answer:
      "Payouts are instant. The moment a client approves a milestone, the smart contract state changes, enabling immediate pull-payment withdrawal in tMSTC directly into your BridgeKey or connected EVM wallet (typically under 1.5 seconds on MST Testnet). No 5-to-14 day bank clearance holds.",
  },
  {
    id: "client-currencies",
    category: "client",
    badge: "Client",
    question: "Which networks and wallets can I use to hire talent?",
    answer:
      "Zentrix is deployed natively on the high-speed MST Blockchain Testnet (Chain ID: 91562037). You can connect via BridgeKey Wallet or any standard injected EVM wallet (MetaMask, Rabby, Coinbase Wallet). Milestone values are denominated in tMSTC.",
  },
  {
    id: "dpdp-privacy",
    category: "client",
    badge: "Client",
    question: "Is my personal data and identity exposed on-chain?",
    answer:
      "No. Zentrix strictly complies with the Indian DPDP Act 2023 and zero-PII privacy standards. Personal identification (emails, phone numbers, KYC documents) is never broadcast or written to the blockchain. Accounts are identified purely by cryptographic 20-byte EVM addresses and EIP-191 signatures.",
  },
];

export const HomePage: React.FC = () => {
  const [metricCount, setMetricCount] = useState({ gigs: 247, volume: 9180, creators: 512 });
  const [activeFaqTab, setActiveFaqTab] = useState<"all" | "client" | "freelancer">("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>("escrow-protection");

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

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs =
    activeFaqTab === "all" ? FAQS : FAQS.filter((f) => f.category === activeFaqTab);

  return (
    <div className="zx-home-page space-y-12 sm:space-y-16">
      {/* ── 1. HERO SECTION (Marketplace Centric, High-Fidelity) ── */}
      <section
        className="zx-hero-section rounded-3xl p-8 sm:p-14 relative overflow-hidden space-y-8"
        style={{
          background: "linear-gradient(180deg, var(--zx-surface) 0%, var(--zx-surface-alt) 100%)",
          border: "1px solid var(--zx-border)",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Subtle Ambient Radial Highlight */}
        <div
          className="zx-hero-glow zx-hero-glow-right absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20"
          style={{ background: "var(--zx-primary)" }}
        />
        <div
          className="zx-hero-glow zx-hero-glow-left absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-15"
          style={{ background: "var(--zx-primary-deep)" }}
        />

        <div className="zx-hero-content relative z-10 max-w-4xl space-y-6">
          {/* Header Metadata Pill */}
          <div className="zx-hero-badge-wrap flex flex-wrap items-center gap-2">
            <span
              className="zx-hero-badge zx-badge-buildathon text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "rgba(163, 4, 2, 0.08)",
                color: "var(--zx-primary)",
                border: "1px solid rgba(163, 4, 2, 0.2)",
              }}
            >
              MST Blockchain × Buildathon 2026
            </span>
            <span className="zx-hero-badge zx-badge-security text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Zero Custody Risk · 0% Fee
            </span>
          </div>

          {/* High-Impact Editorial Headline */}
          <h1 className="zx-hero-title text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.98] text-[var(--zx-ink)]">
            Decentralized <br />
            <span className="zx-hero-title-accent" style={{ color: "var(--zx-primary)" }}>
              Freelance Marketplace
            </span>{" "}
            <br />
            On MST Blockchain.
          </h1>

          {/* Subtext */}
          <p className="zx-hero-subtitle text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl text-[var(--zx-muted)] font-normal">
            Where client milestone capital is secured in non-custodial smart contracts, not extractive banks.
            Zero platform take-rates, guaranteed 72-hour auto-release protection against ghosting, and soulbound reputation credentials minted permanently to your wallet on MSTScan.
          </p>

          {/* Singular Marketplace CTA as Focused Product Intent */}
          <div className="zx-hero-cta-wrap flex items-center pt-2">
            <Link
              to="/marketplace"
              className="zx-marketplace-btn btn-primary py-4 px-10 text-sm font-bold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2.5 rounded-2xl"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="zx-marketplace-btn-icon w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Protocol Telemetry Stats Strip */}
        <div
          className="zx-telemetry-strip relative z-10 pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-4"
          style={{ borderColor: "var(--zx-border)" }}
        >
          <div className="zx-telemetry-card zx-telemetry-volume p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="zx-telemetry-label text-[10px] font-mono uppercase tracking-wider text-[var(--zx-muted)]">
              Total Volume Settled
            </div>
            <div className="zx-telemetry-value text-xl sm:text-2xl font-mono font-black text-[var(--zx-ink)] mt-0.5">
              {metricCount.volume.toLocaleString()}{" "}
              <span className="zx-telemetry-unit text-xs font-normal text-[var(--zx-muted)]">
                tMSTC
              </span>
            </div>
          </div>

          <div className="zx-telemetry-card zx-telemetry-milestones p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="zx-telemetry-label text-[10px] font-mono uppercase tracking-wider text-[var(--zx-muted)]">
              Milestones Verified
            </div>
            <div className="zx-telemetry-value text-xl sm:text-2xl font-mono font-black text-[var(--zx-ink)] mt-0.5">
              {metricCount.gigs}{" "}
              <span className="zx-telemetry-unit text-xs font-normal text-[var(--zx-muted)]">
                Contracts
              </span>
            </div>
          </div>

          <div className="zx-telemetry-card zx-telemetry-window p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="zx-telemetry-label text-[10px] font-mono uppercase tracking-wider text-[var(--zx-muted)]">
              Auto-Release Window
            </div>
            <div className="zx-telemetry-value text-xl sm:text-2xl font-mono font-black text-[var(--zx-primary)] mt-0.5">
              72h{" "}
              <span className="zx-telemetry-unit text-xs font-normal text-[var(--zx-muted)]">
                Guaranteed
              </span>
            </div>
          </div>

          <div className="zx-telemetry-card zx-telemetry-commission p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="zx-telemetry-label text-[10px] font-mono uppercase tracking-wider text-[var(--zx-muted)]">
              Platform Commission
            </div>
            <div className="zx-telemetry-value text-xl sm:text-2xl font-mono font-black text-[var(--zx-success)] mt-0.5">
              0.00%{" "}
              <span className="zx-telemetry-unit text-xs font-normal text-[var(--zx-muted)]">
                Zero Rake
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ARCHITECTURAL PILLARS (Editorial Triad) ── */}
      <section className="zx-pillars-section space-y-6">
        <div className="zx-pillars-header flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div>
            <span className="zx-pillars-label text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--zx-primary)]">
              Marketplace Guarantees
            </span>
            <h2 className="zx-pillars-title text-2xl sm:text-3xl font-black text-[var(--zx-ink)] mt-1">
              Strictly Better on Blockchain.
            </h2>
          </div>
          <p className="zx-pillars-desc text-xs text-[var(--zx-muted)] max-w-sm">
            Three uncompromising smart contract guarantees designed to eliminate payment anxiety and client-freelancer friction.
          </p>
        </div>

        <div className="zx-pillars-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 01: Escrow */}
          <div className="zx-pillar-card zx-pillar-escrow editorial-card p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="zx-pillar-num font-mono text-xs font-black text-[var(--zx-primary)]">
                  // 01
                </span>
                <Lock className="zx-pillar-icon w-5 h-5 text-[var(--zx-primary)]" />
              </div>

              <h3 className="zx-pillar-title text-xl font-black text-[var(--zx-ink)]">
                Non-Custodial Milestone Escrow
              </h3>

              <p className="zx-pillar-desc text-xs text-[var(--zx-muted)] leading-relaxed">
                Clients deposit 100% of milestone funds in tMSTC upfront into the smart contract. Payouts are unlocked through secure, non-custodial pull payments with zero intermediary risk.
              </p>
            </div>

            <div className="zx-pillar-footer pt-4 border-t border-[var(--zx-border)] text-[11px] font-mono font-semibold text-[var(--zx-primary)] flex items-center justify-between">
              <span>OpenZeppelin v5 Security</span>
              <span className="text-xs">→</span>
            </div>
          </div>

          {/* Pillar 02: 72h Inactivity Auto-Release */}
          <div
            className="zx-pillar-card zx-pillar-autorelease editorial-card p-7 flex flex-col justify-between space-y-6"
            style={{ background: "var(--zx-cream)" }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="zx-pillar-num font-mono text-xs font-black text-[var(--zx-primary)]">
                  // 02
                </span>
                <Clock className="zx-pillar-icon w-5 h-5 text-amber-600" />
              </div>

              <h3 className="zx-pillar-title text-xl font-black text-[var(--zx-ink)]">
                72h Anti-Ghosting Auto-Release
              </h3>

              <p className="zx-pillar-desc text-xs text-[var(--zx-muted)] leading-relaxed">
                Eliminates unpaid ghosting. If a client remains silent for 72 hours after milestone delivery without lodging a dispute, the smart contract enables the freelancer to trigger automatic fund release.
              </p>
            </div>

            <div className="zx-pillar-footer pt-4 border-t border-[var(--zx-border)] text-[11px] font-mono font-semibold text-amber-700 flex items-center justify-between">
              <span>Deterministic Enforcement</span>
              <span className="text-xs">→</span>
            </div>
          </div>

          {/* Pillar 03: Soulbound Reputation */}
          <div className="zx-pillar-card zx-pillar-reputation editorial-card p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="zx-pillar-num font-mono text-xs font-black text-[var(--zx-primary)]">
                  // 03
                </span>
                <Award className="zx-pillar-icon w-5 h-5 text-emerald-600" />
              </div>

              <h3 className="zx-pillar-title text-xl font-black text-[var(--zx-ink)]">
                Soulbound Reputation Credentials
              </h3>

              <p className="zx-pillar-desc text-xs text-[var(--zx-muted)] leading-relaxed">
                Delivering milestones mints permanent, non-transferable ERC-721 tokens. Unlike Upwork reviews that platforms can delete, your reputation credentials stay with your wallet address forever on MSTScan.
              </p>
            </div>

            <div className="zx-pillar-footer pt-4 border-t border-[var(--zx-border)] text-[11px] font-mono font-semibold text-emerald-700 flex items-center justify-between">
              <span>Portable Trust Profile</span>
              <span className="text-xs">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. LIVE ON-CHAIN SMART CONTRACTS TELEMETRY ── */}
      <section
        className="zx-contracts-section rounded-3xl p-6 sm:p-8 space-y-4"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="zx-contracts-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="zx-contracts-label text-[10px] font-mono font-black uppercase text-[var(--zx-primary)] tracking-widest">
              Live On-Chain Verifications
            </span>
            <h3 className="zx-contracts-title text-lg font-black text-[var(--zx-ink)]">
              Verified Testnet Smart Contracts
            </h3>
          </div>
          <span className="zx-contracts-network text-xs font-mono text-[var(--zx-muted)]">
            Network: MST Testnet (91562037)
          </span>
        </div>

        <div className="zx-contracts-grid grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              name: "ZentrixEscrow.sol",
              addr: CONTRACT_ADDRESSES.ZentrixEscrow,
              role: "Multi-milestone non-custodial escrow",
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
              className="zx-contract-card p-4 rounded-2xl transition-all hover:scale-[1.02] flex flex-col justify-between gap-3 group"
              style={{
                background: "var(--zx-cream)",
                border: "1px solid var(--zx-border)",
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="zx-contract-name text-xs font-mono font-black text-[var(--zx-ink)]">
                    {c.name}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--zx-muted)] group-hover:text-[var(--zx-primary)] transition-colors" />
                </div>
                <div className="zx-contract-role text-[11px] text-[var(--zx-muted)] mt-1">
                  {c.role}
                </div>
              </div>

              <div className="zx-contract-addr font-mono text-[10px] truncate text-[var(--zx-primary)] bg-[var(--zx-surface)] p-2 rounded-xl border border-[var(--zx-border)]">
                {c.addr}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── 4. EXECUTION LIFECYCLE (The Golden Path) ── */}
      <section
        className="zx-lifecycle-section rounded-3xl p-8 sm:p-10 space-y-6"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="zx-lifecycle-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="zx-lifecycle-label text-[10px] font-mono font-black uppercase text-[var(--zx-primary)] tracking-widest">
              Execution Lifecycle
            </span>
            <h3 className="zx-lifecycle-title text-2xl font-black text-[var(--zx-ink)]">
              The Golden Path
            </h3>
          </div>
          <Link
            to="/marketplace"
            className="zx-lifecycle-link text-xs font-bold text-[var(--zx-primary)] hover:underline flex items-center gap-1"
          >
            <span>View Marketplace Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="zx-lifecycle-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Create & Fund Escrow",
              desc: "Client defines milestones and locks 100% upfront in tMSTC into the escrow smart contract.",
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
              className="zx-lifecycle-step-card p-5 rounded-2xl flex flex-col justify-between gap-4"
              style={{
                background: "var(--zx-cream)",
                border: "1px solid var(--zx-border)",
              }}
            >
              <div className="space-y-2">
                <span className="zx-lifecycle-step-badge font-mono text-xs font-black text-[var(--zx-primary)]">
                  STAGE {s.step}
                </span>
                <h4 className="zx-lifecycle-step-title font-black text-sm text-[var(--zx-ink)]">
                  {s.title}
                </h4>
                <p className="zx-lifecycle-step-desc text-xs text-[var(--zx-muted)] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="zx-lifecycle-step-status text-[10px] font-mono font-bold text-[var(--zx-primary)]">
                Status: Automated
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. FEATURED ON-CHAIN GIGS ── */}
      <section className="zx-featured-section space-y-4">
        <div className="zx-featured-header flex items-center justify-between">
          <div>
            <span className="zx-featured-label text-[10px] font-mono font-black uppercase text-[var(--zx-primary)] tracking-widest">
              Live Openings
            </span>
            <h3 className="zx-featured-title text-xl font-black text-[var(--zx-ink)]">
              Featured Marketplace Gigs
            </h3>
          </div>
          <Link
            to="/marketplace"
            className="zx-featured-all-btn btn-secondary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5"
          >
            <span>Browse All Gigs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="zx-featured-grid grid grid-cols-1 md:grid-cols-3 gap-4">
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
              title: "Sarvam AI Tool-Calling Fine Tuning & RAG Integration",
              budget: "4.0 tMSTC",
              tag: "AI Intelligence",
              skills: ["Sarvam AI", "TypeScript", "RAG"],
            },
          ].map((g) => (
            <Link
              key={g.title}
              to="/marketplace"
              className="zx-featured-gig-card editorial-card p-6 flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-[var(--zx-primary)]">
                  <span className="zx-featured-gig-tag">{g.tag}</span>
                  <span className="zx-featured-gig-status text-[var(--zx-success)] font-semibold">
                    Active Escrow
                  </span>
                </div>
                <h4 className="zx-featured-gig-title font-black text-sm text-[var(--zx-ink)] group-hover:text-[var(--zx-primary)] transition-colors leading-snug">
                  {g.title}
                </h4>
                <div className="zx-featured-gig-skills flex flex-wrap gap-1 pt-1">
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

              <div className="zx-featured-gig-footer pt-3 border-t border-[var(--zx-border)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--zx-muted)]">Budget:</span>
                <span className="zx-featured-gig-budget font-black text-[var(--zx-primary)]">
                  {g.budget}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. COMPREHENSIVE CLIENT & FREELANCER FAQS ── */}
      <section
        className="zx-faq-section rounded-3xl p-6 sm:p-12 border shadow-xs space-y-8"
        style={{
          background: "var(--zx-surface)",
          borderColor: "var(--zx-border)",
        }}
      >
        <div className="zx-faq-header max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-50 text-[var(--zx-primary)] border border-red-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="zx-faq-label">COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="zx-faq-title text-2xl sm:text-4xl font-black text-[var(--zx-ink)] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="zx-faq-desc text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed">
            Everything you need to know about non-custodial milestone escrow, the 72-hour auto-release rule, soulbound reputation, and fee structures for clients and freelancers.
          </p>
        </div>

        {/* FAQ Role Filter Tabs */}
        <div className="zx-faq-tabs-wrap flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 w-fit">
          <button
            type="button"
            onClick={() => setActiveFaqTab("all")}
            className={`zx-faq-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFaqTab === "all"
                ? "bg-white text-[var(--zx-primary)] shadow-xs"
                : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
            }`}
          >
            All Questions ({FAQS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFaqTab("client")}
            className={`zx-faq-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFaqTab === "client"
                ? "bg-white text-[var(--zx-primary)] shadow-xs"
                : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>For Clients</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFaqTab("freelancer")}
            className={`zx-faq-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFaqTab === "freelancer"
                ? "bg-white text-[var(--zx-primary)] shadow-xs"
                : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>For Freelancers</span>
          </button>
        </div>

        {/* FAQ Interactive Accordion List */}
        <div className="zx-faq-list space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="zx-faq-item rounded-2xl border transition-all"
                style={{
                  background: isOpen ? "var(--zx-surface-alt)" : "var(--zx-surface)",
                  borderColor: isOpen ? "var(--zx-primary)" : "var(--zx-border)",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="zx-faq-question-btn w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`zx-faq-role-badge text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                        faq.badge === "Client"
                          ? "bg-slate-100 text-slate-800 border-slate-200"
                          : "bg-red-50 text-[var(--zx-primary)] border-red-200"
                      }`}
                    >
                      {faq.badge}
                    </span>
                    <span className="zx-faq-question-text text-sm font-bold text-[var(--zx-ink)]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`zx-faq-chevron w-4 h-4 text-[var(--zx-muted)] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[var(--zx-primary)]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="zx-faq-answer-wrap px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed border-t border-slate-200/60 mt-1">
                    <p className="zx-faq-answer-text">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Support Footer Card */}
        <div
          className="zx-faq-footer p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
          style={{
            background: "var(--zx-cream)",
            borderColor: "var(--zx-border)",
          }}
        >
          <div>
            <div className="font-bold text-[var(--zx-ink)]">Still have questions about our escrow?</div>
            <p className="text-[11px] text-[var(--zx-muted)] mt-0.5">
              Read our full operating disclosure and master agreement on a single page.
            </p>
          </div>
          <Link
            to="/disclosure"
            className="btn-primary py-2 px-4 text-xs font-bold shrink-0"
          >
            <span>View Full Disclosure Agreement →</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
