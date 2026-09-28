import React, { useState } from "react";
import {
  Lock,
  FileCheck,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Coins,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const EscrowFlowInfographic: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: "01",
      title: "100% Upfront Funding",
      subtitle: "Client locks tMSTC in contract",
      icon: <Lock className="w-5 h-5 text-[var(--zx-primary-deep)]" />,
      detail:
        "The client deposits the entire project value upfront into the non-custodial ZentrixEscrow smart contract. No middleman holds the funds.",
      tag: "Client Deposit",
    },
    {
      step: "02",
      title: "Milestone Execution",
      subtitle: "Freelancer begins work",
      icon: <Coins className="w-5 h-5 text-[var(--zx-warning)]" />,
      detail:
        "Freelancer develops against the clear acceptance criteria agreed in the on-chain milestone schedule. Both parties can mutually negotiate deadlines.",
      tag: "Active Sprint",
    },
    {
      step: "03",
      title: "Proof Submission",
      subtitle: "Evidence CID anchored",
      icon: <FileCheck className="w-5 h-5 text-[var(--zx-primary)]" />,
      detail:
        "The freelancer submits pull requests, commit hashes, or IPFS documentation CIDs directly on-chain as cryptographic proof of delivery.",
      tag: "Verification CID",
    },
    {
      step: "04",
      title: "72h Auto-Release",
      subtitle: "Protection against ghosting",
      icon: <Clock className="w-5 h-5 text-[var(--zx-primary-deep)]" />,
      detail:
        "Client has 72 hours to review the milestone. If the client is inactive past the review window, funds auto-release to the freelancer automatically.",
      tag: "Smart Guarantee",
    },
    {
      step: "05",
      title: "Pull Payout & SBT Mint",
      subtitle: "Reputation + withdrawable balance",
      icon: <Award className="w-5 h-5 text-[var(--zx-success)]" />,
      detail:
        "Funds become instantly withdrawable via the pull-payment pattern. The final milestone mints a non-transferable Soulbound Reputation NFT.",
      tag: "Soulbound Token",
    },
  ];

  return (
    <div
      className="rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-md"
      style={{
        background: "var(--zx-surface)",
        border: "1px solid var(--zx-border)",
      }}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full"
              style={{ background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }}
            >
              Interactive Infographic
            </span>
            <span className="text-xs font-semibold" style={{ color: "var(--zx-muted)" }}>
              MST Testnet Lifecycle
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-1" style={{ color: "var(--zx-ink)" }}>
            How Zentrix Escrow Protects Both Sides
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: "var(--zx-muted)" }}>
            Step {activeStep + 1} of 5
          </span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{
                  background:
                    activeStep === i
                      ? "var(--zx-primary-deep)"
                      : "var(--zx-border)",
                  transform: activeStep === i ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Schematic Timeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {steps.map((s, idx) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(idx)}
            className={`p-3.5 rounded-2xl text-left transition-all relative ${
              activeStep === idx
                ? "shadow-md scale-[1.02]"
                : "opacity-80 hover:opacity-100"
            }`}
            style={{
              background:
                activeStep === idx
                  ? "var(--zx-cream)"
                  : "var(--zx-surface-alt)",
              border: `1.5px solid ${
                activeStep === idx
                  ? "var(--zx-primary-deep)"
                  : "var(--zx-border)"
              }`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] font-mono font-black"
                style={{ color: "var(--zx-primary-deep)" }}
              >
                {s.step}
              </span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                style={{ background: "var(--zx-surface)" }}
              >
                {s.icon}
              </div>
            </div>
            <div className="font-black text-xs truncate" style={{ color: "var(--zx-ink)" }}>
              {s.title}
            </div>
            <div className="text-[10px] truncate" style={{ color: "var(--zx-muted)" }}>
              {s.tag}
            </div>
          </button>
        ))}
      </div>

      {/* Active Step Detailed Showcase */}
      <div
        className="p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "var(--zx-cream)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}
          >
            {steps[activeStep].icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase" style={{ color: "var(--zx-primary-deep)" }}>
                Stage {steps[activeStep].step}
              </span>
              <span className="text-xs font-bold" style={{ color: "var(--zx-ink)" }}>
                — {steps[activeStep].title}
              </span>
            </div>
            <p className="text-xs mt-0.5 leading-relaxed max-w-2xl" style={{ color: "var(--zx-muted)" }}>
              {steps[activeStep].detail}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveStep((activeStep + 1) % steps.length)}
          className="self-end sm:self-center px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105"
          style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}
        >
          <span>Next Step</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
