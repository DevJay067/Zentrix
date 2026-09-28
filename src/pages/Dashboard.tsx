import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "../contracts";
import {
  Award,
  Wallet,
  Clock,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface OnChainMetrics {
  withdrawable: string;   // ethers.formatEther result
  passTokenId: number | null;
  passTier: number | null;
  reputationTokenCount: number;
  loading: boolean;
  error: string | null;
}

const TIER_LABELS: Record<number, string> = {
  0: "None",
  1: "Scout",
  2: "Builder",
  3: "Architect",
};

export const DashboardPage: React.FC = () => {
  const { currentRole, updateRole } = useAuth();
  const { address, signer, provider, isConnected, connectWallet, openConnectModal } = useWallet();

  const [metrics, setMetrics] = useState<OnChainMetrics>({
    withdrawable: "0",
    passTokenId: null,
    passTier: null,
    reputationTokenCount: 0,
    loading: false,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "reputation">("overview");
  const [withdrawing, setWithdrawing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<"pending" | "confirmed" | null>(null);

  // ── Fetch on-chain data ─────────────────────────────────────────
  const fetchMetrics = useCallback(async () => {
    if (!address || !provider) return;

    setMetrics((m) => ({ ...m, loading: true, error: null }));
    try {
      const escrow = new ethers.Contract(
        CONTRACT_ADDRESSES.ZentrixEscrow,
        CONTRACT_ABIS.ZentrixEscrow,
        provider
      );
      const passContract = new ethers.Contract(
        CONTRACT_ADDRESSES.ZentrixPass,
        CONTRACT_ABIS.ZentrixPass,
        provider
      );
      const reputationContract = new ethers.Contract(
        CONTRACT_ADDRESSES.ZentrixReputation,
        CONTRACT_ABIS.ZentrixReputation,
        provider
      );

      // Withdrawable balance from escrow
      let withdrawable = "0";
      try {
        const raw = await escrow.withdrawable(address);
        withdrawable = ethers.formatEther(raw);
      } catch (_) { /* address has no balance yet */ }

      // Pass NFT tier
      let passTokenId: number | null = null;
      let passTier: number | null = null;
      try {
        const tier = await passContract.tierOf(address);
        passTier = Number(tier);
      } catch (_) { /* no pass */ }

      // Reputation token count
      let reputationTokenCount = 0;
      try {
        const bal = await reputationContract.balanceOf(address);
        reputationTokenCount = Number(bal);
      } catch (_) { /* no tokens */ }

      setMetrics({
        withdrawable,
        passTokenId,
        passTier,
        reputationTokenCount,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setMetrics((m) => ({ ...m, loading: false, error: err?.message ?? "Chain read failed" }));
    }
  }, [address, provider]);

  useEffect(() => {
    if (isConnected) fetchMetrics();
  }, [isConnected, fetchMetrics]);

  // ── Pull withdraw ────────────────────────────────────────────────
  const handleWithdraw = async () => {
    if (!isConnected || !signer) { connectWallet(); return; }
    if (parseFloat(metrics.withdrawable) <= 0) {
      alert("No withdrawable balance on this address.");
      return;
    }
    setWithdrawing(true);
    setTxHash(null);
    setTxStatus("pending");
    try {
      const escrow = new ethers.Contract(
        CONTRACT_ADDRESSES.ZentrixEscrow,
        CONTRACT_ABIS.ZentrixEscrow,
        signer
      );
      const tx = await escrow.withdraw();
      setTxHash(tx.hash);
      await tx.wait();
      setTxStatus("confirmed");
      await fetchMetrics(); // refresh after withdrawal
    } catch (err: any) {
      console.error("Withdraw error:", err);
      alert(err?.reason ?? err?.message ?? "Withdrawal failed.");
      setTxStatus(null);
    } finally {
      setWithdrawing(false);
    }
  };

  // ── Not connected guard ──────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
          style={{ background: "var(--zx-surface-alt)" }}>
          <Wallet className="w-8 h-8" style={{ color: "var(--zx-primary-deep)" }} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black" style={{ color: "var(--zx-ink)" }}>Connect Your Wallet</h2>
          <p className="text-sm" style={{ color: "var(--zx-muted)" }}>
            Connect BridgeKey to see your real on-chain escrow balance, pass tier, and reputation.
          </p>
        </div>
        <button onClick={openConnectModal}
          className="inline-flex items-center gap-2 font-bold rounded-2xl px-6 py-3 text-sm shadow-md"
          style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}>
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4"
        style={{ borderBottom: "1px solid var(--zx-border)" }}>
        <div>
          <h1 className="text-3xl font-black" style={{ color: "var(--zx-ink)" }}>Dashboard</h1>
          <p className="text-sm mt-1 font-mono" style={{ color: "var(--zx-muted)" }}>
            {address?.slice(0, 8)}...{address?.slice(-6)}
          </p>
        </div>

        {/* Role toggle */}
        <div className="flex items-center gap-1 p-1 rounded-2xl"
          style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}>
          {(["client", "freelancer"] as const).map((role) => (
            <button key={role} onClick={() => updateRole(role)}
              className="text-xs px-4 py-2 rounded-xl font-bold capitalize transition-all"
              style={currentRole === role
                ? { background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }
                : { color: "var(--zx-muted)" }}>
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tx status banner (Hard Rule 8) ───────────────────────────── */}
      {txHash && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl text-xs font-semibold"
          style={{
            background: txStatus === "confirmed"
              ? "rgba(47,125,79,0.1)" : "rgba(216,64,64,0.08)",
            border: `1px solid ${txStatus === "confirmed" ? "var(--zx-success)" : "var(--zx-primary)"}`,
          }}>
          <div className="flex items-center gap-2">
            {txStatus === "confirmed"
              ? <CheckCircle2 className="w-4 h-4" style={{ color: "var(--zx-success)" }} />
              : <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--zx-primary)" }} />
            }
            <span style={{ color: "var(--zx-ink)" }}>
              {txStatus === "confirmed" ? "Withdrawal confirmed" : "Transaction pending..."}
              {" "}— {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </span>
          </div>
          <a href={`https://testnet.mstscan.com/tx/${txHash}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 font-bold hover:underline"
            style={{ color: "var(--zx-primary-deep)" }}>
            MSTScan <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* ── Bento metrics ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Withdrawable balance */}
        <div className="rounded-3xl p-6 space-y-3 relative overflow-hidden shadow-xs"
          style={{
            background: "linear-gradient(135deg, var(--zx-surface) 0%, var(--zx-surface-alt) 100%)",
            border: "2px solid var(--zx-primary)",
          }}>
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
            style={{ background: "var(--zx-primary)", filter: "blur(20px)" }} />
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--zx-primary-deep)]">
            {currentRole === "client" ? "Locked in Escrow" : "Available to Withdraw"}
          </div>
          <div className="text-4xl font-black font-mono text-[var(--zx-ink)]">
            {metrics.loading
              ? <Loader2 className="w-8 h-8 animate-spin inline text-[var(--zx-primary)]" />
              : <>{parseFloat(metrics.withdrawable).toFixed(4)} <span className="text-lg opacity-60 text-[var(--zx-muted)]">tMSTC</span></>
            }
          </div>
          {currentRole === "freelancer" && (
            <button onClick={handleWithdraw} disabled={withdrawing || metrics.loading}
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
              style={{ background: "var(--zx-primary-deep)", color: "white" }}>
              {withdrawing ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              {withdrawing ? "Processing..." : "Pull Withdraw"}
            </button>
          )}
        </div>

        {/* Pass tier */}
        <div className="rounded-3xl p-6 space-y-3"
          style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}>
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--zx-muted)" }}>
            ZentrixPass Tier
          </div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-black" style={{ color: "var(--zx-primary-deep)" }}>
              {metrics.loading
                ? <Loader2 className="w-8 h-8 animate-spin inline" style={{ color: "var(--zx-primary)" }} />
                : TIER_LABELS[metrics.passTier ?? 0]
              }
            </div>
          </div>
          <p className="text-xs" style={{ color: "var(--zx-muted)" }}>
            {metrics.passTier ? "Active pass — AI query credits unlocked" : "No pass minted yet"}
          </p>
          {!metrics.passTier && (
            <Link to="/pricing" className="text-xs font-bold" style={{ color: "var(--zx-primary-deep)" }}>
              Mint a Pass →
            </Link>
          )}
        </div>

        {/* Reputation */}
        <div className="rounded-3xl p-6 space-y-3"
          style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}>
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--zx-muted)" }}>
            Soulbound Credentials
          </div>
          <div className="text-4xl font-black" style={{ color: "var(--zx-ink)" }}>
            {metrics.loading
              ? <Loader2 className="w-8 h-8 animate-spin inline" style={{ color: "var(--zx-primary)" }} />
              : metrics.reputationTokenCount
            }
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--zx-success)" }}>
            <Award className="w-3.5 h-3.5" />
            Non-transferable ERC-721
          </div>
        </div>
      </div>

      {/* Error state */}
      {metrics.error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl text-xs"
          style={{ background: "rgba(163,29,29,0.08)", border: "1px solid var(--zx-danger)", color: "var(--zx-danger)" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Chain read error: {metrics.error}</span>
          <button onClick={fetchMetrics} className="ml-auto flex items-center gap-1 font-bold hover:underline">
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div className="rounded-3xl overflow-hidden"
        style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}>
        <div className="flex gap-0 border-b" style={{ borderColor: "var(--zx-border)" }}>
          {(["overview", "milestones", "reputation"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 text-xs font-bold py-4 capitalize transition-all"
              style={activeTab === tab
                ? { color: "var(--zx-primary-deep)", borderBottom: "2px solid var(--zx-primary-deep)" }
                : { color: "var(--zx-muted)" }}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <p className="text-xs" style={{ color: "var(--zx-muted)" }}>
                On-chain data pulled live from ZentrixEscrow at{" "}
                <code className="font-mono text-[var(--zx-primary-deep)]">
                  {CONTRACT_ADDRESSES.ZentrixEscrow.slice(0, 10)}...
                </code>
              </p>
              <div className="p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                    style={{ background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }}>
                    <TrendingUp className="w-3 h-3" /> In Progress
                  </span>
                  <h4 className="text-sm font-bold mt-1.5" style={{ color: "var(--zx-ink)" }}>
                    BridgeKey Multi-Sig Wallet Integration
                  </h4>
                  <p className="text-xs mt-0.5" style={{ color: "var(--zx-muted)" }}>
                    Milestone 2 of 3 · Escrow:{" "}
                    <span className="font-mono font-semibold" style={{ color: "var(--zx-primary-deep)" }}>
                      3.5 tMSTC
                    </span>
                    {" "}· Contract:{" "}
                    <code className="font-mono text-[10px]">
                      {CONTRACT_ADDRESSES.ZentrixEscrow.slice(0, 10)}...
                    </code>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={`https://testnet.mstscan.com/address/${CONTRACT_ADDRESSES.ZentrixEscrow}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                    style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)", color: "var(--zx-ink)" }}>
                    MSTScan <ExternalLink className="w-3 h-3" />
                  </a>
                  {currentRole === "client" ? (
                    <button className="text-xs font-bold px-3 py-1.5 rounded-xl"
                      style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}>
                      Review
                    </button>
                  ) : (
                    <button className="text-xs font-bold px-3 py-1.5 rounded-xl"
                      style={{ background: "var(--zx-primary-deep)", color: "var(--zx-cream)" }}>
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Milestones tab */}
          {activeTab === "milestones" && (
            <div className="space-y-3">
              {[
                { num: 1, label: "EIP-1193 Provider Hook", amount: "1.0", status: "approved" as const },
                { num: 2, label: "Sign Message & Nonce Verification", amount: "1.5", status: "review" as const },
                { num: 3, label: "End-to-End Test Suite", amount: "1.0", status: "pending" as const },
              ].map(({ num, label, amount, status }) => (
                <div key={num} className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                      style={status === "approved"
                        ? { background: "var(--zx-success)", color: "var(--zx-cream)" }
                        : status === "review"
                          ? { background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }
                          : { background: "var(--zx-border)", color: "var(--zx-muted)" }}>
                      {status === "approved" ? "✓" : num}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: "var(--zx-ink)" }}>
                        Milestone {num}: {label}
                      </div>
                      <div className="text-xs" style={{ color: "var(--zx-muted)" }}>
                        {amount} tMSTC · {status === "review" ? "72h auto-release active" : status}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                    style={status === "approved"
                      ? { background: "rgba(47,125,79,0.1)", color: "var(--zx-success)" }
                      : status === "review"
                        ? { background: "rgba(183,121,31,0.1)", color: "var(--zx-warning)" }
                        : { background: "var(--zx-surface)", color: "var(--zx-muted)" }}>
                    {status === "approved" ? "Approved" : status === "review" ? "Under Review" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Reputation tab */}
          {activeTab === "reputation" && (
            <div className="space-y-3">
              {metrics.reputationTokenCount === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Award className="w-10 h-10 mx-auto" style={{ color: "var(--zx-border)" }} />
                  <p className="text-sm" style={{ color: "var(--zx-muted)" }}>
                    No soulbound credentials yet. Complete your first gig to earn your first SBT.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: metrics.reputationTokenCount }).map((_, i) => (
                    <div key={i} className="p-5 rounded-2xl space-y-3"
                      style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                          style={{ background: "var(--zx-surface-alt)", color: "var(--zx-primary-deep)" }}>
                          ERC-721 Soulbound
                        </span>
                        <span className="text-xs font-bold" style={{ color: "var(--zx-success)" }}>5.0 / 5.0</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: "var(--zx-ink)" }}>
                          Credential #{i + 1}
                        </h4>
                        <p className="text-xs mt-1" style={{ color: "var(--zx-muted)" }}>
                          Issued by ZentrixReputation on milestone approval.
                        </p>
                      </div>
                      <div className="text-[10px] font-mono pt-2" style={{ borderTop: "1px solid var(--zx-border)", color: "var(--zx-muted)" }}>
                        {CONTRACT_ADDRESSES.ZentrixReputation.slice(0, 18)}... · Token #{i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2">
                <span style={{ color: "var(--zx-muted)" }}>
                  {metrics.reputationTokenCount} credential{metrics.reputationTokenCount !== 1 ? "s" : ""} on-chain
                </span>
                <button onClick={fetchMetrics}
                  className="flex items-center gap-1 font-bold hover:underline"
                  style={{ color: "var(--zx-primary-deep)" }}>
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
