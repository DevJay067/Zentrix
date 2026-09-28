import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Scale,
  Clock,
  Coins,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Briefcase,
  Zap,
  TrendingDown,
  Layers,
} from "lucide-react";

export const DisclosurePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("neutrality");

  const sections = [
    { id: "neutrality", title: "1. Protocol Neutrality & Non-Custody" },
    { id: "client-terms", title: "2. Client Escrow Agreement" },
    { id: "freelancer-terms", title: "3. Freelancer Milestone Terms" },
    { id: "auto-release", title: "4. 72-Hour Auto-Release Policy" },
    { id: "refund-dispute", title: "5. Refunds & Dispute Arbitration" },
    { id: "dpdp-privacy", title: "6. DPDP Act 2023 & Zero-PII Policy" },
    { id: "escrow-savings", title: "7. Escrow Savings & Gas Metrics" },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 sm:py-8">
      {/* ─── HERO HEADER BENTO ─── */}
      <div
        className="rounded-3xl p-6 sm:p-10 border shadow-xs relative overflow-hidden"
        style={{
          background: "var(--zx-surface)",
          borderColor: "var(--zx-border)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: "var(--zx-primary)" }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-50 text-[var(--zx-primary)] border border-red-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SINGLE-PAGE COMPREHENSIVE DISCLOSURE AGREEMENT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--zx-ink)] tracking-tight">
              Legal Operating Disclosure & Escrow Terms
            </h1>
            <p className="text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed">
              Standardized master agreement governing Client and Freelancer milestone contracts, non-custodial smart contract escrow on MST Testnet (Chain ID 91562037), 72-hour auto-release protections, and zero-PII privacy architecture.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="text-[10px] font-mono uppercase text-[var(--zx-muted)]">
              Verified On-Chain Contract
            </div>
            <div className="font-mono font-bold text-[var(--zx-ink)]">
              0xa50759E9...3726
            </div>
            <a
              href="https://testnet.mstscan.com/address/0xa50759E9CE985Fbb06503CaeC0DB9D1fB1233726"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[var(--zx-primary)] hover:underline"
            >
              <span>Verify on MSTScan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Telemetry Chips */}
        <div className="mt-6 pt-4 border-t flex flex-wrap gap-2 text-xs" style={{ borderColor: "var(--zx-border)" }}>
          <span className="px-3 py-1 rounded-full bg-slate-100 font-mono font-semibold text-slate-800">
            Chain ID: 91562037 (MST Testnet)
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono font-semibold border border-emerald-200">
            DPDP Act 2023 Compliant
          </span>
          <span className="px-3 py-1 rounded-full bg-red-50 text-[var(--zx-primary)] font-mono font-semibold border border-red-200">
            72h Auto-Release Protected
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 font-mono font-semibold text-slate-800">
            Non-Custodial Escrow
          </span>
        </div>
      </div>

      {/* ─── DYNAMIC METRICS BENTO (Web2 vs Zentrix Escrow Savings) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div
          className="rounded-3xl p-5 border shadow-xs"
          style={{
            background: "var(--zx-surface)",
            borderColor: "var(--zx-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--zx-muted)]">
              Platform Fee
            </span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600">
            0%
          </div>
          <p className="text-xs text-[var(--zx-muted)] mt-1">
            Zero take-rate on freelancer earnings. Upwork & Fiverr charge 10%–20%.
          </p>
        </div>

        {/* Metric 2 */}
        <div
          className="rounded-3xl p-5 border shadow-xs"
          style={{
            background: "var(--zx-surface)",
            borderColor: "var(--zx-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--zx-muted)]">
              Auto-Release Inactivity
            </span>
            <Clock className="w-4 h-4 text-[var(--zx-primary)]" />
          </div>
          <div className="mt-2 text-3xl font-black text-[var(--zx-primary)]">
            72 Hours
          </div>
          <p className="text-xs text-[var(--zx-muted)] mt-1">
            Funds auto-release to freelancer if client is silent post-submission.
          </p>
        </div>

        {/* Metric 3 */}
        <div
          className="rounded-3xl p-5 border shadow-xs text-white"
          style={{
            background: "var(--zx-ink)",
            borderColor: "var(--zx-ink)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              Escrow Custody
            </span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-white">
            100% Non-Custodial
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zentrix never holds your funds. Funds live strictly in the smart contract.
          </p>
        </div>
      </div>

      {/* ─── MAIN CONTENT LAYOUT WITH STICKY TABLE OF CONTENTS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:col-span-4 sticky top-20 space-y-3">
          <div
            className="rounded-2xl p-4 border shadow-xs"
            style={{
              background: "var(--zx-surface)",
              borderColor: "var(--zx-border)",
            }}
          >
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--zx-ink)] mb-3">
              Agreement Sections
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    activeSection === sec.id
                      ? "bg-red-50 text-[var(--zx-primary)] font-bold shadow-xs"
                      : "text-[var(--zx-muted)] hover:text-[var(--zx-ink)] hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Contact & Dispute Support Card */}
          <div
            className="rounded-2xl p-4 border shadow-xs text-xs space-y-2"
            style={{
              background: "var(--zx-surface-alt)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="font-bold text-[var(--zx-ink)]">
              Need Dispute Arbitration?
            </div>
            <p className="text-[11px] text-[var(--zx-muted)]">
              Disputes are arbitrated via decentralized multisig quorums on MST Blockchain.
            </p>
            <Link
              to="/agent"
              className="inline-flex items-center gap-1 font-bold text-[var(--zx-primary)] hover:underline pt-1"
            >
              <span>Consult Sarvam Resolution Agent →</span>
            </Link>
          </div>
        </aside>

        {/* Detailed Legal Clauses Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: PROTOCOL NEUTRALITY */}
          <section
            id="neutrality"
            className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--zx-surface)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-50 text-[var(--zx-primary)]">
                <Lock className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[var(--zx-ink)]">
                1. Protocol Neutrality & Non-Custodial Architecture
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed">
              Zentrix is an autonomous, open-source milestone protocol deployed on the MST Blockchain (Chain ID 91562037). The protocol operators, founders, and contributors do not act as an intermediary, bank, broker, or financial custodian.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-[var(--zx-ink)]">
                Key Technical Guarantees:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[var(--zx-muted)]">
                <li>All escrowed funds reside strictly within smart contract address <code className="font-mono font-bold text-[var(--zx-ink)]">0xa50759E9CE985Fbb06503CaeC0DB9D1fB1233726</code>.</li>
                <li>No platform administrator holds private keys capable of unilateral fund withdrawal or asset seizure.</li>
                <li>Contract execution utilizes OpenZeppelin v5 reentrancy guards and the Checks-Effects-Interactions (CEI) paradigm.</li>
                <li>All milestone state changes emit immutable EVM logs queryable via MSTScan.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 2: CLIENT ESCROW AGREEMENT */}
          <section
            id="client-terms"
            className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--zx-surface)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-slate-100 text-[var(--zx-ink)]">
                <UserCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[var(--zx-ink)]">
                2. Client Escrow Agreement & Funding Terms
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed">
              By initiating a milestone contract or accepting a proposal on Zentrix, the Client covenants and agrees to the following binding parameters:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border" style={{ borderColor: "var(--zx-border)" }}>
                <div className="font-bold text-[var(--zx-ink)]">2.1 Upfront 100% Milestone Lock</div>
                <p className="text-[var(--zx-muted)] mt-1">
                  Milestones must be 100% funded with testnet tMSTC at inception. This ensures the Freelancer has cryptographic certainty that compensation is guaranteed upon satisfactory delivery.
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: "var(--zx-border)" }}>
                <div className="font-bold text-[var(--zx-ink)]">2.2 Objective Acceptance Standards</div>
                <p className="text-[var(--zx-muted)] mt-1">
                  Deliverables submitted according to the agreed specification must be approved promptly. Clients may not unreasonably withhold release or demand revisions outside the written scope of work.
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: "var(--zx-border)" }}>
                <div className="font-bold text-[var(--zx-ink)]">2.3 Intellectual Property Assignment</div>
                <p className="text-[var(--zx-muted)] mt-1">
                  Upon smart contract fund release to the Freelancer, all worldwide intellectual property rights, codebases, designs, and deliverables transfer irrevocably to the Client.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: FREELANCER MILESTONE TERMS */}
          <section
            id="freelancer-terms"
            className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--zx-surface)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-50 text-[var(--zx-primary)]">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[var(--zx-ink)]">
                3. Freelancer Milestone Delivery & Proof of Work
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed">
              Freelancers operating on Zentrix maintain independent creator status and agree to execute deliverables in accordance with professional industry standards:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-[var(--zx-ink)]">Verifiable Submissions</div>
                <p className="text-[var(--zx-muted)] mt-1">
                  Proof of work must be submitted with permanent repository links (GitHub/GitLab), IPFS hashes, or staging environments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-[var(--zx-ink)]">Soulbound Credentialing</div>
                <p className="text-[var(--zx-muted)] mt-1">
                  Successful milestone releases mint soulbound reputation points into your ZentrixReputation on-chain credential.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: 72-HOUR AUTO-RELEASE POLICY */}
          <section
            id="auto-release"
            className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4 text-white"
            style={{
              background: "var(--zx-ink)",
              borderColor: "var(--zx-ink)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 text-red-400">
                <Clock className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">
                4. The 72-Hour Auto-Release Inactivity Mechanism
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To eliminate the widespread Web2 vulnerability of "client ghosting" where freelancers remain unpaid due to client silence, Zentrix enforces an on-chain 72-hour auto-release rule:
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Deterministic Smart Contract Rule (§Harness 4.1):</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                When a freelancer submits milestone proof of work, a 72-hour countdown timer begins. If the client does not either (a) approve the milestone or (b) initiate a formal dispute within exactly 72 hours (259,200 seconds), the smart contract enables the freelancer to trigger automated release and withdraw 100% of escrowed funds.
              </p>
            </div>
          </section>

          {/* SECTION 5: REFUNDS & DISPUTE ARBITRATION */}
          <section
            id="refund-dispute"
            className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--zx-surface)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[var(--zx-ink)]">
                5. Refund Policy & Dispute Arbitration
              </h2>
            </div>

            <div className="space-y-3 text-xs text-[var(--zx-muted)] leading-relaxed">
              <p>
                Because smart contract transactions on MST Blockchain are immutable, refunds can only occur through deterministic contract execution:
              </p>
              <div className="p-4 rounded-xl border space-y-1.5" style={{ borderColor: "var(--zx-border)" }}>
                <span className="font-bold text-[var(--zx-ink)]">5.1 Mutual Cancellation:</span>
                <p>If both client and freelancer agree to cancel prior to delivery, 100% of escrowed funds are returned to the client address without fee penalties.</p>
              </div>
              <div className="p-4 rounded-xl border space-y-1.5" style={{ borderColor: "var(--zx-border)" }}>
                <span className="font-bold text-[var(--zx-ink)]">5.2 Contested Disputes:</span>
                <p>If a dispute is lodged, funds are locked in the contract until the designated BridgeKey Multisig Arbitrator evaluates the on-chain submissions and issues a settlement decision.</p>
              </div>
            </div>
          </section>

          {/* SECTION 6: DPDP ACT ZERO-PII POLICY */}
          <section
            id="dpdp-privacy"
            className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--zx-surface)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[var(--zx-ink)]">
                6. DPDP Act 2023 & Zero-PII Cryptographic Policy
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed">
              In strict adherence to the Indian Digital Personal Data Protection (DPDP) Act 2023 and global privacy frameworks:
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2 text-emerald-950">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero On-Chain Personally Identifiable Information (PII)</span>
              </div>
              <p className="text-emerald-900 leading-relaxed">
                Names, email addresses, phone numbers, and physical coordinates are NEVER broadcast or written to the MST Blockchain. On-chain accounts are recognized solely via 20-byte EVM addresses. Profiles stored in the hybrid index are client-side sandboxed.
              </p>
            </div>
          </section>

          {/* SECTION 7: ESCROW SAVINGS & COMPARATIVE METRICS */}
          <section
            id="escrow-savings"
            className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--zx-surface-alt)",
              borderColor: "var(--zx-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-50 text-[var(--zx-primary)]">
                <Coins className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[var(--zx-ink)]">
                7. Escrow Savings & Comparative Platform Economics
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[var(--zx-muted)] leading-relaxed">
              Comparison between traditional centralized freelance platforms and Zentrix on-chain escrow:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--zx-border)" }}>
                    <th className="py-2.5 font-bold text-[var(--zx-ink)]">Feature</th>
                    <th className="py-2.5 font-bold text-rose-700">Web2 (Upwork/Fiverr)</th>
                    <th className="py-2.5 font-bold text-emerald-700">Zentrix Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--zx-border)" }}>
                  <tr>
                    <td className="py-2.5 font-semibold text-[var(--zx-ink)]">Freelancer Fee</td>
                    <td className="py-2.5 text-rose-700 font-mono">10% – 20% commission</td>
                    <td className="py-2.5 text-emerald-700 font-mono font-bold">0% Protocol Take-rate</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-[var(--zx-ink)]">Payout Clearance</td>
                    <td className="py-2.5 text-rose-700 font-mono">5 – 14 business days</td>
                    <td className="py-2.5 text-emerald-700 font-mono font-bold">Instant (1.2s on MST)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-[var(--zx-ink)]">Chargeback Risk</td>
                    <td className="py-2.5 text-rose-700 font-mono">High (Credit Card clawbacks)</td>
                    <td className="py-2.5 text-emerald-700 font-mono font-bold">0% (Locked on-chain)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-[var(--zx-ink)]">Inactivity Protection</td>
                    <td className="py-2.5 text-rose-700 font-mono">14 days manual review</td>
                    <td className="py-2.5 text-emerald-700 font-mono font-bold">72-Hour Auto-Release</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-[var(--zx-ink)]">Reputation Portability</td>
                    <td className="py-2.5 text-rose-700 font-mono">Locked in walled garden</td>
                    <td className="py-2.5 text-emerald-700 font-mono font-bold">Soulbound NFT on MST</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
