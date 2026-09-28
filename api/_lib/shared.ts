// Shared data and helpers for Zentrix serverless functions
// Rule: No PII on chain, no secrets in client code. Sarvam called server-side only.

// IST Date helper (UTC+5:30)
export function getISTDateString(): string {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 5.5 * 3600000);
  return istDate.toISOString().slice(0, 10);
}

// Tier query allowances
export const TIER_LIMITS: Record<number, number> = {
  0: 2,  // Free Tier
  1: 10, // Pro Pass NFT
  2: 15, // Enterprise Pass NFT
};

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Sarvam tool definitions
export const AGENT_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_gigs",
      description: "Search open freelance gigs and project milestones available on Zentrix marketplace.",
      parameters: {
        type: "object",
        properties: {
          tag: { type: "string", description: "Filter by industry tag, e.g. web3, frontend, smart-contracts" },
          minBudget: { type: "number", description: "Minimum budget in tMSTC" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_freelancers",
      description: "Search verified freelance talent profiles on Zentrix.",
      parameters: {
        type: "object",
        properties: {
          skill: { type: "string", description: "Technology or expertise, e.g. Solidity, React, Rust, UI/UX" },
        },
      },
    },
  },
];

export const VERIFIED_GIGS = [
  {
    id: "1",
    title: "Implement BridgeKey Multi-Sig Wallet Integration",
    budget: "3.5 tMSTC",
    escrowPercent: "100%",
    tags: ["Solidity", "React", "BridgeKey Integration"],
    reviewWindow: "72h Auto-Release Protected",
    description: "Build native BridgeKey signature request and transaction confirmation hooks with EIP-712 support.",
    clientAddress: "0x73595081334A18D4298A160b162faB4Fb4B3c85B",
    status: "Open",
  },
  {
    id: "4",
    title: "3D Brand Identity & Interactive Spline Motion",
    budget: "2.5 tMSTC",
    escrowPercent: "100%",
    tags: ["Blender", "Spline", "Three.js"],
    reviewWindow: "48h Auto-Release Protected",
    description: "Create futuristic 3D assets, geometric glass emblems, and interactive canvas components for Zentrix DApp.",
    clientAddress: "0x7FC1d02922d4865fd53De59697407a42e64d1Cad",
    status: "Open",
  },
  {
    id: "5",
    title: "Comprehensive MST Developer Documentation & Whitepaper",
    budget: "1.8 tMSTC",
    escrowPercent: "100%",
    tags: ["Technical Writing", "GitBook", "Solidity"],
    reviewWindow: "72h Auto-Release Protected",
    description: "Write in-depth developer tutorials, contract walkthroughs, and technical whitepaper explaining milestone escrow.",
    clientAddress: "0x73595081334A18D4298A160b162faB4Fb4B3c85B",
    status: "Open",
  },
  {
    id: "2",
    title: "Solidity Escrow Contract Invariant Fuzzing",
    budget: "2.0 tMSTC",
    escrowPercent: "100%",
    tags: ["Smart Contracts", "Security Audits", "Foundry"],
    reviewWindow: "48h Auto-Release Protected",
    description: "Write Foundry and Echidna fuzz tests asserting that total contract balance equals locked plus withdrawable funds.",
    clientAddress: "0x7FC1d02922d4865fd53De59697407a42e64d1Cad",
    status: "Open",
  },
];

export const VERIFIED_FREELANCERS = [
  {
    id: "f1",
    name: "Alex Dev",
    handle: "@alexdev",
    designation: "Senior Smart Contract Engineer",
    skills: ["Solidity", "OpenZeppelin v5", "Hardhat", "Foundry"],
    reputation: 99.4,
    tier: "Tier 2 Builder Pass",
    walletAddress: "0x8cA0f3176997F32CCBb4598Fc8C966C95aeEEc9e",
    milestonesCompleted: 14,
  },
  {
    id: "f2",
    name: "Priya Sharma",
    handle: "@priyasharma",
    designation: "Lead Frontend Web3 Architect",
    skills: ["React", "Vite", "BridgeKey", "TypeScript", "Tailwind"],
    reputation: 98.8,
    tier: "Tier 2 Builder Pass",
    walletAddress: "0x7FC1d02922d4865fd53De59697407a42e64d1Cad",
    milestonesCompleted: 11,
  },
  {
    id: "f3",
    name: "Vikram Malhotra",
    handle: "@vikramm",
    designation: "Web3 Security Auditor & QA",
    skills: ["Slither", "Echidna", "Invariant Fuzzing", "Solidity"],
    reputation: 99.1,
    tier: "Tier 2 Builder Pass",
    walletAddress: "0x73595081334A18D4298A160b162faB4Fb4B3c85B",
    milestonesCompleted: 18,
  },
];
