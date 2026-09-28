import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import {
  Layers,
  PlusCircle,
  Search,
  Filter,
  Clock,
  Coins,
  ShieldAlert,
  Send,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Briefcase,
  X,
} from "lucide-react";

interface MilestoneItem {
  title: string;
  amount: string;
  deadlineDays: number;
  acceptanceCriteria: string;
}

interface GigItem {
  id: string;
  title: string;
  description: string;
  client: string;
  totalBudget: string;
  reviewWindowHours: number;
  tags: string[];
  technologies: string[];
  status: "Open" | "Assigned" | "Active" | "Completed";
  milestones: MilestoneItem[];
  freelancer?: string;
}

const INITIAL_GIGS: GigItem[] = [
  {
    id: "1",
    title: "Implement BridgeKey Multi-Sig Wallet Integration",
    description: "Build native BridgeKey signature request and transaction confirmation hooks with EIP-712 support.",
    client: "0x73595081334A18D4298A160b162faB4Fb4B3c85B",
    totalBudget: "3.5",
    reviewWindowHours: 72,
    tags: ["Web3", "Frontend"],
    technologies: ["React", "BridgeKey", "TypeScript", "Ethers"],
    status: "Open",
    milestones: [
      {
        title: "Milestone 1: EIP-1193 Provider Detection Hook",
        amount: "1.0",
        deadlineDays: 3,
        acceptanceCriteria: "Detection works on Chrome with BridgeKey and falls back gracefully to MetaMask.",
      },
      {
        title: "Milestone 2: Sign Message & Nonce Verification",
        amount: "1.5",
        deadlineDays: 5,
        acceptanceCriteria: "Server-side recovery matching client public key and generating session token.",
      },
      {
        title: "Milestone 3: End-to-End Test Suite",
        amount: "1.0",
        deadlineDays: 4,
        acceptanceCriteria: "Passes automated integration tests on MST Testnet.",
      },
    ],
  },
  {
    id: "2",
    title: "Solidity Escrow Contract Invariant Fuzzing",
    description: "Write Foundry and Echidna fuzz tests asserting that total contract balance equals locked plus withdrawable funds.",
    client: "0x7FC1d02922d4865fd53De59697407a42e64d1Cad",
    totalBudget: "2.0",
    reviewWindowHours: 48,
    tags: ["Smart Contracts", "Security"],
    technologies: ["Solidity", "Hardhat", "Foundry"],
    status: "Open",
    milestones: [
      {
        title: "Milestone 1: Invariant definition & Slither run",
        amount: "0.8",
        deadlineDays: 3,
        acceptanceCriteria: "Zero High or Medium findings in Slither audit report.",
      },
      {
        title: "Milestone 2: 10,000 iterations invariant fuzz run",
        amount: "1.2",
        deadlineDays: 5,
        acceptanceCriteria: "Balance invariant holds across reentrancy and arbitrary withdrawal sequences.",
      },
    ],
  },
  {
    id: "3",
    title: "Sarvam 30B Agent Tool-Calling Fine Tuning & RAG",
    description: "Build an optimized prompt and tool definitions for talent recommendations with zero PII leaks.",
    client: "0x73595081334A18D4298A160b162faB4Fb4B3c85B",
    totalBudget: "4.0",
    reviewWindowHours: 72,
    tags: ["AI", "Backend"],
    technologies: ["Sarvam AI", "Next.js", "TypeScript"],
    status: "Open",
    milestones: [
      {
        title: "Milestone 1: Tool definitions and schema validation",
        amount: "2.0",
        deadlineDays: 4,
        acceptanceCriteria: "Strict Zod schemas preventing phone and email leakage in outputs.",
      },
      {
        title: "Milestone 2: Streaming integration & token metering",
        amount: "2.0",
        deadlineDays: 4,
        acceptanceCriteria: "429 responses on daily quota exhaustion with IST midnight reset.",
      },
    ],
  },
];

export const MarketplacePage: React.FC = () => {
  const { profile, currentRole } = useAuth();
  const { address, isConnected, connectWallet } = useWallet();

  const [gigs, setGigs] = useState<GigItem[]>(INITIAL_GIGS);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeGig, setActiveGig] = useState<GigItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyProposal, setApplyProposal] = useState("");
  const [txPending, setTxPending] = useState(false);
  const [txSuccessHash, setTxSuccessHash] = useState<string | null>(null);

  // New Gig Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTag, setNewTag] = useState("Web3");
  const [newMilestones, setNewMilestones] = useState<MilestoneItem[]>([
    { title: "Milestone 1: Prototype", amount: "1.0", deadlineDays: 5, acceptanceCriteria: "Working MVP deployed on testnet." },
  ]);

  const allTags = ["All", "Web3", "Frontend", "Smart Contracts", "Security", "AI", "Backend"];

  const filteredGigs = gigs.filter((gig) => {
    const matchesTag = selectedTag === "All" || gig.tags.includes(selectedTag);
    const matchesQuery =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesQuery;
  });

  const handleAddMilestone = () => {
    setNewMilestones([
      ...newMilestones,
      {
        title: `Milestone ${newMilestones.length + 1}: Final Delivery`,
        amount: "1.0",
        deadlineDays: 7,
        acceptanceCriteria: "Full code delivered with automated tests.",
      },
    ]);
  };

  const handleCreateGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    const total = newMilestones.reduce((acc, m) => acc + parseFloat(m.amount || "0"), 0).toFixed(1);

    const created: GigItem = {
      id: (gigs.length + 1).toString(),
      title: newTitle,
      description: newDesc,
      client: address,
      totalBudget: total,
      reviewWindowHours: 72,
      tags: [newTag],
      technologies: ["React", "Solidity", "MST Blockchain"],
      status: "Open",
      milestones: newMilestones,
    };

    setGigs([created, ...gigs]);
    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  const handleApply = (gig: GigItem) => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    setActiveGig(gig);
    setIsApplyModalOpen(true);
  };

  const submitApplication = () => {
    alert("Application submitted! Client can now review and assign you to the Escrow contract.");
    setIsApplyModalOpen(false);
    setApplyProposal("");
  };

  return (
    <div className="space-y-8">
      {/* Header and Post a Gig CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--zx-border)]">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--zx-ink)]">Marketplace</h1>
          <p className="text-sm text-[var(--zx-muted)]">
            Explore open projects with escrow-backed funding on MST Blockchain.
          </p>
        </div>

        {/* Primary CTA: Post a Gig */}
        <button
          onClick={() => {
            if (!isConnected) {
              connectWallet();
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="btn-primary shadow-md"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post a Gig</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tag pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? "bg-[var(--zx-primary-deep)] text-white shadow-xs"
                  : "bg-[var(--zx-surface)] text-[var(--zx-ink)] border border-[var(--zx-border)] hover:bg-[var(--zx-surface-alt)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--zx-muted)]" />
          <input
            type="text"
            placeholder="Search keywords, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--zx-surface)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--zx-primary-deep)]"
          />
        </div>
      </div>

      {/* Gig Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGigs.map((gig) => (
          <div
            key={gig.id}
            className="card-surface card-surface-hover flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <span className="badge-tier text-[10px] uppercase font-bold">{gig.tags[0] || "Web3"}</span>
                <span className="badge-success text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--zx-success)]" />
                  {gig.status}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-bold text-[var(--zx-ink)] line-clamp-1">{gig.title}</h3>
                <p className="text-xs text-[var(--zx-muted)] mt-1 line-clamp-2 leading-relaxed">
                  {gig.description}
                </p>
              </div>

              {/* Tech Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {gig.technologies.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded bg-[var(--zx-cream)] border border-[var(--zx-border)] text-[var(--zx-ink)] font-mono"
                  >
                    {t}
                  </span>
                ))}
                {gig.technologies.length > 3 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-[var(--zx-muted)]">
                    +{gig.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Meta & CTA */}
            <div className="pt-3 border-t border-[var(--zx-border)] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-semibold text-[var(--zx-muted)]">Total Escrow</div>
                <div className="text-base font-extrabold text-[var(--zx-primary-deep)] font-mono">
                  {gig.totalBudget} tMSTC
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveGig(gig)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Details
                </button>
                <button
                  onClick={() => handleApply(gig)}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gig Details Modal */}
      {activeGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-[var(--zx-surface)] border border-[var(--zx-border)] shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="badge-tier text-[10px] uppercase font-bold">{activeGig.tags[0]}</span>
                <h2 className="text-xl font-extrabold text-[var(--zx-ink)] mt-1">{activeGig.title}</h2>
                <p className="text-xs text-[var(--zx-muted)] mt-0.5 font-mono">
                  Client: {activeGig.client.slice(0, 6)}...{activeGig.client.slice(-4)} · Review Window:{" "}
                  {activeGig.reviewWindowHours}h
                </p>
              </div>
              <button
                onClick={() => setActiveGig(null)}
                className="p-1 rounded-lg hover:bg-[var(--zx-surface-alt)] text-[var(--zx-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[var(--zx-ink)] leading-relaxed">{activeGig.description}</p>

            {/* Milestones Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[var(--zx-muted)] uppercase tracking-wider">
                Milestone Escrow Plan ({activeGig.milestones.length})
              </h4>
              <div className="space-y-2">
                {activeGig.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[var(--zx-ink)]">{m.title}</div>
                      <div className="text-[11px] text-[var(--zx-muted)]">{m.acceptanceCriteria}</div>
                      <div className="text-[10px] text-[var(--zx-muted)] font-mono">
                        Deadline: {m.deadlineDays} days after acceptance
                      </div>
                    </div>
                    <div className="text-sm font-extrabold text-[var(--zx-primary-deep)] font-mono whitespace-nowrap">
                      {m.amount} tMSTC
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Action */}
            <div className="p-4 rounded-xl bg-[var(--zx-surface-alt)] flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--zx-muted)]">Total Escrow Value:</span>
                <span className="text-lg font-black text-[var(--zx-primary-deep)] font-mono ml-2">
                  {activeGig.totalBudget} tMSTC
                </span>
              </div>
              <button
                onClick={() => {
                  const gig = activeGig;
                  setActiveGig(null);
                  handleApply(gig);
                }}
                className="btn-primary text-sm py-2 px-5"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post a Gig Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-[var(--zx-surface)] border border-[var(--zx-border)] shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--zx-border)] pb-3">
              <h2 className="text-xl font-extrabold text-[var(--zx-ink)]">Post a New Gig</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--zx-surface-alt)] text-[var(--zx-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Web3 Dashboard with BridgeKey"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--zx-primary-deep)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--zx-ink)] mb-1">Project Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe requirements and expectations..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--zx-primary-deep)]"
                />
              </div>

              {/* Milestones */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--zx-ink)] uppercase">Milestone Plan</label>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="text-xs font-bold text-[var(--zx-primary-deep)] hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                {newMilestones.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Milestone title"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...newMilestones];
                          updated[idx].title = e.target.value;
                          setNewMilestones(updated);
                        }}
                        className="flex-1 p-2 rounded-lg bg-[var(--zx-surface)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)]"
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Amount (tMSTC)"
                        value={m.amount}
                        onChange={(e) => {
                          const updated = [...newMilestones];
                          updated[idx].amount = e.target.value;
                          setNewMilestones(updated);
                        }}
                        className="w-28 p-2 rounded-lg bg-[var(--zx-surface)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)] font-mono"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Acceptance criteria"
                      value={m.acceptanceCriteria}
                      onChange={(e) => {
                        const updated = [...newMilestones];
                        updated[idx].acceptanceCriteria = e.target.value;
                        setNewMilestones(updated);
                      }}
                      className="w-full p-2 rounded-lg bg-[var(--zx-surface)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--zx-border)]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Create Gig
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {isApplyModalOpen && activeGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[var(--zx-surface)] border border-[var(--zx-border)] shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--zx-ink)]">Apply for {activeGig.title}</h3>
            <p className="text-xs text-[var(--zx-muted)]">
              Your proposal will be saved to Firestore and visible to the client. Upon acceptance, client funds the
              contract escrow on MST Testnet.
            </p>

            <textarea
              rows={4}
              required
              placeholder="State your relevant experience, proposed milestones, and delivery timeline..."
              value={applyProposal}
              onChange={(e) => setApplyProposal(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[var(--zx-cream)] border border-[var(--zx-border)] text-xs text-[var(--zx-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--zx-primary-deep)]"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Proposal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
