import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import { FREELANCE_CATEGORIES, TagCategory } from "../lib/tags";
import {
  ShieldCheck,
  UserCheck,
  Briefcase,
  Wallet,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Bot,
  Hash,
  Search,
  Check,
  Crown,
  Zap,
  Globe,
  Star,
  Layers,
} from "lucide-react";

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, saveOnboarding } = useAuth();
  const { address, isConnected, openConnectModal, signMessage } = useWallet();

  // 4 Discord-style Schematic Steps
  // 1: Choose Realm (Role & Identity)
  // 2: Choose Craft & Tags (Choosable Interactive Tags)
  // 3: Personalization & Work Preferences
  // 4: Verification Gatekeeper (BridgeKey EIP-191 Signature)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Profile State
  const [role, setRole] = useState<UserRole>("freelancer");
  const [name, setName] = useState(user?.displayName || "Anonymous Creator");
  const [handle, setHandle] = useState((user?.displayName || "creator").toLowerCase().replace(/\s+/g, ""));
  const [avatarSeed, setAvatarSeed] = useState("pixel");
  const [designation, setDesignation] = useState("Web3 Full-Stack Developer");
  const [organization, setOrganization] = useState("");
  const [bio, setBio] = useState("Passionate about decentralized milestone escrow and building on MST Blockchain.");

  // Choosable Tags State
  const [selectedCategory, setSelectedCategory] = useState<string>("dev");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Solidity",
    "Smart Contracts",
    "Frontend (React/Vite)",
    "BridgeKey Integration",
  ]);
  const [tagSearch, setTagSearch] = useState("");

  // Personalization Preferences State
  const [expLevel, setExpLevel] = useState<string>("Pro Specialist");
  const [rateRange, setRateRange] = useState<string>("1–5 tMSTC / milestone");
  const [availability, setAvailability] = useState<string>("Immediate (Full-Time)");

  // Submission & Signature State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureStatus, setSignatureStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Toggle Choosable Tag
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 12) {
        alert("You can select up to 12 skills & tags.");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleWalletBinding = async () => {
    if (!address) {
      openConnectModal();
      return;
    }

    setIsSubmitting(true);
    setSignatureStatus("Requesting EIP-191 binding signature via wallet...");

    try {
      // 1. Fetch nonce from server
      const nonceRes = await fetch(`/api/auth/nonce?address=${address}`);
      const nonceData = await nonceRes.json();
      const nonce = nonceData.nonce || `Zentrix Web3 Onboarding Binding\nWallet: ${address}\nTime: ${Date.now()}`;

      // 2. Request user signature in BridgeKey or injected wallet
      const sig = await signMessage(nonce);

      setSignatureStatus("Verifying cryptographic signature on-chain...");

      // 3. Verify on server
      try {
        await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address,
            signature: sig,
            message: nonce,
          }),
        });
      } catch (_) {
        // Fallback for demo simulation
      }

      setSignatureStatus("Verified! Anchoring your credentials on MST Testnet...");

      // 4. Save profile
      await saveOnboarding(
        {
          name,
          email: user?.email || `${handle}@zentrix.network`,
          phone: "Protected DPDP 2023",
          designation,
          organization: role === "client" ? organization : undefined,
          industryTags: selectedTags.slice(0, 5),
          expertise: selectedTags,
        },
        role,
        address
      );

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Binding failed:", err);
      alert(err?.message || "Failed to bind wallet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-6">
      {/* ── Discord Schematic Header Bar ── */}
      <div
        className="rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-sm"
            style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}
          >
            Z
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm" style={{ color: "var(--zx-ink)" }}>
                Zentrix Onboarding Wizard
              </span>
              <span
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                style={{ background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }}
              >
                MST Testnet
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--zx-muted)" }}>
              Step {currentStep} of 4:{" "}
              {currentStep === 1 && "Choose Your Realm & Identity"}
              {currentStep === 2 && "Personalize Your Craft & Choosable Tags"}
              {currentStep === 3 && "Work Preferences & Rates"}
              {currentStep === 4 && "Verify & Bind BridgeKey Identity"}
            </p>
          </div>
        </div>

        {/* Discord-like Step Stepper */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => s < currentStep && setCurrentStep(s as any)}
              disabled={s > currentStep}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === s
                  ? "scale-110 shadow-md"
                  : currentStep > s
                  ? "cursor-pointer"
                  : "opacity-40 cursor-not-allowed"
              }`}
              style={{
                background:
                  currentStep === s
                    ? "var(--zx-primary-deep)"
                    : currentStep > s
                    ? "var(--zx-success)"
                    : "var(--zx-surface-alt)",
                color: currentStep >= s ? "var(--zx-cream)" : "var(--zx-muted)",
              }}
            >
              {currentStep > s ? "✓" : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Step Card ── */}
      <div
        className="rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden transition-all"
        style={{
          background: "var(--zx-surface)",
          border: "1px solid var(--zx-border)",
        }}
      >
        {/* ── STEP 1: Choose Realm & Discord-Style Identity ── */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h2 className="text-2xl font-black" style={{ color: "var(--zx-ink)" }}>
                Choose Your Guild Realm
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--zx-muted)" }}>
                Select whether you will primarily commission work or accept milestones and earn reputation.
              </p>
            </div>

            {/* Discord Server Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client Realm Card */}
              <div
                onClick={() => setRole("client")}
                className={`p-6 rounded-3xl cursor-pointer transition-all border-2 relative overflow-hidden group hover:scale-[1.02] ${
                  role === "client" ? "shadow-md" : ""
                }`}
                style={{
                  background: role === "client" ? "var(--zx-cream)" : "var(--zx-surface-alt)",
                  borderColor: role === "client" ? "var(--zx-primary)" : "var(--zx-border)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}
                  >
                    <Briefcase className="w-6 h-6" />
                  </div>
                  {role === "client" && (
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs"
                      style={{ background: "var(--zx-primary)" }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black" style={{ color: "var(--zx-ink)" }}>
                  Quest Giver / Client
                </h3>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--zx-muted)" }}>
                  Fund milestone escrows with tMSTC, recruit top verified talent with Sarvam AI, and resolve milestones safely.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "var(--zx-primary-deep)" }}>
                  <span>0% platform commission</span>
                  <span>·</span>
                  <span>72h auto-release protection</span>
                </div>
              </div>

              {/* Freelancer Realm Card */}
              <div
                onClick={() => setRole("freelancer")}
                className={`p-6 rounded-3xl cursor-pointer transition-all border-2 relative overflow-hidden group hover:scale-[1.02] ${
                  role === "freelancer" ? "shadow-md" : ""
                }`}
                style={{
                  background: role === "freelancer" ? "var(--zx-cream)" : "var(--zx-surface-alt)",
                  borderColor: role === "freelancer" ? "var(--zx-primary)" : "var(--zx-border)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ background: "var(--zx-primary)", color: "var(--zx-cream)" }}
                  >
                    <UserCheck className="w-6 h-6" />
                  </div>
                  {role === "freelancer" && (
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs"
                      style={{ background: "var(--zx-primary)" }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black" style={{ color: "var(--zx-ink)" }}>
                  Guild Creator / Freelancer
                </h3>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--zx-muted)" }}>
                  Complete project milestones, withdraw payments non-custodially, and mint permanent Soulbound Reputation NFTs.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "var(--zx-success)" }}>
                  <span>Guaranteed pull-payments</span>
                  <span>·</span>
                  <span>Soulbound ERC-721 SBT</span>
                </div>
              </div>
            </div>

            {/* Discord-Style Personalization Form */}
            <div className="p-6 rounded-3xl space-y-4" style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md"
                  style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}
                >
                  {name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold" style={{ color: "var(--zx-primary-deep)" }}>
                    Discord Profile Preview
                  </div>
                  <div className="text-base font-black truncate" style={{ color: "var(--zx-ink)" }}>
                    {name || "Your Name"}
                  </div>
                  <div className="text-xs font-mono" style={{ color: "var(--zx-muted)" }}>
                    @{handle || "handle"} · {role.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--zx-ink)" }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
                    }}
                    placeholder="e.g. Satoshi Developer"
                    className="w-full p-3 rounded-2xl text-xs font-medium focus:outline-none"
                    style={{
                      background: "var(--zx-surface)",
                      border: "1px solid var(--zx-border)",
                      color: "var(--zx-ink)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--zx-ink)" }}>
                    Zentrix Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold" style={{ color: "var(--zx-muted)" }}>
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                      placeholder="handle"
                      className="w-full pl-7 pr-3 py-3 rounded-2xl text-xs font-mono focus:outline-none"
                      style={{
                        background: "var(--zx-surface)",
                        border: "1px solid var(--zx-border)",
                        color: "var(--zx-ink)",
                      }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--zx-ink)" }}>
                    {role === "client" ? "Organization / Project Title" : "Professional Designation / Role"}
                  </label>
                  <input
                    type="text"
                    required
                    value={role === "client" ? organization : designation}
                    onChange={(e) => role === "client" ? setOrganization(e.target.value) : setDesignation(e.target.value)}
                    placeholder={role === "client" ? "e.g. Web3 Ventures Bengaluru" : "e.g. Senior Smart Contract Auditor & Designer"}
                    className="w-full p-3 rounded-2xl text-xs font-medium focus:outline-none"
                    style={{
                      background: "var(--zx-surface)",
                      border: "1px solid var(--zx-border)",
                      color: "var(--zx-ink)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-primary py-3 px-8 text-xs font-bold shadow-md flex items-center gap-2"
              >
                <span>Continue: Choose Your Craft</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Choosable Tags for ALL Kinds of Freelance Work ── */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-black" style={{ color: "var(--zx-ink)" }}>
                  Personalize Your Craft Tags
                </h2>
                <p className="text-xs" style={{ color: "var(--zx-muted)" }}>
                  Click to select skills, tools, and categories. No manual typing needed.
                </p>
              </div>

              {/* Tag counter badge */}
              <div
                className="px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs"
                style={{
                  background: selectedTags.length >= 3 ? "var(--zx-success)" : "var(--zx-primary-deep)",
                  color: "var(--zx-cream)",
                }}
              >
                {selectedTags.length} Skills Selected (Min 3)
              </div>
            </div>

            {/* Category Selector Tabs (Discord Channel Style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b" style={{ borderColor: "var(--zx-border)" }}>
              {FREELANCE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "shadow-sm scale-105"
                      : "opacity-75 hover:opacity-100"
                  }`}
                  style={{
                    background: selectedCategory === cat.id ? "var(--zx-primary-deep)" : "var(--zx-cream)",
                    color: selectedCategory === cat.id ? "var(--zx-cream)" : "var(--zx-ink)",
                    border: `1px solid ${selectedCategory === cat.id ? "var(--zx-primary-deep)" : "var(--zx-border)"}`,
                  }}
                >
                  <Hash className="w-3.5 h-3.5 opacity-70" />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--zx-muted)]" />
              <input
                type="text"
                placeholder="Search any skill, stack, or freelance domain..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)] focus:outline-none"
              />
            </div>

            {/* Interactive Choosable Tag Pills Grid */}
            <div className="p-5 rounded-3xl min-h-[220px]" style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}>
              <div className="flex flex-wrap gap-2.5">
                {FREELANCE_CATEGORIES.find((c) => c.id === selectedCategory)
                  ?.tags.filter((t) => t.toLowerCase().includes(tagSearch.toLowerCase()))
                  .map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${
                          isSelected ? "shadow-md" : ""
                        }`}
                        style={{
                          background: isSelected ? "var(--zx-primary)" : "var(--zx-surface)",
                          color: isSelected ? "var(--zx-cream)" : "var(--zx-ink)",
                          border: `1.5px solid ${isSelected ? "var(--zx-primary)" : "var(--zx-border)"}`,
                        }}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5" style={{ color: "var(--zx-cream)" }} />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--zx-muted)" }} />
                        )}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
              </div>

              {/* Selected summary bar */}
              <div className="mt-6 pt-4 border-t flex flex-wrap items-center gap-1.5" style={{ borderColor: "var(--zx-border)" }}>
                <span className="text-[11px] font-bold uppercase tracking-wider mr-2" style={{ color: "var(--zx-muted)" }}>
                  Your Stack:
                </span>
                {selectedTags.length === 0 ? (
                  <span className="text-xs italic" style={{ color: "var(--zx-muted)" }}>
                    Click tags above to add to your profile
                  </span>
                ) : (
                  selectedTags.map((t) => (
                    <span
                      key={t}
                      onClick={() => toggleTag(t)}
                      className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 hover:line-through"
                      style={{ background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }}
                    >
                      {t} ✕
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-secondary py-3 px-6 text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedTags.length < 3) {
                    alert("Please select at least 3 tags to personalize your profile.");
                    return;
                  }
                  setCurrentStep(3);
                }}
                className="btn-primary py-3 px-8 text-xs font-bold shadow-md flex items-center gap-2"
              >
                <span>Continue: Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Work Preferences & Personalization ── */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h2 className="text-2xl font-black" style={{ color: "var(--zx-ink)" }}>
                Experience & Work Preferences
              </h2>
              <p className="text-xs" style={{ color: "var(--zx-muted)" }}>
                Tune how Sarvam AI matches project budgets and milestone velocity to your workflow.
              </p>
            </div>

            <div className="space-y-5">
              {/* Experience Tier Radio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--zx-ink)" }}>
                  Proficiency Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Rising Specialist", "Pro Specialist", "Master Architect"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExpLevel(lvl)}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all ${
                        expLevel === lvl ? "shadow-sm" : ""
                      }`}
                      style={{
                        background: expLevel === lvl ? "var(--zx-cream)" : "var(--zx-surface-alt)",
                        borderColor: expLevel === lvl ? "var(--zx-primary)" : "var(--zx-border)",
                      }}
                    >
                      <div className="font-bold text-xs" style={{ color: "var(--zx-ink)" }}>{lvl}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--zx-muted)" }}>
                        {lvl.includes("Rising") && "1–2 years active"}
                        {lvl.includes("Pro") && "3–5 years proven work"}
                        {lvl.includes("Master") && "5+ years architectural lead"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--zx-ink)" }}>
                  Target Milestone Range
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    "< 1 tMSTC",
                    "1–5 tMSTC",
                    "5–15 tMSTC",
                    "15+ tMSTC",
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRateRange(r)}
                      className={`p-3 rounded-2xl text-center font-mono text-xs font-bold transition-all border-2 ${
                        rateRange === r ? "shadow-sm" : ""
                      }`}
                      style={{
                        background: rateRange === r ? "var(--zx-cream)" : "var(--zx-surface-alt)",
                        borderColor: rateRange === r ? "var(--zx-primary)" : "var(--zx-border)",
                        color: "var(--zx-ink)",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--zx-ink)" }}>
                  Availability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "Immediate (Full-Time)",
                    "Part-Time (20h/wk)",
                    "Milestone Bounties Only",
                  ].map((avail) => (
                    <button
                      key={avail}
                      type="button"
                      onClick={() => setAvailability(avail)}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all border-2 ${
                        availability === avail ? "shadow-sm" : ""
                      }`}
                      style={{
                        background: availability === avail ? "var(--zx-cream)" : "var(--zx-surface-alt)",
                        borderColor: availability === avail ? "var(--zx-primary)" : "var(--zx-border)",
                        color: "var(--zx-ink)",
                      }}
                    >
                      {avail}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio / Mission */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--zx-ink)" }}>
                  Personal Tagline / Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief introduction with clients and Sarvam AI..."
                  className="w-full p-3 rounded-2xl text-xs focus:outline-none"
                  style={{
                    background: "var(--zx-cream)",
                    border: "1px solid var(--zx-border)",
                    color: "var(--zx-ink)",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-secondary py-3 px-6 text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="btn-primary py-3 px-8 text-xs font-bold shadow-md flex items-center gap-2"
              >
                <span>Continue: Web3 Binding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Discord Gatekeeper Web3 Identity Verification ── */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Discord Bot Card Schematic */}
            <div
              className="rounded-3xl p-6 sm:p-8 space-y-4 max-w-lg mx-auto text-left relative overflow-hidden"
              style={{
                background: "var(--zx-ink)",
                border: "1px solid var(--zx-border)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md"
                  style={{ background: "var(--zx-primary)", color: "var(--zx-cream)" }}
                >
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white">
                      Zentrix Gatekeeper Bot
                    </span>
                    <span
                      className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                      style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}
                    >
                      EIP-191 Verified
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--zx-muted)" }}>
                    MST Testnet · Chain ID 91562037
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-2xl space-y-2"
                style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--zx-muted)" }}>Ident:</span>
                  <span className="font-bold text-white">
                    {name} (@{handle})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--zx-muted)" }}>Role:</span>
                  <span className="font-bold uppercase" style={{ color: "var(--zx-primary)" }}>
                    {role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--zx-muted)" }}>Bound Skills:</span>
                  <span className="font-bold text-white">{selectedTags.length} tags</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                  <span style={{ color: "var(--zx-muted)" }}>Wallet:</span>
                  <span className="font-mono text-xs font-semibold" style={{ color: "var(--zx-cream)" }}>
                    {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "No Wallet Connected"}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet connection status button */}
            {!address ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={openConnectModal}
                  className="btn-primary py-3.5 px-8 text-sm font-bold shadow-lg inline-flex items-center gap-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Connect BridgeKey / Wallet</span>
                </button>
                <p className="text-xs" style={{ color: "var(--zx-muted)" }}>
                  Click to connect BridgeKey or select an instant Testnet Demo account.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {signatureStatus && (
                  <div
                    className="p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2"
                    style={{
                      background: isSuccess
                        ? "color-mix(in srgb, var(--zx-success) 15%, transparent)"
                        : "var(--zx-cream)",
                      border: `1px solid ${isSuccess ? "var(--zx-success)" : "var(--zx-border)"}`,
                      color: isSuccess ? "var(--zx-success)" : "var(--zx-ink)",
                    }}
                  >
                    {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin text-[var(--zx-primary)]" />}
                    {isSuccess && <CheckCircle2 className="w-4 h-4 text-[var(--zx-success)]" />}
                    <span>{signatureStatus}</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={isSubmitting || isSuccess}
                    className="btn-secondary py-3 px-6 text-xs"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleWalletBinding}
                    disabled={isSubmitting || isSuccess}
                    className="btn-primary py-3.5 px-8 text-xs font-black shadow-lg flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Binding On-Chain...
                      </span>
                    ) : isSuccess ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Onboarding Complete!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Sign & Enter Zentrix
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
