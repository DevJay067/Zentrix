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
