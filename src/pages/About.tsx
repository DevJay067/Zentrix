import React from "react";
import {
  Cpu,
  Flame,
  Globe,
  ShieldCheck,
  ExternalLink,
  Copy,
  Database,
  Bot,
  Layers,
  Key,
} from "lucide-react";
import { CONTRACT_ADDRESSES } from "../contracts";

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
    body: "Firebase Auth provides Google/email login. Firestore stores user profiles, gig listings, and off-chain metadata. All PII stays off-chain; only wallet addresses and hashed CIDs touch the blockchain.",
  },
  {
    icon: Cpu,
    label: "MST Chain Layer",
    sub: "Smart Contracts",
    dark: true,
    body: "Three OpenZeppelin-v5 contracts on Chain ID 91562037: ZentrixEscrow (milestone-gated fund custody), ZentrixReputation (soulbound rating NFTs), ZentrixPass (AI access pass NFTs). Zero custody risk.",
  },
  {
    icon: Bot,
    label: "Sarvam AI Layer",
    sub: "sarvam-30b · Server-side only",
    dark: false,
    body: "sarvam-30b runs exclusively server-side via tool-calling. It evaluates gig descriptions and freelancer tech stacks to produce ranked match scores — no PII is ever sent to the model, complying with India's DPDP Act 2023.",
  },
  {
    icon: Key,
    label: "BridgeKey Layer",
    sub: "EIP-1193 Wallet",
    dark: true,
    body: "MST's official BridgeKey Chrome extension provides EVM-compatible EIP-1193 signing. Zentrix also supports standard MetaMask-compatible wallets via window.ethereum, auto-prompting a network switch to MST Testnet on connect.",
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

      {/* ── Hero bento — wide dark cell ────────────────────────────────── */}
      <div
        className="rounded-3xl p-8 sm:p-12 relative overflow-hidden"
        style={{ background: "var(--zx-ink)" }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-10"
          style={{ background: "var(--zx-primary)", filter: "blur(64px)" }}
        />
        <div
          className="absolute top-0 left-1/2 w-48 h-48 rounded-full opacity-8"
          style={{ background: "var(--zx-warning)", filter: "blur(56px)" }}
        />

        <div className="relative z-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
            style={{
              background: "rgba(216,64,64,0.18)",
              border: "1px solid rgba(216,64,64,0.3)",
              color: "var(--zx-primary)",
            }}
          >
            <Globe className="w-3 h-3" />
            MST Blockchain × NEWRRO Buildathon 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4" style={{ color: "var(--zx-cream)" }}>
            About{" "}
            <span style={{ color: "var(--zx-primary)" }}>Zentrix</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--zx-muted)" }}>
            An AI-assisted, escrow-backed freelance marketplace built natively on the MST
            Blockchain — where money, agreements, reputation, and access passes all live on-chain.
            AI advises; humans decide; the contract never has arbitrary custody of your funds.
          </p>
        </div>

        {/* Pull-quote */}
        <blockquote
          className="relative z-10 mt-8 p-5 rounded-2xl text-sm font-medium italic leading-relaxed max-w-lg"
          style={{
            background: "rgba(236,220,191,0.06)",
            borderLeft: "3px solid var(--zx-primary)",
            color: "var(--zx-cream)",
          }}
        >
          &ldquo;Don&apos;t just build on blockchain — build something that becomes strictly better
          because of blockchain.&rdquo;
        </blockquote>
      </div>

      {/* ── Architecture — 4-cell asymmetric bento ──────────────────────── */}
      <div>
        <h2 className="text-xl font-black mb-4" style={{ color: "var(--zx-ink)" }}>
          Technical Architecture
        </h2>
        {/* 2 rows × 2 cols, asymmetric: first row [1+3], second row [3+1] */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Firebase — narrow */}
          <div
            className="sm:col-span-1 rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(216,64,64,0.1)" }}
            >
              <Database className="w-5 h-5" style={{ color: "var(--zx-primary)" }} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: "var(--zx-primary)" }}>
                {ARCH_CELLS[0].sub}
              </div>
              <h3 className="font-black text-base" style={{ color: "var(--zx-ink)" }}>
                {ARCH_CELLS[0].label}
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--zx-muted)" }}>
              {ARCH_CELLS[0].body}
            </p>
          </div>

          {/* MST Chain — wide dark */}
          <div
            className="sm:col-span-3 rounded-3xl p-7 flex flex-col gap-4 relative overflow-hidden"
            style={{ background: "var(--zx-ink)" }}
          >
            <div
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: "var(--zx-primary)", filter: "blur(40px)" }}
            />
            <div className="relative z-10 flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(216,64,64,0.18)" }}
              >
                <Cpu className="w-5 h-5" style={{ color: "var(--zx-primary)" }} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: "var(--zx-primary)" }}>
                  {ARCH_CELLS[1].sub}
                </div>
                <h3 className="font-black text-base" style={{ color: "var(--zx-cream)" }}>
                  {ARCH_CELLS[1].label}
                </h3>
              </div>
            </div>
            <p className="relative z-10 text-xs leading-relaxed" style={{ color: "var(--zx-muted)" }}>
              {ARCH_CELLS[1].body}
            </p>
            {/* Chain ID pill */}
            <div
              className="relative z-10 self-start px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
              style={{ background: "rgba(236,220,191,0.08)", color: "var(--zx-cream)" }}
            >
              Chain ID: 91562037
            </div>
          </div>

          {/* Sarvam AI — wide */}
          <div
            className="sm:col-span-3 rounded-3xl p-7 flex flex-col gap-4 relative overflow-hidden"
            style={{ background: "var(--zx-ink)" }}
          >
            <div
              className="absolute bottom-0 left-0 w-48 h-32 rounded-full opacity-10"
              style={{ background: "var(--zx-warning)", filter: "blur(40px)" }}
            />
            <div className="relative z-10 flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(183,121,31,0.2)" }}
              >
                <Bot className="w-5 h-5" style={{ color: "var(--zx-warning)" }} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: "var(--zx-warning)" }}>
                  {ARCH_CELLS[2].sub}
                </div>
                <h3 className="font-black text-base" style={{ color: "var(--zx-cream)" }}>
                  {ARCH_CELLS[2].label}
                </h3>
              </div>
            </div>
            <p className="relative z-10 text-xs leading-relaxed" style={{ color: "var(--zx-muted)" }}>
              {ARCH_CELLS[2].body}
            </p>
            <div
              className="relative z-10 self-start px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
              style={{ background: "rgba(183,121,31,0.14)", color: "var(--zx-warning)" }}
            >
              Server-side only · Zero PII
            </div>
          </div>

          {/* BridgeKey — narrow */}
          <div
            className="sm:col-span-1 rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(42,15,15,0.08)" }}
            >
              <Key className="w-5 h-5" style={{ color: "var(--zx-ink)" }} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: "var(--zx-muted)" }}>
                {ARCH_CELLS[3].sub}
              </div>
              <h3 className="font-black text-base" style={{ color: "var(--zx-ink)" }}>
                {ARCH_CELLS[3].label}
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--zx-muted)" }}>
              {ARCH_CELLS[3].body}
            </p>
          </div>
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

      {/* ── Mission + Team — dark cell ──────────────────────────────────── */}
      <div
        className="rounded-3xl p-8 sm:p-12 relative overflow-hidden"
        style={{ background: "var(--zx-ink)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background:
              "repeating-linear-gradient(45deg, var(--zx-primary) 0px, var(--zx-primary) 1px, transparent 1px, transparent 24px)",
          }}
        />
        <div className="relative z-10 max-w-3xl space-y-6">
          <h2 className="text-2xl font-black" style={{ color: "var(--zx-cream)" }}>
            Mission &amp; Philosophy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                className="p-5 rounded-2xl flex flex-col gap-2"
                style={{
                  background: "rgba(236,220,191,0.05)",
                  border: "1px solid rgba(236,220,191,0.1)",
                }}
              >
                <span className="text-xs font-black" style={{ color: "var(--zx-primary)" }}>
                  {title}
                </span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--zx-muted)" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--zx-muted)", opacity: 0.6 }}>
            Zentrix — MST Blockchain × NEWRRO Buildathon 2026 · BMS College of Engineering, Bengaluru
          </p>
        </div>
      </div>
    </div>
  );
};
