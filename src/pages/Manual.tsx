import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ShieldCheck,
  Zap,
  Award,
  Wallet,
  Coins,
  Cpu,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  MessageSquare,
  HelpCircle,
  Clock,
  Sparkles,
  User,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { CONTRACT_ADDRESSES } from "../contracts";

interface ManualSection {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: ManualSection[] = [
  { id: "getting-started", title: "1. Getting Started & BridgeKey Setup", badge: "Core Setup", icon: Wallet },
  { id: "roles-profiles", title: "2. Role Architecture (Client vs Freelancer)", badge: "Profiles", icon: User },
  { id: "escrow-lifecycle", title: "3. Milestone-Based Non-Custodial Escrow", badge: "Smart Contracts", icon: Layers },
  { id: "soulbound-reputation", title: "4. Soulbound Reputation NFTs", badge: "ERC-721", icon: Award },
  { id: "pass-nfts-limits", title: "5. ZentrixPass NFTs & AI Credits", badge: "Subscriptions", icon: Zap },
  { id: "sarvam-agent", title: "6. Sarvam 30B AI Talent Agent", badge: "AI Matching", icon: Sparkles },
  { id: "legal-signatures", title: "7. On-Chain Disclosures & EIP-712", badge: "Compliance", icon: ShieldCheck },
  { id: "faq-troubleshooting", title: "8. FAQ & Network Reference", badge: "Reference", icon: HelpCircle },
];

export const ManualPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("getting-started");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* ─── Hero Banner ─── */}
      <div
        className="rounded-3xl p-6 sm:p-10 border shadow-sm relative overflow-hidden"
        style={{
          background: "var(--zx-surface)",
          borderColor: "var(--zx-border)",
        }}
      >
        <div className="space-y-3 relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Comprehensive Platform Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--zx-ink)] tracking-tight">
            Zentrix User Manual & Protocol Handbook
          </h1>
          <p className="text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed">
            The definitive guide to operating on Zentrix: non-custodial milestone escrow on MST Testnet (Chain ID 91562037),
            BridgeKey wallet integration, Soulbound ERC-721 reputation minting, ZentrixPass NFT credit limits, and server-side Sarvam AI talent search.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ─── Sticky Sidebar Navigation (1 Column) ─── */}
        <div className="lg:col-span-1 space-y-3 lg:sticky lg:top-24">
          <div
            className="rounded-3xl p-4 border shadow-xs space-y-1.5"
            style={{
              background: "var(--zx-surface)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--zx-muted)] font-bold px-3 py-1.5">
              Table of Contents
            </div>
            {SECTIONS.map(({ id, title, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                  activeSection === id
                    ? "bg-red-50 text-[var(--zx-primary-deep)] border border-red-200 shadow-xs"
                    : "text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      activeSection === id ? "text-[var(--zx-primary)]" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className="truncate">{title.replace(/^[0-9.]+\s*/, "")}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Help Card */}
          <div
            className="rounded-3xl p-5 border shadow-xs space-y-3"
            style={{
              background: "var(--zx-surface-alt)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--zx-ink)]">
              <MessageSquare className="w-4 h-4 text-[var(--zx-primary)]" />
              <span>Need Direct Help?</span>
            </div>
            <p className="text-[11px] text-[var(--zx-muted)] leading-relaxed">
              Encountered a stuck escrow or wallet error? Our real-time query desk is active 24/7.
            </p>
            <Link
              to="/contact"
              className="btn-secondary w-full py-2 rounded-xl text-xs font-bold text-center block"
            >
              Contact Support Desk
            </Link>
          </div>
        </div>

        {/* ─── Main Content Handbook (3 Columns) ─── */}
        <div className="lg:col-span-3 space-y-10">

          {/* Section 1: Getting Started */}
          <section id="getting-started" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-red-50 text-[var(--zx-primary-deep)]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--zx-primary)]">
                  Section 1
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
                  Getting Started & BridgeKey Setup
                </h2>
              </div>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 leading-relaxed text-xs sm:text-sm text-slate-700"
              style={{ background: "var(--zx-surface)", borderColor: "var(--zx-border)" }}
            >
              <p>
                Zentrix operates exclusively on the <strong>MST Blockchain Testnet (Chain ID 91562037)</strong>. All milestone escrow funds, reputation score certificates, and access passes are settled on-chain without custodial intermediaries.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Hard Rule 1: MST Testnet Only</span>
                </div>
                <p>
                  Never attempt to send mainnet MST or interact with chain ID 4646. All contracts and faucets run on Chain ID <strong>91562037</strong>.
                </p>
              </div>

              <h4 className="font-bold text-sm text-[var(--zx-ink)] pt-2">Network Configuration Parameters:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold font-sans">Network Name</span>
                  <span className="font-bold text-slate-900">MST Testnet</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold font-sans">Chain ID</span>
                  <span className="font-bold text-slate-900">91562037 (Hex: 0x5752035)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold font-sans">RPC Endpoint</span>
                  <span className="font-bold text-slate-900">https://testnetrpc.mstblockchain.com</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold font-sans">Block Explorer</span>
                  <span className="font-bold text-slate-900">https://testnet.mstscan.com</span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-[var(--zx-ink)] pt-2">Connecting Your Wallet:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs">
                <li>Install the official <strong>BridgeKey Wallet</strong> Chrome extension or any EIP-1193 compatible provider.</li>
                <li>Click <strong>Connect Wallet</strong> in the top-right navigation header.</li>
                <li>Approve the connection signature in BridgeKey. Zentrix automatically prompts a network switch to MST Testnet if you are on another chain.</li>
                <li><strong>Session Memory:</strong> Once approved, Zentrix securely remembers your wallet session locally so you will never be repeatedly prompted to reconnect upon page reloads.</li>
              </ol>
            </div>
          </section>

          {/* Section 2: Role Architecture */}
          <section id="roles-profiles" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-red-50 text-[var(--zx-primary-deep)]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--zx-primary)]">
                  Section 2
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
                  Role Architecture (Client vs. Freelancer)
                </h2>
              </div>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 leading-relaxed text-xs sm:text-sm text-slate-700"
              style={{ background: "var(--zx-surface)", borderColor: "var(--zx-border)" }}
            >
              <p>
                Zentrix enforces an intentional dual-persona model. Users participate either as a <strong>Client</strong> or a <strong>Freelancer</strong>. To preserve transactional integrity, rapid role toggling is disabled during active escrow interactions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
                  <div className="flex items-center gap-2 font-black text-sm text-[var(--zx-ink)]">
                    <Briefcase className="w-4 h-4 text-[var(--zx-primary)]" />
                    <span>Client Role</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-600">
                    <li>Create and publish new gig milestone specifications.</li>
                    <li>Fund escrow milestones with <code className="font-mono">tMSTC</code> deposits.</li>
                    <li>Review deliverable submissions from freelancers.</li>
                    <li>Authorize milestone approvals and cryptographic releases.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
                  <div className="flex items-center gap-2 font-black text-sm text-[var(--zx-ink)]">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Freelancer Role</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-600">
                    <li>Browse verified gig opportunities in the Marketplace.</li>
                    <li>Submit completed milestone proof for client review.</li>
                    <li>Earn soulbound ERC-721 reputation credentials upon approval.</li>
                    <li>Withdraw unlocked funds via non-custodial pull payments.</li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-[var(--zx-muted)]">
                <strong>Switching Roles:</strong> If you need to change your primary account persona, visit the <Link to="/profile" className="font-bold underline text-[var(--zx-primary-deep)]">Profile Settings</Link> page. This prevents accidental state desynchronization across ongoing gigs.
              </p>
            </div>
          </section>

          {/* Section 3: Escrow Lifecycle */}
          <section id="escrow-lifecycle" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-red-50 text-[var(--zx-primary-deep)]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--zx-primary)]">
                  Section 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
                  Milestone-Based Non-Custodial Escrow
                </h2>
              </div>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 leading-relaxed text-xs sm:text-sm text-slate-700"
              style={{ background: "var(--zx-surface)", borderColor: "var(--zx-border)" }}
            >
              <p>
                The heart of Zentrix is the <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 font-bold">ZentrixEscrow.sol</code> smart contract deployed at <code className="font-mono text-[11px] text-[var(--zx-primary-deep)]">{CONTRACT_ADDRESSES.ZentrixEscrow}</code>.
              </p>

              <h4 className="font-bold text-sm text-[var(--zx-ink)]">The 5-Stage Milestone Flow:</h4>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--zx-ink)] text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <span className="font-bold text-slate-900">Milestone Creation & Funding:</span> The Client defines acceptance criteria, review window, and locks 100% of the milestone budget in tMSTC into the escrow contract.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--zx-ink)] text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <span className="font-bold text-slate-900">Execution by Freelancer:</span> The Freelancer develops against the clear acceptance criteria agreed in the on-chain milestone schedule.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--zx-ink)] text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <span className="font-bold text-slate-900">Submission for Review:</span> When deliverables are ready, the Freelancer clicks <strong>Submit for Review</strong> in the Dashboard. Milestone status switches to <code className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Under Review</code>.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--zx-ink)] text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                  <div>
                    <span className="font-bold text-slate-900">Client Approval:</span> The Client inspects the work. Clicking <strong>Approve Milestone</strong> irrevocably changes the milestone status to <code className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Approved</code>. Once approved, it can never be revoked.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--zx-ink)] text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">5</span>
                  <div>
                    <span className="font-bold text-slate-900">Pull Payments & Release:</span> Escrow funds transition into the Freelancer's withdrawable balance. The Freelancer triggers a pull payment to withdraw tMSTC directly into their BridgeKey wallet.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Auto-Release Protection:</span>
                </span>
                <p>
                  Each gig includes a predetermined review window (e.g. 72 hours). If the client does not review or dispute the deliverable within this timeframe, the escrow contract auto-releases the funds to safeguard the freelancer from ghosting.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Soulbound Reputation NFTs */}
          <section id="soulbound-reputation" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-red-50 text-[var(--zx-primary-deep)]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--zx-primary)]">
                  Section 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
                  Soulbound Reputation NFTs (ERC-721)
                </h2>
              </div>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 leading-relaxed text-xs sm:text-sm text-slate-700"
              style={{ background: "var(--zx-surface)", borderColor: "var(--zx-border)" }}
            >
              <p>
                Unlike traditional platforms where reviews are siloed and easily fabricated, Zentrix issues <strong>Soulbound NFTs</strong> via <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 font-bold">ZentrixReputation.sol</code> (<code className="font-mono text-[11px] text-[var(--zx-primary-deep)]">{CONTRACT_ADDRESSES.ZentrixReputation}</code>).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Non-Transferable</span>
                  <p className="text-[11px] text-slate-600">Permanently bound to the recipient's wallet address. Transfers revert at the contract level.</p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Verifiable Proof</span>
                  <p className="text-[11px] text-slate-600">Encodes gig ID, milestone index, rating score (0-100), and evidence IPFS hash.</p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Public Trust Score</span>
                  <p className="text-[11px] text-slate-600">Calculates an aggregated trust score displayed across talent profiles and AI recommendations.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: ZentrixPass NFTs & Credits */}
          <section id="pass-nfts-limits" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-red-50 text-[var(--zx-primary-deep)]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--zx-primary)]">
                  Section 5
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
                  ZentrixPass NFTs & AI Query Credits
                </h2>
              </div>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 leading-relaxed text-xs sm:text-sm text-slate-700"
              style={{ background: "var(--zx-surface)", borderColor: "var(--zx-border)" }}
            >
              <p>
                Access to the Sarvam AI talent search is governed by Soulbound Pass NFTs minted from <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 font-bold">ZentrixPass.sol</code> (<code className="font-mono text-[11px] text-[var(--zx-primary-deep)]">{CONTRACT_ADDRESSES.ZentrixPass}</code>).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Starter Tier (Tier 0)</span>
                  <div className="text-xl font-black text-[var(--zx-ink)]">2 Queries / Day</div>
                  <p className="text-xs text-slate-600">Free default allowance for all connected addresses. Quotas reset automatically at midnight IST.</p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-[var(--zx-primary)] bg-white space-y-2 shadow-xs">
                  <span className="text-xs font-bold text-[var(--zx-primary-deep)] uppercase tracking-wider block">Pro Pass (Tier 1)</span>
                  <div className="text-xl font-black text-[var(--zx-ink)]">10 Queries / Day</div>
                  <p className="text-xs text-slate-600">5.00 tMSTC / 30 days. Mints an exclusive Soulbound NFT pass unlocked in full color.</p>
                </div>

                <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/50 space-y-2">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Enterprise Pass (Tier 2)</span>
                  <div className="text-xl font-black text-[var(--zx-ink)]">15 Queries / Day</div>
                  <p className="text-xs text-slate-600">15.00 tMSTC / 30 days. Maximum throughput for venture studios and high-frequency hiring clients.</p>
                </div>
              </div>

              <p className="text-xs text-[var(--zx-muted)]">
                <strong>Dynamic Hydration:</strong> Zentrix scans your on-chain pass assets directly upon wallet connection. If you own a pass, the NFT renders in full vibrant color across the <Link to="/pricing" className="font-bold underline text-[var(--zx-primary-deep)]">Pricing</Link> page, and your daily credit meter in the AI Agent expands automatically.
              </p>
            </div>
          </section>

          {/* Section 6: Sarvam 30B AI Talent Agent */}
          <section id="sarvam-agent" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-red-50 text-[var(--zx-primary-deep)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--zx-primary)]">
                  Section 6
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
                  Sarvam 30B AI Talent Agent
                </h2>
              </div>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 leading-relaxed text-xs sm:text-sm text-slate-700"
              style={{ background: "var(--zx-surface)", borderColor: "var(--zx-border)" }}
            >
              <p>
                Zentrix includes an intelligent matching agent powered by Sarvam AI (<code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 font-bold">sarvam-30b</code>).
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Server-Side Isolation:</strong> The AI model is called strictly through backend proxies. API credentials and raw prompts are never exposed to browser memory.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero PII Leakage:</strong> Emails, real names, and telephone numbers are never sent to the model, in strict accordance with India's DPDP Act 2023.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Clickable Hyperlink Cards:</strong> Whenever the AI suggests open gigs or verified freelancers, it renders rich interactive cards. Clicking anywhere on a card routes directly to the <Link to="/marketplace" className="font-bold underline">Marketplace</Link> or <Link to="/profile" className="font-bold underline">Profile</Link>.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Legal Signatures & Compliance */}
          <section id="legal-signatures" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-red-50 text-[var(--zx-primary-deep)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--zx-primary)]">
                  Section 7
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
                  On-Chain Disclosures & Cryptographic Signatures
                </h2>
              </div>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 leading-relaxed text-xs sm:text-sm text-slate-700"
              style={{ background: "var(--zx-surface)", borderColor: "var(--zx-border)" }}
            >
              <p>
                To provide institutional transparency, Zentrix incorporates EIP-712 structured cryptographic signatures for milestone acceptance and gig creation. Both parties digitally seal the agreement specifications against smart contract liability terms.
              </p>
              <p>
                Read our full <Link to="/disclosure" className="font-bold underline text-[var(--zx-primary-deep)]">Legal Disclosures</Link> for detailed liability disclaimers, gas considerations, and dispute mechanics.
              </p>
            </div>
          </section>

          {/* Section 8: FAQ & Reference */}
          <section id="faq-troubleshooting" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-red-50 text-[var(--zx-primary-deep)]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--zx-primary)]">
                  Section 8
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
                  FAQ & Network Reference
                </h2>
              </div>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 leading-relaxed text-xs sm:text-sm text-slate-700"
              style={{ background: "var(--zx-surface)", borderColor: "var(--zx-border)" }}
            >
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Where can I obtain tMSTC testnet tokens for escrow testing?</h4>
                  <p className="text-xs text-slate-600">
                    Use the official MST Blockchain faucet to request tMSTC testnet tokens for your BridgeKey wallet address. Contact our query desk if you require testnet allocations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Can milestone status be reversed once approved?</h4>
                  <p className="text-xs text-slate-600">
                    No. Approval is an irreversible smart contract state change that permanently unlocks funds for the freelancer and mints the soulbound reputation NFT.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">How do I get help if a transaction reverts?</h4>
                  <p className="text-xs text-slate-600">
                    Submit a ticket on our <Link to="/contact" className="font-bold underline text-[var(--zx-primary-deep)]">Contact Desk</Link> with your transaction hash and wallet address. All submissions sync directly to our real-time database.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
