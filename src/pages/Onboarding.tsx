import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import { ShieldCheck, UserCheck, Briefcase, Wallet, ArrowRight, RefreshCw } from "lucide-react";

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, saveOnboarding } = useAuth();
  const { address, isConnected, connectWallet, signMessage } = useWallet();

  const [step, setStep] = useState<1 | 2>(1); // 1 = Role & Details, 2 = Wallet Connection
  const [role, setRole] = useState<UserRole>("freelancer");
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] = useState("");
  const [industryTags, setIndustryTags] = useState<string>("Web3, DeFi");
  const [expertise, setExpertise] = useState<string>("Solidity, React, Next.js");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureStatus, setSignatureStatus] = useState<string | null>(null);

  const handleStepOneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleWalletBinding = async () => {
    let activeAddr = address;
    if (!isConnected || !activeAddr) {
      activeAddr = await connectWallet();
      if (!activeAddr) return;
    }

    setIsSubmitting(true);
    setSignatureStatus("Requesting cryptographic binding signature via BridgeKey...");

    try {
      // 1. Fetch nonce from server
      const nonceRes = await fetch(`/api/auth/nonce?address=${activeAddr}`);
      const { nonce } = await nonceRes.json();

      // 2. Request user signature in BridgeKey
      const sig = await signMessage(nonce);

      // 3. Verify on server
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: activeAddr,
          signature: sig,
          message: nonce,
        }),
      });

      if (!verifyRes.ok) {
        throw new Error("Signature verification failed.");
      }

      setSignatureStatus("Signature verified on-chain. Saving profile...");

      // 4. Save profile to Firestore
      await saveOnboarding(
        {
          name,
          email,
          phone,
          designation,
          organization,
          industryTags: industryTags.split(",").map((s) => s.trim()).filter(Boolean),
          expertise: expertise.split(",").map((s) => s.trim()).filter(Boolean),
        },
        role,
        activeAddr
      );

      // 5. Navigate to Dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Binding failed:", err);
      alert(err?.message || "Failed to bind wallet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between text-xs font-bold text-[var(--zx-muted)] px-2">
        <span className={step >= 1 ? "text-[var(--zx-primary-deep)]" : ""}>1. Role & Profile</span>
        <span>→</span>
        <span className={step >= 2 ? "text-[var(--zx-primary-deep)]" : ""}>2. Mandatory BridgeKey Binding</span>
        <span>→</span>
        <span>3. Ready</span>
      </div>

      <div className="card-surface p-6 sm:p-8 space-y-6 shadow-md">
        {step === 1 ? (
          /* Step 1: Role Selection & Onboarding Details */
          <form onSubmit={handleStepOneSubmit} className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--zx-ink)]">Choose Your Primary Role</h2>
              <p className="text-xs text-[var(--zx-muted)] mt-1">
                You can switch between Client and Freelancer views anytime from the navbar.
              </p>
            </div>

            {/* Role Radio Cards */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === "client"
                    ? "border-[var(--zx-primary-deep)] bg-[var(--zx-cream)] shadow-xs"
                    : "border-[var(--zx-border)] bg-[var(--zx-surface)] hover:bg-[var(--zx-surface-alt)]"
                }`}
              >
                <Briefcase className="w-5 h-5 text-[var(--zx-primary-deep)] mb-2" />
                <div className="font-bold text-sm text-[var(--zx-ink)]">Client</div>
                <div className="text-[11px] text-[var(--zx-muted)] mt-0.5">I want to hire talent & fund gigs</div>
              </button>

              <button
                type="button"
                onClick={() => setRole("freelancer")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === "freelancer"
                    ? "border-[var(--zx-primary-deep)] bg-[var(--zx-cream)] shadow-xs"
                    : "border-[var(--zx-border)] bg-[var(--zx-surface)] hover:bg-[var(--zx-surface-alt)]"
                }`}
              >
                <UserCheck className="w-5 h-5 text-[var(--zx-primary-deep)] mb-2" />
                <div className="font-bold text-sm text-[var(--zx-ink)]">Freelancer</div>
                <div className="text-[11px] text-[var(--zx-muted)] mt-0.5">I want to work & build reputation</div>
              </button>
            </div>

            {/* Common Fields */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">
                  Designation / Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Lead Smart Contract Architect"
                  className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)]"
                />
              </div>

              {role === "client" && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Web3 Labs Bengaluru"
                    className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">
                  Phone (Stored Privately, DPDP Compliant)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">
                  Industry Tags (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={industryTags}
                  onChange={(e) => setIndustryTags(e.target.value)}
                  placeholder="Web3, DeFi, AI, Smart Contracts"
                  className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)]"
                />
              </div>

              {role === "freelancer" && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">
                    Expertise & Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="Solidity, React, Hardhat, Rust, Ethers"
                    className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)]"
                  />
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary w-full text-xs py-3 shadow-md flex items-center justify-center gap-2">
              <span>Next: Connect & Bind Wallet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Step 2: Mandatory BridgeKey Wallet Binding */
          <div className="space-y-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--zx-surface-alt)] text-[var(--zx-primary-deep)] flex items-center justify-center mx-auto">
              <Wallet className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[var(--zx-ink)]">Connect BridgeKey Wallet</h2>
              <p className="text-xs text-[var(--zx-muted)] max-w-sm mx-auto">
                To guarantee non-repudiation on MST Blockchain, all escrow milestones and reputation credentials
                require a cryptographically bound wallet.
              </p>
            </div>

            {address && (
              <div className="p-3 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] font-mono text-xs text-[var(--zx-ink)] truncate">
                Selected: {address}
              </div>
            )}

            {signatureStatus && (
              <div className="p-3 rounded-xl bg-[var(--zx-surface-alt)] text-xs text-[var(--zx-primary-deep)] font-medium">
                {signatureStatus}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="btn-secondary text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleWalletBinding}
                disabled={isSubmitting}
                className="btn-primary text-xs py-2.5 px-6 shadow-md flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Binding...
                  </span>
                ) : (
                  <span>Sign & Bind Wallet</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
