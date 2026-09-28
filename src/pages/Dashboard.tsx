import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "../contracts";
import {
  BarChart3,
  Award,
  Wallet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  Send,
  PlusCircle,
  FileCheck,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { profile, currentRole, updateRole } = useAuth();
  const { address, signer, isConnected, connectWallet, switchNetwork } = useWallet();

  const [activeTab, setActiveTab] = useState<"projects" | "milestones" | "reputation">("projects");
  const [withdrawing, setWithdrawing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!isConnected || !signer) {
      await connectWallet();
      return;
    }
    setWithdrawing(true);
    setTxHash(null);
    try {
      const escrow = new ethers.Contract(CONTRACT_ADDRESSES.ZentrixEscrow, CONTRACT_ABIS.ZentrixEscrow, signer);
      const tx = await escrow.withdraw();
      setTxHash(tx.hash);
      await tx.wait();
      alert("Withdrawal completed! Funds transferred directly to your BridgeKey wallet.");
    } catch (err: any) {
      console.error("Withdraw error:", err);
      alert(err?.message || "Withdrawal failed. Make sure you have withdrawable balance.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--zx-border)]">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--zx-ink)]">Dashboard</h1>
          <p className="text-sm text-[var(--zx-muted)]">
            Overview of your on-chain escrow projects, milestones, and portable reputation.
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center gap-2 bg-[var(--zx-surface)] p-1 rounded-xl border border-[var(--zx-border)]">
          <button
            onClick={() => updateRole("client")}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentRole === "client"
                ? "bg-[var(--zx-primary-deep)] text-white shadow-xs"
                : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)]"
            }`}
          >
            Client View
          </button>
          <button
            onClick={() => updateRole("freelancer")}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentRole === "freelancer"
                ? "bg-[var(--zx-primary-deep)] text-white shadow-xs"
                : "text-[var(--zx-ink)] hover:text-[var(--zx-primary-deep)]"
            }`}
          >
            Freelancer View
          </button>
        </div>
      </div>

      {/* Transaction status feedback per Hard Rule 8 */}
      {txHash && (
        <div className="p-4 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-success)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--zx-success)]" />
            <span className="font-semibold text-[var(--zx-ink)]">
              Transaction Confirmed: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </span>
          </div>
          <a
            href={`https://testnet.mstscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-bold text-[var(--zx-primary-deep)] hover:underline"
          >
            <span>View on Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-surface p-5 space-y-2">
          <div className="text-xs font-semibold text-[var(--zx-muted)] uppercase">
            {currentRole === "client" ? "Funds Locked in Escrow" : "Pending Milestones"}
          </div>
          <div className="text-3xl font-black text-[var(--zx-ink)] font-mono">
            {currentRole === "client" ? "3.5" : "2.5"} tMSTC
          </div>
          <div className="text-[11px] text-[var(--zx-muted)]">Locked across 2 active projects</div>
        </div>

        <div className="card-surface p-5 space-y-2">
          <div className="text-xs font-semibold text-[var(--zx-muted)] uppercase">
            {currentRole === "client" ? "Total Released to Talent" : "Available to Withdraw"}
          </div>
          <div className="text-3xl font-black text-[var(--zx-primary-deep)] font-mono">
            {currentRole === "client" ? "5.0" : "1.0"} tMSTC
          </div>
          {currentRole === "freelancer" && (
            <button
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="btn-primary text-xs py-1 px-3 mt-1 shadow-xs"
            >
              {withdrawing ? "Processing..." : "Pull Withdraw"}
            </button>
          )}
        </div>

        <div className="card-surface p-5 space-y-2">
          <div className="text-xs font-semibold text-[var(--zx-muted)] uppercase">
            {currentRole === "client" ? "Active Milestone Reviews" : "Soulbound Credentials"}
          </div>
          <div className="text-3xl font-black text-[var(--zx-ink)] font-mono">
            {currentRole === "client" ? "1" : "3"}
          </div>
          <div className="text-[11px] text-[var(--zx-success)] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% on-time completion rate</span>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="card-surface p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-[var(--zx-border)] pb-3">
          <button
            onClick={() => setActiveTab("projects")}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === "projects"
                ? "border-[var(--zx-primary-deep)] text-[var(--zx-primary-deep)]"
                : "border-transparent text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === "milestones"
                ? "border-[var(--zx-primary-deep)] text-[var(--zx-primary-deep)]"
                : "border-transparent text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
            }`}
          >
            Milestone Timeline
          </button>
          <button
            onClick={() => setActiveTab("reputation")}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === "reputation"
                ? "border-[var(--zx-primary-deep)] text-[var(--zx-primary-deep)]"
                : "border-transparent text-[var(--zx-muted)] hover:text-[var(--zx-ink)]"
            }`}
          >
            Reputation SBTs
          </button>
        </div>

        {/* Tab 1: Projects */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="badge-tier text-[10px] uppercase font-bold">In Progress</span>
                <h4 className="text-base font-bold text-[var(--zx-ink)] mt-1">
                  BridgeKey Multi-Sig Wallet Integration
                </h4>
                <p className="text-xs text-[var(--zx-muted)] mt-0.5">
                  Milestone 2 of 3 · Escrow: 3.5 tMSTC · Contract:{" "}
                  <code className="font-mono text-[var(--zx-primary-deep)]">0xa507...3726</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/marketplace" className="btn-secondary text-xs py-1.5 px-3">
                  Inspect Contract
                </Link>
                {currentRole === "client" ? (
                  <button className="btn-primary text-xs py-1.5 px-3">
                    Review Submission
                  </button>
                ) : (
                  <button className="btn-primary text-xs py-1.5 px-3">
                    Submit Delivery
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Milestones */}
        {activeTab === "milestones" && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--zx-success)] text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--zx-ink)]">Milestone 1: EIP-1193 Provider Hook</div>
                  <div className="text-xs text-[var(--zx-muted)]">Approved & Paid · 1.0 tMSTC</div>
                </div>
              </div>
              <span className="badge-success text-xs">Approved</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--zx-surface-alt)] text-[var(--zx-primary-deep)] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--zx-ink)]">Milestone 2: Sign Message & Nonce Verification</div>
                  <div className="text-xs text-[var(--zx-muted)]">Under Review · 1.5 tMSTC · 72h auto-release active</div>
                </div>
              </div>
              <span className="badge-warning text-xs">Under Review</span>
            </div>
          </div>
        )}

        {/* Tab 3: Reputation */}
        {activeTab === "reputation" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--zx-cream)] border border-[var(--zx-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-tier text-[10px] uppercase font-bold">ERC-721 Soulbound</span>
                <span className="text-xs font-bold text-[var(--zx-success)]">Rating: 5.0 / 5.0</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--zx-ink)]">Full-Stack Web3 DApp Delivery</h4>
                <p className="text-xs text-[var(--zx-muted)] mt-1">
                  Issued on MST Testnet by ZentrixEscrow upon milestone approval.
                </p>
              </div>
              <div className="text-[10px] text-[var(--zx-muted)] font-mono pt-2 border-t border-[var(--zx-border)]">
                Contract: 0xB224Bd880326a5046F8526461d25fa5217636cA3 · Token ID #1
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
