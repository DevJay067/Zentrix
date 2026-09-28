import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Contract } from "ethers";
import {
  Check,
  Zap,
  ShieldCheck,
  Crown,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "../contracts";

// ─── Types ────────────────────────────────────────────────────────────────────

type TxStage = "idle" | "pending" | "confirmed" | "error";

interface TierData {
  priceWei: bigint;
  priceEth: string;
}

interface ChainState {
  userTier: number;        // 0=None,1=Scout,2=Builder,3=Architect
  prices: TierData[];      // index 0 unused, 1=Scout, 2=Builder, 3=Architect
  loading: boolean;
  error: string | null;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div
    className="rounded-3xl p-6 flex flex-col gap-5 animate-pulse"
    style={{ background: "var(--zx-surface)", border: "1px solid var(--zx-border)" }}
  >
    <div className="flex flex-col gap-2">
      <div className="h-3 w-16 rounded-full" style={{ background: "var(--zx-border)" }} />
      <div className="h-6 w-28 rounded-xl" style={{ background: "var(--zx-border)" }} />
      <div className="h-3 w-40 rounded-full" style={{ background: "var(--zx-border)" }} />
    </div>
    <div className="h-10 w-24 rounded-xl" style={{ background: "var(--zx-border)" }} />
    <div className="flex flex-col gap-2 mt-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-3 w-full rounded-full" style={{ background: "var(--zx-border)" }} />
      ))}
    </div>
    <div className="h-10 w-full rounded-2xl mt-auto" style={{ background: "var(--zx-border)" }} />
  </div>
);

// ─── Tier feature sets ────────────────────────────────────────────────────────

const TIER_META = [
  null, // tier 0 placeholder
  {
    id: 1,
    name: "Scout",
    tagline: "For active independents",
    Icon: Zap,
    accent: "var(--zx-primary)",
    features: [
      "5 Sarvam AI queries / day",
      "Non-transferable soulbound NFT",
      "Priority AI match scoring",
      "Scout badge on talent search",
      "30-day pass validity",
    ],
  },
  {
    id: 2,
    name: "Builder",
    tagline: "For growing teams & serious freelancers",
    Icon: ShieldCheck,
    accent: "var(--zx-primary-deep)",
    features: [
      "15 Sarvam AI queries / day",
      "Non-transferable soulbound NFT",
      "Enhanced match throughput",
      "Builder profile badge",
      "30-day pass validity",
      "Priority dispute resolution",
    ],
  },
  {
    id: 3,
    name: "Architect",
    tagline: "For agencies & enterprise recruiting",
    Icon: Crown,
    accent: "var(--zx-warning)",
    features: [
      "Unlimited AI queries / day",
      "Non-transferable soulbound NFT",
      "Max-throughput AI processing",
      "Architect enterprise badge",
      "30-day pass validity",
      "Dedicated dispute arbitration",
      "Early access to new features",
    ],
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export const PricingPage: React.FC = () => {
  const { address, signer, provider, isConnected, connectWallet, switchNetwork, isCorrectNetwork, openConnectModal } =
    useWallet();

  const [chain, setChain] = useState<ChainState>({
    userTier: 0,
    prices: [
      { priceWei: 0n, priceEth: "0" },
      { priceWei: 0n, priceEth: "—" },
      { priceWei: 0n, priceEth: "—" },
      { priceWei: 0n, priceEth: "—" },
    ],
    loading: true,
    error: null,
  });

  // Per-tier tx state
  const [txTier, setTxTier] = useState<number | null>(null);
  const [txStage, setTxStage] = useState<TxStage>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [confirmedTier, setConfirmedTier] = useState<number | null>(null);

  // ── Fetch on-chain data ────────────────────────────────────────────────────

  const fetchChainData = useCallback(async () => {
    setChain((s) => ({ ...s, loading: true, error: null }));
    try {
      // Use provider if connected, else JsonRpcProvider for read-only
      const rpc =
        provider ??
        new ethers.JsonRpcProvider("https://testnetrpc.mstblockchain.com");

      const passContract = new Contract(
        CONTRACT_ADDRESSES.ZentrixPass,
        CONTRACT_ABIS.ZentrixPass,
        rpc
      );

      // Fetch all 3 tier prices in parallel + user's current tier
      const [p1, p2, p3, userTierRaw] = await Promise.all([
        passContract.tierPrices(1),
        passContract.tierPrices(2),
        passContract.tierPrices(3),
        address ? passContract.tierOf(address) : Promise.resolve(0n),
      ]);

      const toPair = (wei: bigint): TierData => ({
        priceWei: wei,
        priceEth: parseFloat(ethers.formatEther(wei)).toFixed(2),
      });

      setChain({
        userTier: Number(userTierRaw),
        prices: [
          { priceWei: 0n, priceEth: "0" }, // tier 0 sentinel
          toPair(p1),
          toPair(p2),
          toPair(p3),
        ],
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setChain((s) => ({
        ...s,
        loading: false,
        error: "Failed to load on-chain pricing. " + (err?.message ?? ""),
      }));
    }
  }, [address, provider]);

  useEffect(() => {
    fetchChainData();
  }, [fetchChainData]);

  // ── Buy handler ────────────────────────────────────────────────────────────

  const handleBuy = async (tierId: number) => {
    if (!isConnected) {
      openConnectModal();
      return;
    }
    if (!isCorrectNetwork) {
      await switchNetwork();
      return;
    }
    if (!signer) return;

    const price = chain.prices[tierId];
    if (!price || price.priceWei === 0n) return;

    setTxTier(tierId);
    setTxStage("pending");
    setTxHash(null);
    setTxError(null);

    try {
      const passContract = new Contract(
        CONTRACT_ADDRESSES.ZentrixPass,
        CONTRACT_ABIS.ZentrixPass,
        signer
      );
      const tx = await passContract.buy(tierId, { value: price.priceWei });
      setTxHash(tx.hash);
      await tx.wait();
      setTxStage("confirmed");
      setConfirmedTier(tierId);
      // Refresh tier after buy
      await fetchChainData();
    } catch (err: any) {
      setTxStage("error");
      setTxError(err?.reason ?? err?.message ?? "Transaction failed or rejected.");
    } finally {
      setTxTier(null);
    }
  };

  // ── Derived state ──────────────────────────────────────────────────────────

  const isBuying = (id: number) => txTier === id;
  const isCurrentTier = (id: number) => chain.userTier === id;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--zx-surface)" }}
    >
      {/* ── Hero clean white banner ─────────────────────────────────────────────── */}
      <div
        className="rounded-3xl mx-4 mt-4 mb-8 p-8 sm:p-12 relative overflow-hidden shadow-sm"
        style={{
          background: "linear-gradient(180deg, var(--zx-surface) 0%, var(--zx-surface-alt) 100%)",
          border: "1px solid var(--zx-border)",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-15"
          style={{ background: "var(--zx-primary)", filter: "blur(48px)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10"
          style={{ background: "var(--zx-warning)", filter: "blur(40px)" }}
        />

        <div className="relative z-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{
              background: "rgba(216,64,64,0.08)",
              color: "var(--zx-primary-deep)",
              border: "1px solid rgba(216,64,64,0.2)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--zx-primary)]" />
            <span>Soulbound NFT Access Passes</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4 text-[var(--zx-ink)]">
            ZentrixPass
            <br />
            <span style={{ color: "var(--zx-primary)" }}>Subscription Tiers</span>
          </h1>
          <p className="text-sm leading-relaxed text-[var(--zx-muted)]">
            Non-transferable ERC-721 access passes granting daily AI query allowances for the Sarvam
            matchmaking engine. Prices are fetched live from the ZentrixPass smart contract.
          </p>
        </div>

        {/* Active tier status chip */}
        {isConnected && !chain.loading && (
          <div
            className="absolute top-6 right-6 sm:top-8 sm:right-8 px-4 py-2 rounded-2xl text-xs font-bold shadow-xs"
            style={{
              background: chain.userTier > 0 ? "rgba(47,125,79,0.1)" : "var(--zx-surface-alt)",
              border: `1px solid ${chain.userTier > 0 ? "var(--zx-success)" : "var(--zx-border)"}`,
              color: chain.userTier > 0 ? "var(--zx-success)" : "var(--zx-muted)",
            }}
          >
            {chain.userTier > 0
              ? `✦ Active: ${TIER_META[chain.userTier]?.name} Pass`
              : "No Active Pass"}
          </div>
        )}
      </div>

      {/* ── Error banner ─────────────────────────────────────────────────── */}
      {chain.error && (
        <div
          className="mx-4 mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm"
          style={{
            background: "rgba(163,29,29,0.08)",
            border: "1px solid var(--zx-danger)",
            color: "var(--zx-danger)",
          }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">On-chain read error: </span>
            {chain.error}
          </div>
          <button
            onClick={fetchChainData}
            className="shrink-0 flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-xl"
            style={{ background: "var(--zx-danger)", color: "var(--zx-cream)" }}
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* ── Tx status banner ─────────────────────────────────────────────── */}
      {txStage === "pending" && txHash && (
        <div
          className="mx-4 mb-6 p-4 rounded-2xl flex items-center justify-between text-xs"
          style={{
            background: "rgba(183,121,31,0.08)",
            border: "1px solid var(--zx-warning)",
          }}
        >
          <div className="flex items-center gap-2.5" style={{ color: "var(--zx-warning)" }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-semibold">
              Pending — {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </span>
          </div>
          <a
            href={`https://testnet.mstscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-bold hover:underline"
            style={{ color: "var(--zx-warning)" }}
          >
            MSTScan <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {txStage === "confirmed" && txHash && (
        <div
          className="mx-4 mb-6 p-4 rounded-2xl flex items-center justify-between text-xs"
          style={{
            background: "rgba(47,125,79,0.08)",
            border: "1px solid var(--zx-success)",
          }}
        >
          <div className="flex items-center gap-2.5" style={{ color: "var(--zx-success)" }}>
            <Check className="w-4 h-4" />
            <span className="font-semibold">
              Confirmed — {TIER_META[confirmedTier ?? 1]?.name} Pass minted!
            </span>
          </div>
          <a
            href={`https://testnet.mstscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-bold hover:underline"
            style={{ color: "var(--zx-success)" }}
          >
            View on MSTScan <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {txStage === "error" && txError && (
        <div
          className="mx-4 mb-6 p-4 rounded-2xl text-xs"
          style={{
            background: "rgba(163,29,29,0.08)",
            border: "1px solid var(--zx-danger)",
            color: "var(--zx-danger)",
          }}
        >
          <span className="font-semibold">Transaction failed: </span>{txError}
        </div>
      )}

      {/* ── Bento Tier Cards ──────────────────────────────────────────────── */}
      <div className="px-4 pb-12">
        {/* Asymmetric bento: 5-col grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* ── Free tier — wide left cell ─────────────────────────────── */}
          <div
            className="md:col-span-2 rounded-3xl p-7 flex flex-col justify-between"
            style={{
              background: "var(--zx-surface-alt)",
              border: "1px solid var(--zx-border)",
            }}
          >
            <div className="space-y-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--zx-border)" }}
              >
                <Star className="w-5 h-5" style={{ color: "var(--zx-muted)" }} />
              </div>
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: "var(--zx-muted)" }}
                >
                  Default
                </div>
                <h3 className="text-2xl font-black" style={{ color: "var(--zx-ink)" }}>
                  Free Tier
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--zx-muted)" }}>
                  Available to every connected wallet with no purchase required.
                </p>
              </div>

              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-black font-mono" style={{ color: "var(--zx-ink)" }}>
                  0
                </span>
                <span className="text-sm font-mono" style={{ color: "var(--zx-muted)" }}>
                  tMSTC
                </span>
              </div>

              <ul className="space-y-2 pt-3" style={{ borderTop: "1px solid var(--zx-border)" }}>
                {["2 AI queries / day", "Full marketplace browsing", "Standard match scoring"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--zx-ink)" }}>
                    <Check className="w-3.5 h-3.5" style={{ color: "var(--zx-success)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled
              className="mt-6 w-full py-3 rounded-2xl text-xs font-bold cursor-not-allowed"
              style={{
                background: "var(--zx-border)",
                color: "var(--zx-muted)",
              }}
            >
              Active by default
            </button>
          </div>

          {/* ── Paid tiers — right 3 cells stacked ─────────────────────── */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {chain.loading
              ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              : TIER_META.slice(1).map((meta) => {
                  if (!meta) return null;
                  const { id, name, tagline, Icon, accent, features } = meta;
                  const price = chain.prices[id];
                  const current = isCurrentTier(id);
                  const buying = isBuying(id);
                  const isFeatured = id === 2; // Builder is hero

                  return (
                    <div
                      key={id}
                      className="rounded-3xl p-7 flex flex-col sm:flex-row gap-6 justify-between relative overflow-hidden transition-all duration-300"
                      style={{
                        background: "var(--zx-surface)",
                        border: current
                          ? `2px solid ${accent}`
                          : isFeatured
                          ? "2px solid var(--zx-primary)"
                          : "1px solid var(--zx-border)",
                        boxShadow: current
                          ? `0 0 24px ${accent}40`
                          : isFeatured
                          ? "0 10px 30px -5px rgba(216, 64, 64, 0.08)"
                          : "0 2px 8px -2px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      {/* Glow blob for active or featured */}
                      {(current || isFeatured) && (
                        <div
                          className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                          style={{ background: accent, filter: "blur(40px)", opacity: current ? 0.2 : 0.08 }}
                        />
                      )}

                      {/* Left: info */}
                      <div className="flex-1 space-y-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center"
                            style={{ background: `${accent}18` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: accent }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] font-bold uppercase tracking-widest"
                                style={{ color: accent }}
                              >
                                Tier {id}
                              </span>
                              {current && (
                                <span
                                  className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full"
                                  style={{ background: `${accent}22`, color: accent }}
                                >
                                  ✦ Active
                                </span>
                              )}
                              {isFeatured && !current && (
                                <span
                                  className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-[var(--zx-primary-deep)] border border-red-200"
                                >
                                  ★ Popular
                                </span>
                              )}
                            </div>
                            <h3
                              className="text-lg font-black leading-tight text-[var(--zx-ink)]"
                            >
                              {name}
                            </h3>
                          </div>
                        </div>

                        <p
                          className="text-xs"
                          style={{ color: isFeatured ? "var(--zx-muted)" : "var(--zx-muted)" }}
                        >
                          {tagline}
                        </p>

                        <div className="flex items-baseline gap-1">
                          <span
                            className="text-3xl font-black font-mono"
                            style={{ color: isFeatured ? "var(--zx-cream)" : accent }}
                          >
                            {price?.priceEth ?? "—"}
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "var(--zx-muted)" }}
                          >
                            tMSTC / 30 days
                          </span>
                        </div>

                        <ul
                          className="space-y-1.5 pt-3"
                          style={{ borderTop: `1px solid ${isFeatured ? "rgba(255,255,255,0.08)" : "var(--zx-border)"}` }}
                        >
                          {features.map((f) => (
                            <li
                              key={f}
                              className="flex items-center gap-2 text-xs"
                              style={{ color: isFeatured ? "var(--zx-cream)" : "var(--zx-ink)" }}
                            >
                              <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--zx-success)" }} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: buy CTA */}
                      <div className="flex sm:flex-col justify-end items-end sm:items-stretch relative z-10">
                        <button
                          onClick={() => handleBuy(id)}
                          disabled={buying || current}
                          className="mt-auto px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                          style={
                            current
                              ? {
                                  background: `${accent}18`,
                                  color: accent,
                                  border: `1px solid ${accent}`,
                                  cursor: "not-allowed",
                                  minWidth: "140px",
                                }
                              : buying
                              ? {
                                  background: accent,
                                  color: "var(--zx-cream)",
                                  opacity: 0.7,
                                  cursor: "not-allowed",
                                  minWidth: "140px",
                                }
                              : {
                                  background: accent,
                                  color: "var(--zx-cream)",
                                  minWidth: "140px",
                                }
                          }
                        >
                          {buying ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Minting…
                            </>
                          ) : current ? (
                            "✦ Active Pass"
                          ) : isConnected ? (
                            `Mint ${name}`
                          ) : (
                            "Connect Wallet"
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* ── Bottom info row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            {
              title: "Soulbound NFT",
              desc: "ZentrixPass tokens are non-transferable ERC-721 NFTs, bound permanently to your wallet address on-chain.",
            },
            {
              title: "30-Day Validity",
              desc: "Each minted pass is valid for exactly 30 days (PASS_DURATION enforced by the smart contract).",
            },
            {
              title: "On-Chain Prices",
              desc: "All pricing is read live from tierPrices() on ZentrixPass — no hidden fees, no backend.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-3xl p-6"
              style={{ background: "var(--zx-cream)", border: "1px solid var(--zx-border)" }}
            >
              <div className="text-xs font-black mb-1" style={{ color: "var(--zx-ink)" }}>
                {title}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--zx-muted)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
