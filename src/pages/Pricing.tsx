import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { ethers, parseEther } from "ethers";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "../contracts";
import { Check, Zap, ShieldCheck, Sparkles, ExternalLink, RefreshCw } from "lucide-react";

export const PricingPage: React.FC = () => {
  const { address, signer, isConnected, connectWallet, switchNetwork, isCorrectNetwork } = useWallet();

  const [buyingTier, setBuyingTier] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const handleBuyPass = async (tier: number, priceEther: string) => {
    if (!isConnected || !signer) {
      await connectWallet();
      return;
    }

    if (!isCorrectNetwork) {
      await switchNetwork();
      return;
    }

    setBuyingTier(tier);
    setTxHash(null);
    setTxError(null);

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.ZentrixPass, CONTRACT_ABIS.ZentrixPass, signer);
      const tx = await contract.buy(tier, { value: parseEther(priceEther) });
      setTxHash(tx.hash);
      await tx.wait();
      alert(`Congratulations! You have successfully acquired the Tier ${tier} ZentrixPass NFT.`);
    } catch (err: any) {
      console.error("Pass purchase error:", err);
      setTxError(err?.message || "Transaction failed or was rejected.");
    } finally {
      setBuyingTier(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--zx-ink)]">
          ZentrixPass <span className="text-[var(--zx-primary-deep)]">Subscription NFTs</span>
        </h1>
        <p className="text-sm text-[var(--zx-muted)] leading-relaxed">
          Non-transferable (soulbound) ERC-721 access passes granting high-speed daily query allowances for the Sarvam
          AI matchmaking engine.
        </p>
      </div>

      {/* Transaction status feedback per Hard Rule 8 */}
      {txHash && (
        <div className="p-4 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-success)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--zx-success)]" />
            <span className="font-semibold text-[var(--zx-ink)]">
              Transaction Broadcasted: {txHash.slice(0, 10)}...{txHash.slice(-8)}
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

      {txError && (
        <div className="p-4 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-danger)] text-xs text-[var(--zx-danger)]">
          {txError}
        </div>
      )}

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 0: Free */}
        <div className="card-surface flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="badge-tier text-[10px] uppercase font-bold">Standard</span>
              <h3 className="text-xl font-bold text-[var(--zx-ink)]">Free Tier</h3>
              <p className="text-xs text-[var(--zx-muted)]">Default query capacity for all connected wallets.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[var(--zx-ink)] font-mono">0</span>
              <span className="text-xs text-[var(--zx-muted)] font-mono">tMSTC / month</span>
            </div>

            <ul className="text-xs text-[var(--zx-ink)] space-y-2 pt-2 border-t border-[var(--zx-border)]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span><strong>2 AI queries</strong> per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Full marketplace browsing & applications</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Daily midnight IST reset</span>
              </li>
            </ul>
          </div>

          <button disabled className="btn-secondary text-xs opacity-60 w-full cursor-not-allowed">
            Active by Default
          </button>
        </div>

        {/* Tier 1: Pro (Featured) */}
        <div className="card-surface border-2 border-[var(--zx-primary-deep)] relative flex flex-col justify-between space-y-6 shadow-xl">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--zx-primary-deep)] text-white text-[10px] font-bold uppercase tracking-wider">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="badge-tier text-[10px] uppercase font-bold">Soulbound NFT</span>
              <h3 className="text-xl font-bold text-[var(--zx-ink)]">Pro Pass</h3>
              <p className="text-xs text-[var(--zx-muted)]">For active freelancers and growing clients.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[var(--zx-primary-deep)] font-mono">5</span>
              <span className="text-xs text-[var(--zx-muted)] font-mono">tMSTC / 30 days</span>
            </div>

            <ul className="text-xs text-[var(--zx-ink)] space-y-2 pt-2 border-t border-[var(--zx-border)]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span><strong>5 AI queries</strong> per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Non-transferable on-chain NFT</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Priority Sarvam 30B response processing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Pro profile badge on talent search</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleBuyPass(1, "5.0")}
            disabled={buyingTier === 1}
            className="btn-primary text-xs w-full shadow-md"
          >
            {buyingTier === 1 ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Minting Pass...
              </span>
            ) : (
              <span>Mint Pro Pass (5 tMSTC)</span>
            )}
          </button>
        </div>

        {/* Tier 2: Enterprise */}
        <div className="card-surface flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="badge-tier text-[10px] uppercase font-bold">Soulbound NFT</span>
              <h3 className="text-xl font-bold text-[var(--zx-ink)]">Enterprise Pass</h3>
              <p className="text-xs text-[var(--zx-muted)]">For agencies and high-volume recruiting teams.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[var(--zx-ink)] font-mono">15</span>
              <span className="text-xs text-[var(--zx-muted)] font-mono">tMSTC / 30 days</span>
            </div>

            <ul className="text-xs text-[var(--zx-ink)] space-y-2 pt-2 border-t border-[var(--zx-border)]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span><strong>15 AI queries</strong> per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span>Maximum query throughput</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--zx-success)]" />
                <span>30-day verified enterprise standing</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleBuyPass(2, "15.0")}
            disabled={buyingTier === 2}
            className="btn-secondary text-xs w-full"
          >
            {buyingTier === 2 ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Minting Pass...
              </span>
            ) : (
              <span>Mint Enterprise Pass (15 tMSTC)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
