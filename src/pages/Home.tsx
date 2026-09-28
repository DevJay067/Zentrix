import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Bot,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--zx-surface)] border border-[var(--zx-border)] text-xs font-semibold text-[var(--zx-primary-deep)] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[var(--zx-success)] animate-pulse" />
          <span>Live on MST Blockchain Testnet · Chain ID 91562037</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--zx-ink)] leading-tight">
          Where Autonomous <span className="text-[var(--zx-primary-deep)]">Escrow</span> Meets Intelligent{" "}
          <span className="text-[var(--zx-primary)]">AI Matching</span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--zx-muted)] max-w-2xl mx-auto leading-relaxed">
          Zentrix eliminates freelance payment anxiety and hiring friction. Smart milestone escrow locks funds on-chain,
          while Sarvam AI instantly connects clients with verified talent.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/marketplace" className="btn-primary text-base py-3 px-6 w-full sm:w-auto shadow-md">
            <span>Explore Marketplace</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/agent" className="btn-secondary text-base py-3 px-6 w-full sm:w-auto shadow-xs">
            <Bot className="w-5 h-5" />
            <span>Launch AI Agent</span>
          </Link>
        </div>

        {/* Live Metrics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          <div className="card-surface p-4 text-center">
            <div className="text-2xl font-black text-[var(--zx-primary-deep)]">0%</div>
            <div className="text-xs text-[var(--zx-muted)] font-medium mt-1">Platform Commission</div>
          </div>
          <div className="card-surface p-4 text-center">
            <div className="text-2xl font-black text-[var(--zx-primary-deep)]">72h</div>
            <div className="text-xs text-[var(--zx-muted)] font-medium mt-1">Auto-Release Guarantee</div>
          </div>
          <div className="card-surface p-4 text-center">
            <div className="text-2xl font-black text-[var(--zx-primary-deep)]">100%</div>
            <div className="text-xs text-[var(--zx-muted)] font-medium mt-1">Non-Custodial Escrow</div>
          </div>
          <div className="card-surface p-4 text-center">
            <div className="text-2xl font-black text-[var(--zx-primary-deep)]">Soulbound</div>
            <div className="text-xs text-[var(--zx-muted)] font-medium mt-1">Portable Reputation</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-[var(--zx-ink)]">
            Built for Real-World Trust on MST
          </h2>
          <p className="text-sm text-[var(--zx-muted)]">
            Don&apos;t just build on blockchain — build something that becomes strictly better because of blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="card-surface card-surface-hover flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--zx-surface-alt)] flex items-center justify-center text-[var(--zx-primary-deep)]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--zx-ink)]">Trust-Minimized Escrow</h3>
              <p className="text-sm text-[var(--zx-muted)] leading-relaxed">
                Client deposits tMSTC upfront into the smart contract. Funds are released per milestone upon approval,
                with automatic release if the client is inactive past the review window.
              </p>
            </div>
            <ul className="text-xs text-[var(--zx-ink)] space-y-2 pt-2 border-t border-[var(--zx-border)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Pull-payment withdrawal pattern</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Negotiable deadline consensus</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Fair arbiter dispute resolution</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="card-surface card-surface-hover flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--zx-surface-alt)] flex items-center justify-center text-[var(--zx-primary-deep)]">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--zx-ink)]">Sarvam AI Matchmaker</h3>
              <p className="text-sm text-[var(--zx-muted)] leading-relaxed">
                Powered by Sarvam 30B LLM via server-side tool calling. Evaluates gig specifications, matching skills,
                budgets, and delivery requirements with complete PII redaction.
              </p>
            </div>
            <ul className="text-xs text-[var(--zx-ink)] space-y-2 pt-2 border-t border-[var(--zx-border)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Zero personal data exposure</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Role-gated search tools</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Pass NFT tiered query credits</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="card-surface card-surface-hover flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--zx-surface-alt)] flex items-center justify-center text-[var(--zx-primary-deep)]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--zx-ink)]">Soulbound Credentials</h3>
              <p className="text-sm text-[var(--zx-muted)] leading-relaxed">
                Completed gigs automatically mint non-transferable ERC-721 reputation credentials directly to the
                freelancer&apos;s wallet. Reputation cannot be purchased, faked, or stolen.
              </p>
            </div>
            <ul className="text-xs text-[var(--zx-ink)] space-y-2 pt-2 border-t border-[var(--zx-border)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Non-transferable ERC-721 token</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Cryptographic proof of work</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Transparent rating history</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works / Golden Path Walkthrough */}
      <section className="card-surface p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-[var(--zx-ink)]">The Golden Path Lifecycle</h2>
          <p className="text-sm text-[var(--zx-muted)]">
            Step-by-step workflow from contract creation to milestone payout on MST Testnet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] space-y-2">
            <div className="text-xs font-bold text-[var(--zx-primary-deep)] uppercase">Step 01</div>
            <div className="font-bold text-sm text-[var(--zx-ink)]">Post Gig & Milestones</div>
            <p className="text-xs text-[var(--zx-muted)]">
              Client specifies milestone amounts, deliverables, and acceptance criteria.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] space-y-2">
            <div className="text-xs font-bold text-[var(--zx-primary-deep)] uppercase">Step 02</div>
            <div className="font-bold text-sm text-[var(--zx-ink)]">AI Match & Assign</div>
            <p className="text-xs text-[var(--zx-muted)]">
              Sarvam AI recommends the best talent. Client assigns freelancer and deposits tMSTC into Escrow.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] space-y-2">
            <div className="text-xs font-bold text-[var(--zx-primary-deep)] uppercase">Step 03</div>
            <div className="font-bold text-sm text-[var(--zx-ink)]">Deliver & Verify</div>
            <p className="text-xs text-[var(--zx-muted)]">
              Freelancer submits evidence CID. Client reviews within 72 hours, or funds auto-release.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] space-y-2">
            <div className="text-xs font-bold text-[var(--zx-primary-deep)] uppercase">Step 04</div>
            <div className="font-bold text-sm text-[var(--zx-ink)]">Payout & Reputation</div>
            <p className="text-xs text-[var(--zx-muted)]">
              Funds are instantly withdrawable by freelancer. Final milestone mints a Soulbound Reputation NFT!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
