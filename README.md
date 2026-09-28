# Zentrix ⚡

**AI-Assisted, Milestone-Escrow Freelance Marketplace on MST Blockchain**  
*MST Blockchain × NEWRRO Buildathon 2026 · BMS College of Engineering, Bengaluru*

> *"Don't just build on blockchain — build something that becomes strictly better because of blockchain."*

---

## 🌟 Overview

Zentrix transforms freelance commerce by eliminating payment anxiety, arbitrary account suspensions, and middleman fees. On traditional platforms, escrow and dispute settlements rely entirely on corporate promises. Zentrix anchors **money, agreements, reputation, and subscription access directly on-chain**.

AI advises; humans decide; smart contracts guarantee execution.

---

## 🔗 Verified Testnet Deployments (MST Testnet · Chain ID `91562037`)

All contracts are deployed and verified on the official **MST Testnet**:

| Smart Contract | Deployed Testnet Address | Explorer Proof Link |
|---|---|---|
| **`ZentrixEscrow`** | `0xa50759E9CE985Fbb06503CaeC0DB9D1fB1233726` | [View on MSTScan](https://testnet.mstscan.com/address/0xa50759E9CE985Fbb06503CaeC0DB9D1fB1233726) |
| **`ZentrixReputation`** | `0xB224Bd880326a5046F8526461d25fa5217636cA3` | [View on MSTScan](https://testnet.mstscan.com/address/0xB224Bd880326a5046F8526461d25fa5217636cA3) |
| **`ZentrixPass`** | `0xE33932ba495ff04b321a2c7E58C34b43A7Ff2e9b` | [View on MSTScan](https://testnet.mstscan.com/address/0xE33932ba495ff04b321a2c7E58C34b43A7Ff2e9b) |

### On-Chain Proof Transactions

| Action | Transaction Hash | Status |
|---|---|---|
| **Deploy Contracts** | `0x03f4a7c32f86c9eb639ad210070c1555bf88133b7ab4957160531828956650e0` | Confirmed |
| **Fund Demo Client** | `0x03f4a7c32f86c9eb639ad210070c1555bf88133b7ab4957160531828956650e0` | Confirmed |
| **Fund Demo Freelancer** | `0x24feec36f0bf14315aad3a89ab43b101f741d3789d9c7b62c135c4217d484014` | Confirmed |

---

## 🛡️ Key Features

### 1. Trust-Minimized Milestone Escrow (`ZentrixEscrow.sol`)
- **Upfront Full Funding:** Client deposits total project budget in `tMSTC`.
- **Pull Payments:** Completed milestones unlock funds into non-custodial balances, safe from reentrancy.
- **72-Hour Auto-Release:** If a client becomes inactive after milestone submission, funds automatically release to the freelancer.
- **Mutual Deadline Consensus:** Milestone deadline adjustments require bilateral on-chain consent.

### 2. Soulbound Reputation Credentials (`ZentrixReputation.sol`)
- Non-transferable ERC-721 tokens minted upon milestone approvals.
- Verifiable proof-of-work that cannot be traded, faked, or purchased.

### 3. Sarvam 30B AI Matchmaking Engine
- Server-side tool calling via `sarvam-30b` over marketplace gigs and talent profiles.
- Strict DPDP Act 2023 compliance: personal data (email, phone) is private and **never** exposed to the AI model or on-chain.

### 4. Subscription Pass NFTs (`ZentrixPass.sol`)
- Tiered on-chain subscription passes:
  - **Free Tier:** 2 AI queries / day
  - **Pro Tier (5 tMSTC / 30 days):** 5 AI queries / day + priority matching
  - **Enterprise Tier (15 tMSTC / 30 days):** 15 AI queries / day + high throughput

---

## 🧭 Navigation Architecture

The interface conforms strictly to the specified navigation layout:
- **Logo:** `[Logo] Zentrix` (links to `/`)
- **Home:** Landing page with live MST metrics, architectural pillars, and golden path walkthrough
- **About:** Technical architecture, why MST blockchain, and security guarantees
- **Products:**
  - **Marketplace (`/marketplace`):** Filterable gig board with "Post a Gig" milestone creator modal
  - **AI Agents (`/agent`):** Sarvam 30B chat with role-gated tools and credit metering
- **Monitor:**
  - **Pricing (`/pricing`):** ZentrixPass NFT minting & tier benefits
  - **Dashboard (`/dashboard`):** Real-time escrow tracking, milestone payouts, and pull withdrawals
- **Login / Abstracted Wallet:**
  - Multi-factor Firebase Auth (Google Sign-In & Email/Password)
  - Role onboarding (Client / Freelancer)
  - Mandatory BridgeKey wallet signature binding
  - Profile pill displaying user identity and abstracted address (`0x7359...c85B`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.18.0
- BridgeKey Chrome Extension (or MetaMask EVM fallback)
- MST Testnet RPC: `https://testnetrpc.mstblockchain.com` (Chain ID `91562037`)
- Faucet: [https://faucet.masterstroke.academy](https://faucet.masterstroke.academy)

### Installation
```bash
# Clone the repository
git clone https://github.com/Precise-Goals/Strivo.git zentrix
cd zentrix

# Install dependencies
npm install --legacy-peer-deps --ignore-scripts
```

### Environment Configuration
Copy `.env.example` to `.env.local` and populate:
```ini
MST_TESTNET_RPC=https://testnetrpc.mstblockchain.com
CHAIN_ID=91562037
PRIVATE_KEY=your_deployer_private_key
WALLET_ADDRESSES=deployer_addr,client_addr,freelancer_addr
SARVAM_API_KEY=your_sarvam_key
```

### Verification & Testing Gates
Run the comprehensive test harness:
```bash
# Run all gates (env, contracts, web, secrets, theme, proof)
bash scripts/gate.sh all

# Or run individual verification gates:
bash scripts/gate.sh env        # RPC & testnet balances
bash scripts/gate.sh contracts  # Solidity compile, solhint & 15 unit tests
bash scripts/gate.sh web        # TypeScript typecheck, ESLint & production build
bash scripts/gate.sh theme      # Verifies zero raw hex outside tokens.css
bash scripts/gate.sh proof      # Validates deployed testnet contracts and tx receipts
```

### Running the Application
```bash
# Development mode
npm run dev

# Or build and start production
npm run build
npm run start
```

---

## ⚠️ Known Risks & Hackathon Disclosures
- **Centralized Arbiter:** The arbiter role in `ZentrixEscrow` is held by the deployer key for evaluation purposes. Decentralized DAO arbitration is planned for mainnet.
- **Testnet Tokens:** All transactions occur on MST Testnet using `tMSTC`. No mainnet funds are ever handled.
- **Privacy:** Document hashes and evidence CIDs are anchored on-chain; sensitive documents and contact PII remain encrypted off-chain.
