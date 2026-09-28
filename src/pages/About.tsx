import React from "react";
import { ShieldCheck, Cpu, Globe, FileCode2, Scale } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--zx-ink)]">
          About <span className="text-[var(--zx-primary-deep)]">Zentrix</span>
        </h1>
        <p className="text-base text-[var(--zx-muted)] leading-relaxed">
          Zentrix is an AI-assisted, escrow-backed freelance marketplace engineered natively for the MST Blockchain,
          built for the MST Blockchain × NEWRRO Buildathon 2026 at BMS College of Engineering, Bengaluru.
        </p>
      </div>

      {/* The Core Pitch: Why Blockchain? */}
      <section className="card-surface p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-[var(--zx-primary-deep)]">
          <Scale className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-[var(--zx-ink)]">Why Blockchain?</h2>
        </div>
        <p className="text-sm text-[var(--zx-muted)] leading-relaxed">
          Traditional freelance platforms act as rent-seeking middlemen, charging 10–20% in fees while maintaining
          arbitrary control over fund releases and account suspensions.
        </p>
        <blockquote className="p-4 rounded-xl bg-[var(--zx-cream)] border-l-4 border-[var(--zx-primary-deep)] text-sm font-medium text-[var(--zx-ink)] italic">
          &ldquo;Don&apos;t just build on blockchain — build something that becomes strictly better because of blockchain.&rdquo;
        </blockquote>
        <p className="text-sm text-[var(--zx-muted)] leading-relaxed">
          In Zentrix, <strong>money, agreements, reputation, and subscription access live on-chain</strong>.
          Payment release, evidence hashes, and portable reputation are enforced by immutable smart contract logic,
          not by corporate promises. AI advises; humans decide; the agent never has direct custody of your funds.
        </p>
      </section>

      {/* Technical Architecture */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--zx-ink)]">Technical Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--zx-ink)]">
              <Cpu className="w-4 h-4 text-[var(--zx-primary-deep)]" />
              <span>MST Blockchain Testnet</span>
            </div>
            <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
              Target Chain ID: <code className="font-mono text-[var(--zx-primary-deep)]">91562037</code>. All smart
              contracts (<code className="font-mono">ZentrixEscrow</code>, <code className="font-mono">ZentrixReputation</code>,{" "}
              <code className="font-mono">ZentrixPass</code>) are deployed on MST Testnet using OpenZeppelin v5 standards.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--zx-ink)]">
              <FileCode2 className="w-4 h-4 text-[var(--zx-primary-deep)]" />
              <span>Sarvam 30B AI Engine</span>
            </div>
            <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
              Server-side tool calling via <code className="font-mono">sarvam-30b</code>. Agent evaluates gig requirements,
              freelancer tech stacks, and delivery timelines with zero PII exposure, respecting India&apos;s DPDP Act 2023.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--zx-ink)]">
              <ShieldCheck className="w-4 h-4 text-[var(--zx-primary-deep)]" />
              <span>Non-Custodial Security</span>
            </div>
            <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
              Reentrancy protection, checks-effects-interactions, and pull-payment withdrawals ensure users maintain full
              sovereignty over their earned and withdrawable balances.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--zx-ink)]">
              <Globe className="w-4 h-4 text-[var(--zx-primary-deep)]" />
              <span>BridgeKey Integration</span>
            </div>
            <p className="text-xs text-[var(--zx-muted)] leading-relaxed">
              Native support for MST&apos;s official BridgeKey Chrome extension and EVM wallet standards, providing seamless
              EIP-1193 signature authentication and transaction dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* Network Specifications Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--zx-ink)]">Verified Network Parameters</h2>
        <div className="overflow-x-auto card-surface p-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[var(--zx-surface-alt)] text-[var(--zx-ink)] font-bold">
              <tr>
                <th className="p-3">Parameter</th>
                <th className="p-3">Testnet Value</th>
                <th className="p-3">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--zx-border)] text-[var(--zx-muted)] font-mono">
              <tr>
                <td className="p-3 font-semibold text-[var(--zx-ink)] font-sans">Network Name</td>
                <td className="p-3">MST Testnet</td>
                <td className="p-3">Official Docs</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--zx-ink)] font-sans">Chain ID</td>
                <td className="p-3">91562037 (0x5752035)</td>
                <td className="p-3">Verified RPC</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--zx-ink)] font-sans">RPC URL</td>
                <td className="p-3 truncate max-w-xs">https://testnetrpc.mstblockchain.com</td>
                <td className="p-3">Testnet Node</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--zx-ink)] font-sans">Token Symbol</td>
                <td className="p-3">tMSTC</td>
                <td className="p-3">MSTScan</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--zx-ink)] font-sans">Block Explorer</td>
                <td className="p-3">
                  <a
                    href="https://testnet.mstscan.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--zx-primary-deep)] underline"
                  >
                    testnet.mstscan.com
                  </a>
                </td>
                <td className="p-3">Official Explorer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
