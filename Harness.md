# Zentrix — Harness.md

**AI-assisted, escrow-backed freelance marketplace on MST Blockchain**
MST Blockchain × NEWRRO Buildathon · 28–29 Sep 2026 · BMS College of Engineering, Bengaluru
Harness target: **Antigravity CLI (`agy`)** · Author role: Solutions Architect

> Zentrix replaces the working name TrustWork from `Concept.pdf`. Concept.pdf is now background only. Where it conflicts with this file, **this file wins**.

---

## 0. How to use this file

1. Finish **§2 Preflight** by hand (wallets and tokens are human tasks).
2. Run `agy` in an empty repo folder and paste this first prompt:

   ```
   Read Harness.md fully. Then, as the orchestrator: (1) create every file listed in §5.3–§5.8 and §7.2 exactly as written,
   (2) extract the task checklist from §8 into .agents/status/TASKS.md, (3) run `bash scripts/gate.sh env`,
   (4) report which files you created and anything in Harness.md you could not follow. Do not start Sprint 1 yet.
   ```
3. Work sprint by sprint (§8). The orchestrator dispatches subagents (§6), every task ends in a gate (§7), and `sprint-monitor` (§9) reports every 30 minutes.

**Non-negotiables** (these are also copied into `AGENTS.md`):
- Testnet only. Mainnet deploy is out of scope and blocked.
- No secret ever enters git, `AGENTS.md`, prompts, or logs.
- Money, agreements, reputation, and subscription tier live **on chain**. Firebase holds profiles, search index, and usage counters only.
- Never invent an MST or BridgeKey API. If it is not in `docs/MST_FACTS.md`, run a spike task first.

---

## 1. Docs review (what was read, what it means)

Reviewed all 8 uploaded files: `BuildathonDocs.pdf`, `Concept.pdf`, `DEPLOYONMAINNET.MD`, `IDE_HANDSONPRACTICES.MD`, `JAVASCRIPTMSTSDK.MD`, `RESOURCES.MD`, `SOLIDITY.MD`, `VIBEKIT.MD`.

### 1.1 Verified facts (with source)

| Fact | Value | Source |
|---|---|---|
| Testnet chain ID / RPC | `91562037` / `https://testnetrpc.mstblockchain.com` | VIBEKIT.MD, DEPLOYONMAINNET.MD |
| Mainnet chain ID / RPC (do not use) | `4646` / `https://mariorpc.mstblockchain.com` | same |
| Testnet explorer | `https://testnet.mstscan.com` | IDE_HANDSONPRACTICES.MD |
| Testnet token | `tMSTC` | IDE_HANDSONPRACTICES.MD |
| Faucet | `https://faucet.masterstroke.academy` | RESOURCES.MD, BuildathonDocs p.4/6 |
| Official wallet | BridgeKey (Chrome extension, Android, bridgekey.io) | RESOURCES.MD, BuildathonDocs p.2 |
| Scaffolder | `npx create-mst-app` (`@mstblockchain/mst-vibe-kit`); templates `blank, token, rwa, defi, demo, certificate, insurance, supplychain` | VIBEKIT.MD |
| Scaffold layout | `packages/{contracts,frontend,shared}`, Hardhat, Next.js, Turbo; only `PRIVATE_KEY` needed in `.env.local` | VIBEKIT.MD |
| Deploy scripts | `npm run deploy:testnet`, `verify:testnet`; writes `packages/contracts/deployments.json` and `packages/shared/src/contracts.ts` | VIBEKIT.MD |
| Base contracts | OpenZeppelin `AccessControl`, `Pausable`, `ReentrancyGuard`, non-upgradeable | VIBEKIT.MD |
| MCP endpoint | `https://mcp.mstblockchain.com/sse` | RESOURCES.MD |
| Prize eligibility (all mandatory) | MST used meaningfully · deployed on **MST Testnet** (contract address + ≥1 tx hash + demo link) · public GitHub with README · working product with on-chain proof · submission form filed before the deadline | BuildathonDocs p.1–2, 8 |
| Originality | AI tools, MCP, Vibe Kit, SDKs allowed. Team must be able to explain every line. Fake or misleading deployment data means disqualification | BuildathonDocs p.6 |

### 1.2 Problems found in the docs (act on these)

| # | Problem | Consequence / decision |
|---|---|---|
| D1 | `JAVASCRIPTMSTSDK.MD` is a byte-for-byte copy of `VIBEKIT.MD`. `SOLIDITY.MD` is a copy of `DEPLOYONMAINNET.MD`. | **The TypeScript SDK (`@mstblockchain/mst-sdk`) docs were never provided.** Task S0-T4 fetches them. Do not guess SDK function names. |
| D2 | Two faucet domains: `faucet.masterstroke.academy` (RESOURCES, Buildathon PDF) vs `faucet.mstblockchain.com` (IDE guide). | Use `masterstroke.academy` first (two official sources), fall back to the other. |
| D3 | `Concept.pdf` says "deploy to MST testnet **or Sepolia**". | Sepolia does **not** satisfy eligibility. MST Testnet only. |
| D4 | `Concept.pdf` uses MetaMask and calls the Claude API from the browser. | Wallet is **BridgeKey first** (MetaMask as fallback). AI calls go through **server routes only** using **Sarvam**. |
| D5 | `Reputation.sol` snippet overrides `_beforeTokenTransfer`. Concept.pdf also says OpenZeppelin v5, where that hook no longer exists (v5 uses `_update`). The snippet also has an unrestricted `mintReputation`. | Do not copy it. Soulbound = override `_update` + `MINTER_ROLE`. Reuse Vibe Kit's `certificate` template as the reference. |
| D6 | Concept.pdf quotes "2.5L+ prize" and "₹50 Lakh grant". Buildathon docs: cash awards total ₹1,04,000 (₹60k main + ₹20k robotics + ₹14k special + ₹10k social) + 50,000 $MSTC pool; grant "up to $50,000". | Pitch only numbers from the Buildathon docs. |
| D7 | Concept.pdf says the repo must show commit history from kickoff. Rulebook says "build from scratch". | Create the repo **at kickoff**; commit early and often. Nothing pre-built. |
| D8 | **`BuildathonDocs.pdf` p.4 prints MCP OAuth client ID and secret in plain text.** The PDF goes to all 104 teams. | Treat as shared, low-trust. Keep only in `.env.local`. Never in repo, `AGENTS.md`, or prompts. `check-secrets` greps for it. |
| D9 | `deploy:mainnet` ships in every Vibe Kit project. | Delete that script from `package.json` in S0. Cheap and hard to bypass. |

---

## 2. Preflight: MST tokens on testnet (human tasks, ~20 min)

> I cannot verify your balances: this environment has no route to MST endpoints and no access to your wallets. The script below does it on your machine, so nothing is assumed.

**Wallets.** Create **three** BridgeKey accounts: `deployer` (also arbiter/admin), `demo-client`, `demo-freelancer`. Record only the public addresses in `.env.local` as `WALLET_ADDRESSES`. Only `deployer`'s private key goes in `PRIVATE_KEY`.

**Add the network** (BridgeKey → Add network, or via the explorer's "Add MST Testnet" button at the bottom of `testnet.mstscan.com`):

| Field | Value |
|---|---|
| Network name | MST Testnet |
| RPC URL | `https://testnetrpc.mstblockchain.com` |
| Chain ID | `91562037` |
| Currency | `tMSTC` |
| Explorer | `https://testnet.mstscan.com` |

**Claim tokens** from the faucet for all three addresses. Faucets often rate-limit per address or per IP, so start now. Screenshot each balance into `docs/proof/` (useful for the demo video).

**Verify** with `scripts/preflight.ts` (§7.2). It passes only if the chain ID is `91562037`, blocks are advancing, and every address holds ≥ `MIN_BALANCE` (default 0.1 tMSTC).

**Budget rule:** each Escrow demo run funds a small gig (0.01–0.05 tMSTC). Keep ≥ 1 tMSTC on `deployer` for deploys/redeploys.

---

## 3. Product spec (frozen v0)

### 3.1 Roles and entry

- Two entrances, HackerRank-style: `/login/client` ("Hire talent") and `/login/freelancer` ("Find work"). Both use wallet-signature login (nonce → sign → server verifies → Firebase custom token). One wallet ↔ one `uid`.
- A wallet may hold both roles (separate profiles); the role is chosen at login and switchable from the profile menu. *(Assumption A7)*

### 3.2 Onboarding (strict and short; one screen per role, all required unless noted)

| Client | Freelancer |
|---|---|
| Name · Email · Organization · Designation · Phone · BridgeKey wallet (auto-mapped by signature) · Industry tags (≥1) · Client details (short text, optional) | Name · Email · Designation · Phone · BridgeKey wallet (auto-mapped) · Industry tags (≥1) · Expertise/technologies (≥1) · Previous projects (optional, ≤5 with title, link, one line) |

Rules: zod validation shared by client and server; Firestore stores **PII (email, phone) privately** (owner-read only). Public profile = name, designation, org/tags/expertise, wallet, reputation. **PII never goes on chain and never reaches the AI agent.** *(India's DPDP Act 2023 applies to personal data; get proper consent copy before a real launch.)*

### 3.3 Gig (project) lifecycle

```
Draft ──createGig──► Open ──assignAndFund(client, sends tMSTC)──► Assigned
   (client)                                     │
                                  acceptAssignment(freelancer)  ← this tx = freelancer's signature
                                                ▼
                                             Active ──► per milestone:
   submitMilestone(evidenceCID) → approve → paid (pull-payment)
                               → reject(reasonCID) → dispute → arbiter split
                               → silence > reviewWindow → autoRelease to freelancer
   proposeDeadline / acceptDeadline (both parties, per milestone)
   last milestone approved → Reputation SBT minted to freelancer → Completed
```

- Each gig has milestones (title, amount, deadline, acceptance-criteria hash), a review window (default 72 h) and metadata (description on IPFS/Firebase Storage, CID on chain).
- Deadlines are **negotiable**: one side proposes, the other accepts, both recorded on chain.
- **Fairness mechanism for "unfair evaluation":** (1) acceptance criteria hashed at creation, (2) rejection requires a reason CID, (3) auto-release if the client is silent, (4) dispute → arbiter with AI-written neutral summary (advisory only), (5) an **Evaluation & Disclosure Agreement** signed by both parties at assignment.
- **Private documents on a public chain:** on chain we store only `agreementHash` (keccak256 of the document) and `agreementCID`. The document itself is AES-GCM encrypted in the browser (WebCrypto), stored off chain, and the key is wrapped for the two parties and the arbiter. *(Assumption A3. Have a lawyer look at enforceability before real use.)*

### 3.4 Agent ("AI Mode" search bar)

- Freelancer role → finds open gigs. Client role → finds freelancer profiles. Role-gated tools; never crosses over.
- Model: **Sarvam `sarvam-30b`** (128K-context `sarvam-105b` optional). `sarvam-m` is deprecated, so do not use it. Endpoint `POST https://api.sarvam.ai/v1/chat/completions`, header `api-subscription-key`, OpenAI-style `tools`. Key is **server-side only**.
- Retrieval v1 (ship): tool-calling over Firestore (`search_gigs`, `search_freelancers`: tags, tech, budget, deadline filters, keyword match). The LLM ranks the returned rows and explains why. Retrieval v2 (only if time): embeddings + vector search. Sarvam embedding support is unverified, so pick a provider in S4 (Assumption A6).
- Agent tools return **public-safe fields only**. A test asserts no email/phone ever appears in tool output.

### 3.5 Credits and Pass NFT

| Tier | Agent queries / day | Token |
|---|---|---|
| Free | 2 | none |
| Pro | 5 | `ZentrixPass` NFT, tier=1, 30 days |
| Enterprise | 15 | `ZentrixPass` NFT, tier=2, 30 days |

- Price anchors: Pro ≈ Claude Pro, Enterprise ≈ Claude Max. **Confirm current Claude prices yourself before quoting them.** Testnet prices are mock values (Pro 5 tMSTC, Enterprise 15 tMSTC).
- Metering is server-side: `POST /api/agent` verifies Firebase ID token → wallet → `tierOf(wallet)` on chain (cached ≤60 s) → Firestore transaction on `usage/{wallet}_{YYYY-MM-DD IST}` → 429 with reset time when exhausted. 1 credit = 1 query. Resets midnight IST. No rollover. *(A5)*
- Pass is non-transferable (soulbound) so credits can't be resold. *(A4)*

### 3.6 Dashboard (shared shell, role-specific content)

Firebase-Console-style: left rail (Projects · Milestones · Agent · Reputation · Settings), top bar with **project switcher** and role toggle, content cards.

- **Empty state (no projects):** centered minimal panel. Client → "Create a project". Freelancer → "Accept a project" (opens Agent + Gig board).
- **Client view:** per-project milestone timeline + status chips, funds locked / released / pending (bar), milestone status (donut), next deadlines, actions (approve / reject / propose deadline).
- **Freelancer view:** same shell: earnings released vs pending (line/bar), upcoming deadlines, submit-milestone actions, reputation SBT gallery.
- Every on-chain action shows: pending spinner → confirmed → explorer link (`https://testnet.mstscan.com/tx/<hash>`).

### 3.7 Theme

| Token | Hex | Use |
|---|---|---|
| `--zx-primary` | `#D84040` | Primary fills, large/bold headings, chart accent |
| `--zx-primary-deep` | `#A31D1D` | Buttons with white text, links, hover/active, text on cream |
| `--zx-cream` | `#ECDCBF` | App background |
| *derived* `--zx-ink` | `#2A0F0F` | Body text |
| *derived* `--zx-muted` | `#6B4A4A` | Secondary text |
| *derived* `--zx-surface` | `#F7EFDF` | Cards on cream |
| *derived* `--zx-success` / `--zx-warning` | `#2F7D4F` / `#B7791F` | Status only, always paired with icon + label |

**Contrast (my approximate calculation, please confirm with a checker):** white on `#D84040` is ≈4.4:1 (under the 4.5:1 AA line for normal text) and `#D84040` text on cream is ≈3.3:1. So: **buttons with text use `#A31D1D`** (≈7.6:1 with white); `#D84040` is for large/bold text, fills and graphics; body text is `--zx-ink`. Charts use tints of the primary plus ink; never rely on color alone.

All colors live in `packages/frontend/src/styles/tokens.css`; **no raw hex anywhere else** (`check-theme` enforces).

---

## 4. Architecture

```
Browser (Next.js, BridgeKey)
 ├─ ethers v6 ──► MST Testnet (91562037)
 │                 ├─ ZentrixEscrow      (gigs, milestones, agreement hash, disputes, pull-payments)
 │                 ├─ ZentrixReputation  (soulbound; MINTER_ROLE = Escrow)
 │                 └─ ZentrixPass        (tiered subscription NFT, expiry)
 ├─ Firebase Auth (custom token from wallet signature) + Firestore (client SDK, rules-guarded)
 └─ Next.js route handlers (server)
      ├─ /api/auth/nonce, /api/auth/verify
      ├─ /api/gigs/sync?gigId=      chain → Firestore mirror (called after every tx)
      ├─ /api/agent                 Sarvam tool-calling + credit metering
      ├─ /api/agreement/*           encrypted doc upload helpers
      └─ scripts/indexer.ts         optional event watcher for the demo
```

**Source of truth:** chain for money, agreement hashes, deadlines, reputation, tier. Firestore = profiles, applications, search index, usage, cached mirror. If they disagree, chain wins.

### 4.1 Contract interfaces (Solidity ^0.8.20, OZ v5, custom errors, events on every state change)

```solidity
// ZentrixEscrow is AccessControl, Pausable, ReentrancyGuard   (ARBITER_ROLE, PAUSER_ROLE)
enum GigStatus { Open, Assigned, Active, Completed, Cancelled }
enum MStatus  { Pending, Submitted, Approved, Rejected, Disputed, Resolved, AutoReleased }
struct Milestone { uint96 amount; uint64 deadline; bytes32 criteriaHash; MStatus status;
                   uint64 submittedAt; string evidenceCID; string reasonCID; }

createGig(string metadataCID, Milestone[] plan, uint64 reviewWindow) returns (uint256 gigId)
assignAndFund(uint256 gigId, address freelancer, bytes32 agreementHash, string agreementCID) payable // msg.value == sum(plan)
acceptAssignment(uint256 gigId)                        // freelancer; sets Active; 48h else client may cancelUnaccepted
cancelUnaccepted(uint256 gigId)                        // refund to client's withdrawable balance
submitMilestone(uint256 gigId, uint256 i, string evidenceCID)
approveMilestone(uint256 gigId, uint256 i, uint8 rating /*1-5, used on last milestone*/)
rejectMilestone(uint256 gigId, uint256 i, string reasonCID)          // reason mandatory
autoRelease(uint256 gigId, uint256 i)                                // only after reviewWindow with no client action
raiseDispute(uint256 gigId, uint256 i)                               // freelancer, after reject
resolveDispute(uint256 gigId, uint256 i, uint16 freelancerBps, string rulingCID) // ARBITER_ROLE; bps<=10000
proposeDeadline(uint256 gigId, uint256 i, uint64 newDeadline)        // either party
acceptDeadline(uint256 gigId, uint256 i)                             // the other party
withdraw()                                                           // pull payments; nonReentrant
// Events: GigCreated, Funded, AgreementSigned(gigId,party,hash), MilestoneSubmitted/Approved/Rejected/Disputed/Resolved, DeadlineProposed/Accepted, Withdrawn

// ZentrixReputation: ERC721, soulbound via _update override (revert unless from==0), MINTER_ROLE
mintReputation(address to, ReputationData d) ; getReputationScore(address) view

// ZentrixPass: ERC721, one active pass per wallet, soulbound
buy(uint8 tier) payable ; tierOf(address) view returns (uint8 /*0 none/expired*/) ; setPrice(tier, wei) // admin
```

Invariant to fuzz: `address(this).balance == Σ locked milestone funds + Σ withdrawable`.

### 4.2 Firestore collections (top level)

`users/{uid}` · `wallets/{address}` (unique wallet→uid) · `clients/{uid}` · `freelancers/{uid}` (each has `public{}` and `private{}` split; rules allow public read, owner-only private) · `gigs/{gigId}` (mirror + `searchText`, `tags[]`, `techs[]`) · `applications/{gigId}_{uid}` · `agreements/{gigId}` (encrypted blob metadata only) · `usage/{wallet}_{date}` (server-write only) · `nonces/{address}` (server-only).

---

## 5. Setting up `agy`

### 5.1 Install and authenticate

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash
# Windows (PowerShell)
irm https://antigravity.google/cli/install.ps1 | iex

agy --version            # restart the terminal if not found; binary is `agy` in ~/.local/bin
agy                      # first run: Google sign-in in the browser (keyring-cached)
```

Inside the TUI: `/help`, `/model` (pick per task), `/usage` (quota; check it before spawning parallel agents), `/context`, `/agent <task>` (async subagent), `@path` to attach files.

Headless: `agy -p "<prompt>" --print-timeout 25m` (default timeout is 5m). Useful flags: `-c` continue last conversation, `--add-dir`, `--sandbox`. **Do not use `--dangerously-skip-permissions`.**

**Reality check on the CLI (docs are still sparse):** one tutorial documents `agy inspect` and `--output-format json`; a user reported neither exists on their build (`agy help` lists `changelog help install plugin plugins update`). This harness therefore **only relies on**: `AGENTS.md`, `.agents/` files as plain markdown, `agy -p`, `/agent`, and shell scripts. Run `agy help` and `/help` once, and confirm what loaded with `/context`. If a feature is missing, the scripts still work.

### 5.2 Model policy (adjust to what `/model` lists on your plan)

| Work | Model tier |
|---|---|
| Contracts, security review, Sarvam tool-calling logic | strongest available (e.g. Gemini 3.1 Pro or a Claude model if offered) |
| UI, forms, glue, docs, monitoring | fast tier (e.g. Gemini 3.5 Flash) |

Async subagents consume quota **in parallel**. Cap concurrency at **3 running agents**.

### 5.3 Repo layout (created by orchestrator in S0)

```
zentrix/
├─ AGENTS.md                      # §5.4
├─ Harness.md                     # this file
├─ docs/{MST_FACTS.md,PROOF.md,proof/}
├─ .agents/
│   ├─ rules/{theme.md,security.md,contracts.md}
│   ├─ agents/<role>.md           # §6 role cards
│   ├─ skills/{gate,status-report,theme-audit}/SKILL.md   # §5.6
│   └─ status/{TASKS.md,STATUS.md,gates.log,runs/}
├─ scripts/{preflight.ts,gate.sh,check-secrets.sh,check-theme.sh,check-chain-proof.ts,spawn.sh,merge-gate.sh,monitor.sh}
├─ packages/{contracts,frontend,shared}     # from create-mst-app
└─ .env.example  .env.local (git-ignored)
```

Scaffold command (S0-T3):
`npx create-mst-app zentrix --template blank --pm npm --git --yes`, then remove `deploy:mainnet` from root `package.json`. Use `--template certificate` in a scratch folder as a reference for the soulbound ERC-721, since Vibe Kit is explicitly permitted. Run `ls packages/frontend` before assuming the Next.js router style.

### 5.4 `AGENTS.md` (write exactly this)

```markdown
# Zentrix — agent rules
Zentrix = freelance marketplace (client/freelancer roles) with on-chain escrow on MST Testnet, Sarvam-powered search agent, Pass NFT credits.
Spec: Harness.md §3–4. Facts about MST/BridgeKey: docs/MST_FACTS.md only. If a fact is missing, create a spike task; never guess.

## Hard rules
1. Testnet only (chain 91562037). Never run or add mainnet deploys. Never touch chain 4646.
2. No secrets in git, prompts, logs, or this file. Secrets live in .env.local. Run `bash scripts/gate.sh secrets` before every commit.
3. Chain is source of truth for money/agreements/reputation/tier. Firebase = profiles, index, usage.
4. PII (email, phone) never on chain, never in agent tool output, never in client-readable public docs.
5. AI provider = Sarvam `sarvam-30b`, called from server routes only. Never `sarvam-m`. Never call an LLM from the browser.
6. Colors only via tokens in packages/frontend/src/styles/tokens.css (#D84040 #A31D1D #ECDCBF + derived). No raw hex elsewhere.
7. Solidity: ^0.8.20, OpenZeppelin v5, custom errors, checks-effects-interactions, pull payments, nonReentrant on value paths, events on every state change.
8. Every UI action that sends a tx shows pending → confirmed → explorer link. Every list has designed empty/loading/error states.

## Working agreement
- One task = one branch `agent/<role>-<taskId>` = one merge via `scripts/merge-gate.sh`. Small commits: `<taskId>: <what>`.
- Stay inside your role's owned paths (.agents/agents/<role>.md). Need something outside? Write it into .agents/status/BLOCKERS.md and stop.
- Definition of done = the task's gate passes and you paste its output tail in your final message.
- Prefer boring, readable code: the team must explain every line to judges.
- Cut, don't half-build: see Harness.md §10.

## Commands
npm run compile | test | lint | deploy:testnet | verify:testnet   (contracts)
bash scripts/gate.sh <env|contracts|web|secrets|theme|proof|all>
bash scripts/spawn.sh <role> "<taskId: description>"
bash scripts/monitor.sh
```

### 5.5 Rules files (`.agents/rules/`)

- `theme.md` → §3.7 verbatim.
- `security.md` → hard rules 2–5 + "arbiter key is a demo key; document it in README as a known risk".
- `contracts.md` → §4.1 interfaces + test list in S1-C4.

### 5.6 Skills (`.agents/skills/<name>/SKILL.md`, frontmatter `name` + `description`)

> Tutorials show both `skills/<name>/SKILL.md` and `skills/<name>.md`. Use the folder form; if `/help` doesn't list them, rename to flat `.md`.

- **gate**: "Run when a task claims to be done. Execute `bash scripts/gate.sh <name>`, quote the last 15 lines, and refuse to mark the task complete on non-zero exit."
- **status-report**: "Run `bash scripts/monitor.sh`, compare with the plan in §8/§9, and rewrite `.agents/status/STATUS.md` using the template."
- **theme-audit**: "Run `bash scripts/gate.sh theme`, then list any component missing focus styles, empty/loading/error states, or with text/background pairs under 4.5:1."

### 5.7 MCP (optional but useful)

Add MST's MCP so agents can query chain docs/data. In `~/.gemini/config/mcp_config.json` (path per current `agy` builds; verify) remote servers need `serverUrl`:

```json
{ "mcpServers": { "mst": { "serverUrl": "https://mcp.mstblockchain.com/sse" } } }
```

If `agy` prompts for OAuth, enter the client credentials from the Buildathon PDF at the prompt. **Do not write them into this file or the repo** (see D8). Also useful: Sarvam's docs MCP at `https://docs.sarvam.ai/_mcp/server`, which is read-only documentation.

### 5.8 Dispatch pattern (worktree fan-out)

```bash
# scripts/spawn.sh  — usage: bash scripts/spawn.sh chain-dev "S1-C2: implement ZentrixEscrow per Harness §4.1"
#!/usr/bin/env bash
set -euo pipefail
role="$1"; task="$2"; ROOT="$(git rev-parse --show-toplevel)"
id="$(echo "$task" | cut -d: -f1 | tr -c 'A-Za-z0-9\n-' '-')"; slug="${role}-${id}"
mkdir -p "$ROOT/.agents/status/runs" "$ROOT/../zentrix-wt"
git -C "$ROOT" worktree add -b "agent/${slug}" "$ROOT/../zentrix-wt/${slug}" HEAD
cp "$ROOT/.env.local" "$ROOT/../zentrix-wt/${slug}/.env.local" 2>/dev/null || true
cd "$ROOT/../zentrix-wt/${slug}"
nohup agy -p "You are the ${role} subagent for Zentrix. Read AGENTS.md, .agents/agents/${role}.md and Harness.md sections relevant to your task. Task: ${task}. Work only inside your owned paths. Finish by running your role's gates, commit on this branch, and end with: TASK=<id> STATUS=<done|blocked> GATES=<pass|fail> NOTES=<one line>." \
  --print-timeout 25m > "$ROOT/.agents/status/runs/${slug}.txt" 2>&1 &
echo "spawned ${slug} pid $!"
```

```bash
# scripts/merge-gate.sh — usage: bash scripts/merge-gate.sh agent/chain-dev-S1-C2 <gate>
#!/usr/bin/env bash
set -euo pipefail
br="$1"; gate="${2:-all}"
git merge --no-ff --no-commit "$br" || { git merge --abort; echo "CONFLICT: resolve manually"; exit 1; }
if bash scripts/gate.sh "$gate"; then git commit -m "merge $br (gate $gate pass)"; else git merge --abort; echo "gate failed: merge aborted"; exit 1; fi
```

The **orchestrator is the only agent that merges**. Subagents never push to `main`. (`.env.local` is copied into worktrees; it is git-ignored, so it can't leak into a commit.)

---

## 6. Subagent roster

Every role has a card at `.agents/agents/<role>.md`, using this template:

```markdown
# <role>
Mission: <one line>
Owns (may edit): <paths>
Read-only: everything else
Inputs: <docs/tasks>
Outputs: <artifacts>
Gates before "done": <gate names>
Escalate (write to .agents/status/BLOCKERS.md, then stop): <conditions>
```

| Role | Model | Owns | Gates | Mission |
|---|---|---|---|---|
| **orchestrator** (main session) | strong | `packages/shared`, `docs/`, `.agents/status/TASKS.md`, merges | all | Sequence sprints, dispatch, merge through gates, keep the golden path alive, own final call on cuts |
| **docs-auditor** | fast | `docs/MST_FACTS.md` | — | Fetch SDK/Vibe Kit/MCP docs from docs.mstblockchain.com and the npm READMEs (D1); spike BridgeKey (EIP-1193? `signMessage`, `wallet_switchEthereumChain`/`addChain`); record every fact **with source URL** |
| **chain-dev** | strong | `packages/contracts/**` | contracts, proof | Escrow, Reputation, Pass, tests, deploy scripts, ABI export |
| **chain-auditor** | strong | `packages/contracts/test/**` (add-only) + `docs/AUDIT.md` | contracts | Adversarial review: Slither, solhint, fuzz/invariants, reentrancy/DoS/role checks; **cannot edit contract sources**, only file findings |
| **platform-dev** | fast/strong | `packages/frontend/src/app/api/**`, `src/server/**`, `firestore.rules`, `scripts/indexer.ts` | web, secrets | Wallet-sig auth, onboarding persistence, gig sync, evidence/agreement storage, credit metering |
| **agent-dev** | strong | `src/server/agent/**`, `src/app/api/agent/**` | web, secrets | Sarvam tool-calling, `search_gigs`/`search_freelancers`, PII stripping tests, streaming |
| **web-dev** | fast | `packages/frontend/src/{app/(pages),components,styles,hooks}/**` | web, theme | All screens, dashboard, wallet hook, tx state UI |
| **design-qa** | fast | none (report only) → `docs/DESIGN_QA.md` | theme | Contrast, focus, responsive, empty/loading/error states, consistency with §3.7 |
| **e2e-qa** | fast | `scripts/e2e/**` | proof, all | Scripted + manual golden-path runs on testnet with the two demo wallets; files bugs |
| **sprint-monitor** | fast | `.agents/status/STATUS.md` | — | §9: every 30 min compute burn-down, gate pass-rate, stalls, quota; recommend cuts |
| **submission-scribe** | fast | `README.md`, `docs/PROOF.md`, demo script | proof | README (MST integration, addresses, setup), submission-form answers, demo script |

Concurrency plan: at most 3 of {chain-dev, platform-dev, web-dev, agent-dev, chain-auditor} at once; `sprint-monitor` and `docs-auditor` are cheap and run alongside.

---

## 7. Checks and gates

### 7.1 Gate matrix

| Gate | Command | Passes when |
|---|---|---|
| `env` | `bash scripts/gate.sh env` | RPC reachable, chainId 91562037, blocks advancing, each `WALLET_ADDRESSES` balance ≥ `MIN_BALANCE` |
| `contracts` | `bash scripts/gate.sh contracts` | `npm run compile`, `npm run lint`, `npm run test` all green; Slither has no High/Medium (if installed) |
| `web` | `bash scripts/gate.sh web` | `tsc --noEmit`, ESLint, `next build` succeed |
| `secrets` | `bash scripts/gate.sh secrets` | no `.env*` tracked; no key/secret patterns in tracked files |
| `theme` | `bash scripts/gate.sh theme` | no raw hex outside tokens/tailwind config |
| `proof` | `bash scripts/gate.sh proof` | every address in `deployments.json` has code on testnet; `docs/PROOF.md` has ≥1 tx hash with a successful receipt |
| `all` | `bash scripts/gate.sh all` | env + contracts + web + secrets + theme + proof |

Add a `.git/hooks/pre-commit` that runs `gate.sh secrets` and `gate.sh theme`. It works regardless of `agy` hook support.

### 7.2 Script sources (create as written)

**`scripts/gate.sh`**
```bash
#!/usr/bin/env bash
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"; LOG=".agents/status/gates.log"; mkdir -p .agents/status
run() { # name, command...
  local n="$1"; shift
  if "$@"; then echo "$(date +%H:%M:%S) $n PASS" | tee -a "$LOG"; else echo "$(date +%H:%M:%S) $n FAIL" | tee -a "$LOG"; return 1; fi
}
env_g()       { run env       npx tsx scripts/preflight.ts; }
contracts_g() { run contracts bash -c 'npm run compile && npm run lint && npm run test && (command -v slither >/dev/null && (cd packages/contracts && slither . --exclude-informational --exclude-low) || echo "slither not installed: skipped")'; }
web_g()       { run web       bash -c 'npx tsc --noEmit -p packages/frontend && npm --prefix packages/frontend run lint && npm --prefix packages/frontend run build'; }
secrets_g()   { run secrets   bash scripts/check-secrets.sh; }
theme_g()     { run theme     bash scripts/check-theme.sh; }
proof_g()     { run proof     npx tsx scripts/check-chain-proof.ts; }
case "${1:-all}" in
  env) env_g;; contracts) contracts_g;; web) web_g;; secrets) secrets_g;; theme) theme_g;; proof) proof_g;;
  all) rc=0; for f in env_g contracts_g web_g secrets_g theme_g proof_g; do $f || rc=1; done; exit $rc;;
  *) echo "unknown gate"; exit 2;;
esac
```

**`scripts/preflight.ts`** (needs only public addresses)
```ts
import { JsonRpcProvider, formatEther, parseEther } from "ethers";
const RPC = process.env.MST_TESTNET_RPC ?? "https://testnetrpc.mstblockchain.com";
const EXPECTED = 91562037n;
const MIN = parseEther(process.env.MIN_BALANCE ?? "0.1");
const addrs = (process.env.WALLET_ADDRESSES ?? "").split(",").map(s => s.trim()).filter(Boolean);
(async () => {
  let ok = true;
  const p = new JsonRpcProvider(RPC);
  const net = await p.getNetwork();
  if (net.chainId !== EXPECTED) { console.error(`✗ chainId ${net.chainId} != ${EXPECTED}`); ok = false; }
  const b1 = await p.getBlockNumber(); await new Promise(r => setTimeout(r, 6000)); const b2 = await p.getBlockNumber();
  console.log(`block ${b1} → ${b2}`); if (b2 <= b1) { console.error("✗ blocks not advancing (or block time > 6s; rerun)"); ok = false; }
  if (addrs.length < 3) { console.error("✗ set WALLET_ADDRESSES to deployer,demo-client,demo-freelancer"); ok = false; }
  for (const a of addrs) { const bal = await p.getBalance(a); const good = bal >= MIN;
    console.log(`${good ? "✓" : "✗"} ${a} ${formatEther(bal)} tMSTC`); if (!good) ok = false; }
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error("✗ RPC error:", e.message); process.exit(1); });
```

**`scripts/check-secrets.sh`**
```bash
#!/usr/bin/env bash
bad=0
git ls-files | grep -E '(^|/)\.env(\.local)?$' && { echo "✗ env file is tracked"; bad=1; }
pat='(PRIVATE_KEY=0x[0-9a-fA-F]{64}|PRIVATE_KEY=[0-9a-fA-F]{64}|sk_[A-Za-z0-9]{24,}|mst-mcp-secret|OAUTH_CLIENT_SECRET=\S+)'
if git ls-files -z | xargs -0 grep -InE "$pat" 2>/dev/null; then echo "✗ secret-like string in tracked files"; bad=1; fi
exit $bad
```

**`scripts/check-theme.sh`**
```bash
#!/usr/bin/env bash
hits=$(grep -rInE '#[0-9a-fA-F]{6}\b' packages/frontend/src --include=*.ts --include=*.tsx --include=*.css 2>/dev/null \
  | grep -v 'styles/tokens.css')
if [ -n "$hits" ]; then echo "$hits"; echo "✗ raw hex outside tokens.css"; exit 1; fi
```

**`scripts/check-chain-proof.ts`**
```ts
import { JsonRpcProvider } from "ethers"; import fs from "fs";
const p = new JsonRpcProvider(process.env.MST_TESTNET_RPC ?? "https://testnetrpc.mstblockchain.com");
const addrRe = /^0x[0-9a-fA-F]{40}$/, hashRe = /0x[0-9a-fA-F]{64}/g;
const collect = (o: any, out: string[] = []) => { if (typeof o === "string" && addrRe.test(o)) out.push(o); else if (o && typeof o === "object") Object.values(o).forEach(v => collect(v, out)); return out; };
(async () => {
  let ok = true;
  const addrs = collect(JSON.parse(fs.readFileSync("packages/contracts/deployments.json", "utf8")));
  if (!addrs.length) { console.error("✗ no addresses in deployments.json"); ok = false; }
  for (const a of addrs) { const code = await p.getCode(a); const good = code !== "0x";
    console.log(`${good ? "✓" : "✗"} ${a} https://testnet.mstscan.com/address/${a}`); if (!good) ok = false; }
  const hashes = (fs.existsSync("docs/PROOF.md") ? fs.readFileSync("docs/PROOF.md", "utf8") : "").match(hashRe) ?? [];
  if (!hashes.length) { console.error("✗ docs/PROOF.md has no tx hash"); ok = false; }
  for (const h of hashes) { const r = await p.getTransactionReceipt(h); const good = r?.status === 1;
    console.log(`${good ? "✓" : "✗"} tx ${h}`); if (!good) ok = false; }
  process.exit(ok ? 0 : 1);
})();
```

**`scripts/monitor.sh`**
```bash
#!/usr/bin/env bash
ROOT="$(git rev-parse --show-toplevel)"; S="$ROOT/.agents/status"
done=$(grep -cE '^- \[x\]' "$S/TASKS.md"); total=$(grep -cE '^- \[[ x]\]' "$S/TASKS.md")
pass=$(grep -c ' PASS$' "$S/gates.log" 2>/dev/null); fail=$(grep -c ' FAIL$' "$S/gates.log" 2>/dev/null)
echo "TASKS ${done:-0}/${total:-0} | GATES pass ${pass:-0} fail ${fail:-0}"
echo "--- agent branches (last commit)"; git for-each-ref --format='%(refname:short)  %(committerdate:relative)' refs/heads/agent
echo "--- running agy"; pgrep -fl 'agy .*-p' || echo none
echo "--- blockers"; cat "$S/BLOCKERS.md" 2>/dev/null || echo none
echo "--- last 8 gate results"; tail -n 8 "$S/gates.log" 2>/dev/null
```

---

## 8. Sprints and tasks

Timeline assumes kickoff **T0 = 15:30, 28 Sep** (from Concept.pdf; adjust if the schedule differs). Task ID = `S<sprint>-<code>`. Format in `TASKS.md`: `- [ ] S1-C2 (chain-dev, 40m) …`.

### Golden path (everything is judged against this)

Client onboards → posts gig with 3 milestones → Freelancer asks the **Agent**, finds it, applies → Client assigns + funds escrow → Freelancer accepts + submits M1 → Client approves → dashboards update → after M3 the Reputation SBT appears. Everything else is optional until this passes twice in a row.

### S0 · Preflight and scaffold — 15:30–16:15 (45 m)

- [ ] S0-T1 (human) §2 wallets, network, faucet for 3 addresses; `gate env` passes
- [ ] S0-T2 (human) `agy` installed + signed in; Sarvam API key; Firebase project (Auth, Firestore, Storage); IPFS/Pinata key *or* decide Firebase Storage; fill `.env.local`
- [ ] S0-T3 (orchestrator) scaffold (§5.3), delete `deploy:mainnet`, `git init`, first commit, private repo → public later
- [ ] S0-T4 (docs-auditor) `docs/MST_FACTS.md`: SDK API surface, Vibe Kit details, MCP, BridgeKey spike results, all with URLs
- [ ] S0-T5 (orchestrator) materialize harness files; `gate secrets` + `gate env`

**G0:** `gate env` PASS · scaffold builds · `MST_FACTS.md` answers "how do I connect BridgeKey and sign a message".

### S1 · Contracts ‖ Auth+Onboarding ‖ Shell — 16:15–18:45 (2.5 h)

- [ ] S1-C1 (chain-dev, 30m) `ZentrixReputation` (from `certificate` reference; `_update` override; `MINTER_ROLE`)
- [ ] S1-C2 (chain-dev, 60m) `ZentrixEscrow` per §4.1
- [ ] S1-C3 (chain-dev, 25m) `ZentrixPass` (tier, expiry, soulbound, admin prices)
- [ ] S1-C4 (chain-dev, 45m) tests: happy path; reject→dispute→split sums exactly to amount; `autoRelease` reverts before window; `sum(plan)==msg.value`; role-gated `resolveDispute`; pause; deadline needs both parties; cancel refund; withdraw reentrancy attack; final milestone mints exactly one SBT; SBT/Pass transfer reverts; Pass expiry
- [ ] S1-C5 (chain-dev, 20m) `deploy:testnet`, grant `MINTER_ROLE` to Escrow, ABIs to `shared`, first real tx hash into `docs/PROOF.md`
- [ ] S1-A1 (chain-auditor, 40m) Slither/solhint/invariant fuzz; findings to `docs/AUDIT.md`; chain-dev fixes High/Medium
- [ ] S1-P1 (platform-dev, 40m) nonce/verify endpoints → Firebase custom token; `wallets/{address}` uniqueness
- [ ] S1-P2 (platform-dev, 45m) `firestore.rules` (public/private split) + zod schemas in `shared`
- [ ] S1-W1 (web-dev, 30m) `tokens.css`, Tailwind mapping, layout, buttons/inputs/cards
- [ ] S1-W2 (web-dev, 40m) landing + `/login/client` `/login/freelancer` + wallet hook (BridgeKey first)
- [ ] S1-W3 (web-dev, 45m) onboarding forms (§3.2), field errors, tag inputs

**G1:** `gate contracts` PASS · contracts deployed on MST Testnet with a PROOF tx · both roles can log in with BridgeKey and finish onboarding · `gate theme` PASS.

### S2 · Gig lifecycle — 18:45–20:45 (2 h)

- [ ] S2-W4 create-gig form with milestone builder (amounts, dates; total shown in tMSTC; tx state UI)
- [ ] S2-P3 `/api/gigs/sync` chain→Firestore mirror; called after each tx
- [ ] S2-W5 gig board (search, tag/budget filters) + gig detail
- [ ] S2-W6 apply (proposal text → `applications`); client sees applicants
- [ ] S2-W7 client "assign & fund" (tx) · freelancer "accept" (tx)
- [ ] S2-A2 (chain-auditor) review against deployed contract; try to break funding math via UI inputs

**G2:** golden-path steps 1–5 run on testnet with the two demo wallets; tx hashes in PROOF.md.

**Dinner + rest 20:45–21:15.** Assign a person to sleep 23:00–02:00, another 02:00–05:00 (rested eyes for final polish).

### S3 · Milestones + Dashboard — 21:15–23:15 (2 h)

- [ ] S3-W8 dashboard shell (rail, project switcher, role toggle) with **empty states** per role
- [ ] S3-W9 role widgets with Recharts: locked/released/pending; status donut; deadlines
- [ ] S3-W10 milestone timeline + submit / approve / reject(reason) actions
- [ ] S3-P4 evidence upload → CID (Firebase Storage or IPFS)
- [ ] S3-W11 deadline propose/accept UI
- [ ] S3-A3 (design-qa) first pass on §3.7 (contrast, focus, mobile)

**G3:** a full milestone payout is visible on both dashboards; `gate web` + `gate theme` PASS.

### S4 · Agent + Credits + Pass — 23:15–01:15 (2 h)

**Hard checkpoint at 00:30: cut anything under 50% done (see §10).**

- [ ] S4-AG1 `/api/agent` Sarvam call with tools, streaming
- [ ] S4-AG2 `search_gigs` / `search_freelancers` (role-gated, PII-stripped) + test that no email/phone can appear
- [ ] S4-AG3 credit metering (Firestore transaction, IST reset, 429 payload with reset time)
- [ ] S4-W12 AI Mode search bar + result cards + "credits left" chip + paywall dialog
- [ ] S4-W13 Pass purchase UI (`buy`) + `tierOf` badge
- [ ] S4-AG4 (optional) embeddings retrieval

**G4:** free wallet gets exactly 2 answers then a paywall; buying Pro on testnet raises the limit to 5; agent output contains no PII.

### S5 · Agreement, Reputation, Dispute — 01:15–02:45 (1.5 h)

- [ ] S5-W14 agreement template + client-side AES-GCM encryption → storage → hash on chain at `assignAndFund`
- [ ] S5-W15 SBT gallery on profile + reputation score bar
- [ ] S5-W16 dispute modal (freelancer) + arbiter panel (admin wallet) + Sarvam neutral summary (advisory label)
- [ ] S5-A4 (chain-auditor) final pass on Escrow

**G5:** disputed milestone resolved by arbiter with a correct split on testnet.

### S6 · Polish and QA — 02:45–04:30 (1.75 h)

- [ ] S6-Q1 (design-qa) full pass: contrast, focus rings, 375px mobile, empty/loading/error states, consistent tx links
- [ ] S6-Q2 (e2e-qa) run the golden path from a clean browser profile **twice**; file bugs
- [ ] S6-W17 fix bugs; no new features after 03:30

**G6:** `gate all` PASS · golden path green twice.

### S7 · Ship — 04:30–06:30 (2 h)

- [ ] S7-S1 (submission-scribe) README: what/why blockchain, MST integration, contract addresses, setup, known risks, demo wallets
- [ ] S7-S2 deploy frontend (Vercel/Netlify); set env vars there, not in git; repo public
- [ ] S7-S3 final `PROOF.md` (contract addresses, ≥1 tx hash each for create/fund/approve/mint)
- [ ] S7-S4 2-min backup demo video; if going for the Social Award: ≥30 s, faces on camera, public on Instagram, tags `@mstblockchain` `@newrro_tech`
- [ ] S7-S5 submission form (https://forms.gle/fkkVbfiwKmbL3BFp9): repo, testnet address, tx hash, demo link, video

**G7:** `gate all` PASS on the deployed configuration; every link opens in a private window.

---

## 9. Monitoring (efficiency and development at the same time)

`sprint-monitor` runs every 30 min (`/agent` or `agy -p` on a timer) and rewrites `.agents/status/STATUS.md`:

```markdown
# STATUS — <time> (T+<h:mm>)  Sprint <n>
Plan vs actual: tasks done <x>/<y> (expected by now: <z>)  →  ahead | on track | behind by <k> tasks
Gates: pass <p> / fail <f>  · first-time pass rate <%>
Running agents: <n>/3 · quota (/usage): <%>
Stalled (>45 min, no commit): <tasks>
Rework (files touched by >2 branches in 2 h): <files>
Blockers: <list with age>
Risks now: <top 3>
Recommendation: <continue | cut X | swap owner | rebalance>
```

**Efficiency signals and what to do**

| Signal | Threshold | Action |
|---|---|---|
| Behind plan | >2 tasks | orchestrator re-scopes using §10 before starting anything new |
| Gate first-pass rate | <60 % for a role | tighten that role's card (smaller tasks, stricter owned paths) |
| Same file on >2 branches | any | assign one owner; the others rebase |
| Agent run > `--print-timeout` or no commit 45 min | any | kill, split the task, respawn |
| Quota >70 % before S5 | any | move UI work to the fast model; no more than 2 parallel agents |
| Blocker open > 30 min | any | orchestrator resolves or cuts |

---

## 10. Cut list and risks

**Ship order (Must → Could).** Cut from the bottom up.

| Priority | Item |
|---|---|
| **Must** | Both-role login + onboarding · gig with milestones · escrow fund/approve/withdraw on testnet · role dashboards · Agent with 2-credit limit · deployed contracts + PROOF |
| **Should** | Pass NFT purchase + tier limits · Reputation SBT · deadline propose/accept · encrypted agreement hash |
| **Could** | Dispute + arbiter UI · AI dispute summary · embeddings RAG · Enterprise vs Pro visuals · earnings charts beyond bar/donut |

If time collapses (Concept.pdf's emergency rule still holds): hardcoded data for non-core screens, but **real** contract addresses, **real** tx hashes, and one real Sarvam response. Fake or misleading on-chain data is a disqualification risk (D8/§1.1), so anything mocked must be labeled in the UI and README.

| Risk | Mitigation |
|---|---|
| BridgeKey API differs from EIP-1193 | S0-T4 spike; MetaMask fallback in `useWallet` |
| Faucet rate-limits | claim in S0 for all three wallets; keep ≥1 tMSTC on deployer |
| RPC slow/flaky | retry with backoff; cache reads; show explorer links |
| Sarvam rate limit/latency | stream; cache identical queries 60 s; pre-recorded response behind an explicit "demo mode" flag, off by default |
| Scope: 3 contracts + Firebase + agent + dashboards in ~15 h | golden path first; cut list above |
| Subagent merge conflicts | owned paths; orchestrator-only merges; small tasks |
| Public-chain privacy | hashes + encrypted off-chain docs only (A3) |
| Arbiter centralization | disclose in README as hackathon-stage; DAO on roadmap |

---

## 11. Submission checklist (maps to the five mandatory requirements)

| # | Requirement | Evidence |
|---|---|---|
| 1 | Meaningful MST usage | escrow, agreement hashes, SBT reputation, Pass tier all on chain; one paragraph in README on why a database can't do it |
| 2 | MST Testnet deployment | 3 contract addresses on `testnet.mstscan.com`, ≥1 verified tx hash per key action, demo link |
| 3 | Public GitHub | full source, README with MST integration + addresses + setup, no secrets, commit history from kickoff |
| 4 | BridgeKey (strongly recommended) | login, network switch and tx signing through BridgeKey; screenshot in README |
| 5 | Working product + on-chain proof | deployed app, two demo wallets pre-funded, `docs/PROOF.md` |

Pitch line from the docs: *"Don't just build on blockchain — build something that becomes better because of blockchain."* Your answer to "why blockchain?": payment release, agreement evidence and portable reputation are enforced by code, not by a company's promise. AI advises, humans decide; the agent never moves money.

---

## 12. Assumptions register (defaults used until you decide)

| ID | Question | Default in this harness |
|---|---|---|
| A1 | Payment asset | Native tMSTC/MSTC only |
| A2 | Who arbitrates? Review window? | `ARBITER_ROLE` = deployer/team wallet for the demo; 72 h review window; silence → auto-release to freelancer |
| A3 | Private documents | Hash + CID on chain; AES-GCM encrypted off chain; readable by both parties + arbiter |
| A4 | Pass transferability / duration | Soulbound, 30 days, mock testnet prices (Pro 5, Enterprise 15 tMSTC) |
| A5 | Credit rules | 1 credit = 1 agent query; per wallet; reset midnight IST; no rollover |
| A6 | RAG | v1 tool-calling over Firestore; embeddings only if time, provider TBD |
| A7 | One wallet, two roles? | Yes, separate profiles, role chosen at login |
| A8 | Email/phone verification | None for the hackathon; marked "unverified" |
| A9 | Platform fee | 0 % on gigs; Pass is the revenue model |
| A10 | Deadline negotiation | On chain, propose + accept per milestone |
| A11 | Team size | 4 humans + agents; if fewer, cut "Could" items first |
| A12 | Source of truth | Chain for value/agreements/reputation/tier; Firestore mirrors |
