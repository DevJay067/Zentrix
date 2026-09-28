import React from "react";
import {
  Cpu,
  Flame,
  Globe,
  ShieldCheck,
  ExternalLink,
  Copy,
  Database,
  Layers,
  Key,
} from "lucide-react";
import { CONTRACT_ADDRESSES } from "../contracts";

const RobotIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className }) => (
  <img src="/robot.png" alt="Sarvam AI" className={`${className || "w-5 h-5"} object-contain`} />
);

// ─── Copy-to-clipboard helper ──────────────────────────────────────────────────

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).catch(() => {});
};

// ─── Network params ────────────────────────────────────────────────────────────

const NETWORK_PARAMS = [
  { label: "Network", value: "MST Testnet" },
  { label: "Chain ID", value: "91562037 (0x5752035)" },
  { label: "Symbol", value: "tMSTC" },
  { label: "RPC URL", value: "https://testnetrpc.mstblockchain.com" },
  { label: "Explorer", value: "testnet.mstscan.com", link: "https://testnet.mstscan.com" },
];

// ─── Architecture cells ────────────────────────────────────────────────────────

const ARCH_CELLS = [
  {
    icon: Database,
    label: "Firebase Layer",
    sub: "Auth & Storage",
    dark: false,
    body: "Firebase Auth provides Google and email login. Firestore stores user profiles, gig listings, and off-chain metadata. All PII stays strictly off-chain; only wallet addresses and hashed CIDs touch the blockchain.",
    tags: ["Email & Google Auth", "Base64 Avatars", "Off-Chain Cache", "Sub-second Indexing"],
  },
  {
    icon: Cpu,
    label: "MST Chain Layer",
    sub: "Smart Contracts & Settlement",
    dark: true,
    body: "Three OpenZeppelin-v5 contracts on Chain ID 91562037: ZentrixEscrow (milestone-gated fund custody), ZentrixReputation (soulbound rating NFTs), ZentrixPass (AI access pass NFTs). Zero custody risk.",
    tags: ["Chain ID: 91562037", "Gas: 0.0001 tMSTC", "OZ v5 Contracts", "Pull Payments"],
  },
  {
    icon: RobotIcon,
    label: "Sarvam AI Layer",
    sub: "sarvam-30b · Server-side only",
    dark: false,
    body: "sarvam-30b runs exclusively server-side via tool-calling. It evaluates gig descriptions and freelancer tech stacks to produce ranked match scores — no PII is ever sent to the model, complying with India's DPDP Act 2023.",
    tags: ["sarvam-30b Engine", "Zero Client Leaks", "DPDP Act 2023", "Hard Rule 5"],
  },
  {
    icon: Key,
    label: "BridgeKey Layer",
    sub: "EIP-1193 Secure Signing",
    dark: true,
    body: "MST's official BridgeKey Chrome extension provides EVM-compatible EIP-1193 signing. Zentrix also supports standard MetaMask-compatible wallets via window.ethereum, auto-prompting a network switch to MST Testnet on connect.",
    tags: ["BridgeKey Extension", "EIP-1193 Provider", "Auto Network Switch", "Non-Custodial"],
  },
];

// ─── Contract cards ────────────────────────────────────────────────────────────

const CONTRACTS = [
  {
    name: "ZentrixEscrow",
    address: CONTRACT_ADDRESSES.ZentrixEscrow,
    description: "Milestone-gated fund custody with reentrancy protection and pull-payment withdrawals.",
    icon: Layers,
  },
  {
    name: "ZentrixReputation",
    address: CONTRACT_ADDRESSES.ZentrixReputation,
    description: "Soulbound ERC-721 tokens minted on milestone approval, encoding rating and evidence CID.",
    icon: ShieldCheck,
  },
  {
    name: "ZentrixPass",
    address: CONTRACT_ADDRESSES.ZentrixPass,
    description: "Non-transferable ERC-721 access passes granting daily AI query allowances per tier.",
    icon: Flame,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export const AboutPage: React.FC = () => {
  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-6">

      {/* ── Hero bento — clean white luxury cell ────────────────────────────────── */}
      <div
        className="rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm"
        style={{
          background: "linear-gradient(180deg, var(--zx-surface) 0%, var(--zx-surface-alt) 100%)",
          border: "1px solid var(--zx-border)",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-15"
          style={{ background: "var(--zx-primary)", filter: "blur(64px)" }}
        />
        <div
          className="absolute top-0 left-1/2 w-48 h-48 rounded-full opacity-10"
          style={{ background: "var(--zx-warning)", filter: "blur(56px)" }}
        />

        <div className="relative z-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
            style={{
              background: "rgba(216,64,64,0.08)",
              border: "1px solid rgba(216,64,64,0.2)",
              color: "var(--zx-primary-deep)",
            }}
          >
            <Globe className="w-3 h-3 text-[var(--zx-primary)]" />
            MST Blockchain × NEWRRO Buildathon 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4 text-[var(--zx-ink)]">
            About{" "}
            <span style={{ color: "var(--zx-primary)" }}>Zentrix</span>
          </h1>
          <p className="text-sm leading-relaxed text-[var(--zx-muted)]">
            An AI-assisted, escrow-backed freelance marketplace built natively on the MST
            Blockchain — where money, agreements, reputation, and access passes all live on-chain.
            AI advises; humans decide; the contract never has arbitrary custody of your funds.
          </p>
        </div>

        {/* Pull-quote */}
        <blockquote
          className="relative z-10 mt-8 p-5 rounded-2xl text-sm font-medium italic leading-relaxed max-w-lg shadow-xs"
          style={{
            background: "rgba(0, 0, 0, 0.02)",
            border: "1px solid var(--zx-border)",
            borderLeft: "4px solid var(--zx-primary)",
            color: "var(--zx-ink)",
          }}
        >
          &ldquo;Don&apos;t just build on blockchain — build something that becomes strictly better
          because of blockchain.&rdquo;
        </blockquote>
      </div>

      {/* ── Architecture — 4-cell balanced bento grid ──────────────────────── */}
      <div className="space-y-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[var(--zx-primary-deep)] mb-1">
            System Topology
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--zx-ink)]">
            Technical Architecture
          </h2>
          <p className="text-xs text-[var(--zx-muted)] max-w-2xl mt-0.5">
            Decoupled multi-tier architecture combining off-chain reactivity with immutable on-chain custody and server-isolated AI.
          </p>
        </div>

        {/* 2x2 grid eliminating white and blank spaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARCH_CELLS.map(({ icon: Icon, label, sub, body, tags }) => (
            <div
              key={label}
              className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4 relative overflow-hidden shadow-xs hover:border-[var(--zx-primary)] transition-colors"
              style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}
            >
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(163, 4, 2, 0.08)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--zx-primary)" }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--zx-primary-deep)]">
                      {sub}
                    </div>
                    <h3 className="font-black text-base text-[var(--zx-ink)]">
                      {label}
                    </h3>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[var(--zx-muted)]">
                  {body}
                </p>
              </div>

              {/* Technical Capability Badges */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t relative z-10" style={{ borderColor: "var(--zx-border-subtle)" }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Network params + contract addresses — side-by-side bento ──── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Network params — 2 cols */}
        <div
          className="md:col-span-2 rounded-3xl p-7 flex flex-col gap-5"
          style={{ background: "var(--zx-surface-alt)", border: "1px solid var(--zx-border)" }}
        >
          <div>
            <h2 className="text-lg font-black" style={{ color: "var(--zx-ink)" }}>
              Network Parameters
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--zx-muted)" }}>
              Verified MST Testnet configuration
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {NETWORK_PARAMS.map(({ label, value, link }) => (
              <div
                key={label}
                className="flex items-start justify-between gap-2 py-2.5"
                style={{ borderBottom: "1px solid var(--zx-border)" }}
              >
                <span className="text-xs font-bold shrink-0" style={{ color: "var(--zx-muted)" }}>
                  {label}
                </span>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-mono font-bold hover:underline text-right"
                    style={{ color: "var(--zx-primary-deep)" }}
                  >
                    {value}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span
                    className="text-xs font-mono font-semibold text-right"
                    style={{ color: "var(--zx-ink)" }}
                  >
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contract addresses — 3 cols */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h2 className="text-lg font-black" style={{ color: "var(--zx-ink)" }}>
            Deployed Contracts
          </h2>
          {CONTRACTS.map(({ name, address, description, icon: Icon }) => (
            <div
              key={name}
              className="rounded-3xl p-6 flex flex-col gap-3"
              style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(216,64,64,0.1)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "var(--zx-primary)" }} />
                  </div>
                  <span className="font-black text-sm" style={{ color: "var(--zx-ink)" }}>
                    {name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(address)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "var(--zx-muted)" }}
                    title="Copy address"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`https://testnet.mstscan.com/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "var(--zx-primary-deep)" }}
                    title="View on MSTScan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <code
                className="text-[10px] font-mono px-3 py-2 rounded-xl block truncate"
                style={{
                  background: "var(--zx-surface-alt)",
                  color: "var(--zx-muted)",
                  border: "1px solid var(--zx-border)",
                }}
              >
                {address}
              </code>

              <p className="text-xs leading-relaxed" style={{ color: "var(--zx-muted)" }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Infographic: Web2 Freelance vs Zentrix On-Chain ──────────────── */}
      <div
        className="rounded-3xl p-6 sm:p-8 space-y-6"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Zentrix Emblem" className="w-12 h-12 rounded-2xl object-contain shadow-sm p-1" style={{ background: "var(--zx-cream)" }} />
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--zx-primary-deep)" }}>
                Architectural Shift
              </div>
              <h2 className="text-xl sm:text-2xl font-black" style={{ color: "var(--zx-ink)" }}>
                Web2 Platforms vs. Zentrix on MST Blockchain
              </h2>
            </div>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }}
          >
            Strictly Better on Chain
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traditional Web2 Box */}
          <div
            className="p-5 rounded-2xl space-y-3"
            style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[var(--zx-muted)] uppercase">Traditional Freelance (Upwork/Fiverr)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(163,29,29,0.1)", color: "var(--zx-danger)" }}>
                Custodial & High Fees
              </span>
            </div>
            <ul className="space-y-2 text-xs" style={{ color: "var(--zx-muted)" }}>
              <li className="flex items-center gap-2">
                <span className="font-bold text-[var(--zx-danger)]">✕</span>
                <span><strong>10% to 20%</strong> platform rake taken from freelancer earnings</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-[var(--zx-danger)]">✕</span>
                <span>Custodial bank holding with arbitrary account freezing & delays</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-[var(--zx-danger)]">✕</span>
                <span>Unresponsive clients freeze milestone payouts for weeks</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-[var(--zx-danger)]">✕</span>
                <span>Reputation trapped inside centralized platform silos</span>
              </li>
            </ul>
          </div>

          {/* Zentrix on MST Box */}
          <div
            className="p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-xs"
            style={{
              background: "var(--zx-surface)",
              border: "2px solid var(--zx-primary)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[var(--zx-primary-deep)]">Zentrix on MST Blockchain</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: "var(--zx-primary-deep)" }}>
                Non-Custodial & Autonomous
              </span>
            </div>
            <ul className="space-y-2 text-xs text-[var(--zx-ink)]">
              <li className="flex items-center gap-2">
                <span className="font-bold text-[var(--zx-success)]">✓</span>
                <span><strong>0% Commission:</strong> 100% of value goes directly to talent</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-[var(--zx-success)]">✓</span>
                <span><strong>Smart Contract Escrow:</strong> Non-custodial pull payments on MST Testnet</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-[var(--zx-success)]">✓</span>
                <span><strong>72h Auto-Release:</strong> Zero payment anxiety if client goes inactive</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-[var(--zx-success)]">✓</span>
                <span><strong>Soulbound ERC-721 SBTs:</strong> Cryptographic proof of work that stays with you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Mission + Team — clean white luxury cell ──────────────────────────────────── */}
      <div
        className="rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm"
        style={{
          background: "linear-gradient(180deg, var(--zx-surface) 0%, var(--zx-surface-alt) 100%)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center">
          <div className="space-y-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{
                background: "rgba(163, 4, 2, 0.08)",
                border: "1px solid rgba(163, 4, 2, 0.2)",
                color: "var(--zx-primary-deep)",
              }}
            >
              Foundational Ethos
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--zx-ink)]">
              Mission &amp; Philosophy
            </h2>
            <p className="text-xs text-[var(--zx-muted)] max-w-xl mx-auto leading-relaxed">
              Decentralized infrastructure enabling trustless collaboration between global clients and verified Web3 builders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              {
                title: "Trustless by Design",
                body: "Payment release, evidence hashes, and reputation are enforced by immutable smart contract logic — not by corporate promises.",
              },
              {
                title: "AI That Advises",
                body: "sarvam-30b scores matches and surfaces insights. Humans make every decision. The AI agent never has custody of funds.",
              },
              {
                title: "Built for India",
                body: "Zero PII in AI pipelines, DPDP Act 2023 compliance, and native MST Testnet integration built at BMS College of Engineering, Bengaluru.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="p-5 rounded-2xl flex flex-col gap-2 shadow-xs hover:border-[var(--zx-primary)] transition-colors"
                style={{
                  background: "var(--zx-surface)",
                  border: "1px solid var(--zx-border)",
                }}
              >
                <span className="text-xs font-black text-[var(--zx-primary-deep)]">
                  {title}
                </span>
                <p className="text-xs leading-relaxed text-[var(--zx-muted)]">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs pt-2" style={{ color: "var(--zx-muted)", opacity: 0.7 }}>
            Zentrix — MST Blockchain × NEWRRO Buildathon 2026 · BMS College of Engineering, Bengaluru
          </p>
        </div>
      </div>
    </div>
  );
};
