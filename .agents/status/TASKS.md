# Zentrix Task Board

## S0 · Preflight and scaffold
- [x] S0-T1 (human) §2 wallets, network, faucet for 3 addresses; `gate env` passes
- [x] S0-T2 (human) `agy` installed + signed in; Sarvam API key; Firebase project; fill `.env.local`
- [x] S0-T3 (orchestrator) scaffold (§5.3), delete `deploy:mainnet`, git configuration
- [x] S0-T4 (docs-auditor) `docs/MST_FACTS.md`: SDK API surface, Vibe Kit details, MCP, BridgeKey spike results
- [x] S0-T5 (orchestrator) materialize harness files; `gate secrets` + `gate env`

## S1 · Contracts ‖ Auth+Onboarding ‖ Shell
- [x] S1-C1 (chain-dev, 30m) `ZentrixReputation` (from `certificate` reference; `_update` override; `MINTER_ROLE`)
- [x] S1-C2 (chain-dev, 60m) `ZentrixEscrow` per §4.1
- [x] S1-C3 (chain-dev, 25m) `ZentrixPass` (tier, expiry, soulbound, admin prices)
- [x] S1-C4 (chain-dev, 45m) tests: happy path; dispute split; autoRelease; funding invariant; pause; deadline; reentrancy; reputation mint; soulbound transfer reverts
- [x] S1-C5 (chain-dev, 20m) `deploy:testnet`, grant `MINTER_ROLE` to Escrow, ABIs to `shared`, first real tx hash into `docs/PROOF.md`
- [x] S1-A1 (chain-auditor, 40m) Slither/solhint/invariant fuzz; findings to `docs/AUDIT.md`; chain-dev fixes High/Medium
- [x] S1-P1 (platform-dev, 40m) Firebase Auth + onboarding + wallet binding nonce/verify endpoints; `wallets/{address}` uniqueness
- [x] S1-P2 (platform-dev, 45m) `firestore.rules` (public/private split) + zod schemas in `shared`
- [x] S1-W1 (web-dev, 30m) `tokens.css`, Tailwind mapping, layout, buttons/inputs/cards
- [x] S1-W2 (web-dev, 40m) landing + navbar format + `/login` + BridgeKey wallet hook
- [x] S1-W3 (web-dev, 45m) onboarding forms (§3.2), role selection, field errors

## S2 · Gig lifecycle
- [x] S2-W4 (web-dev) create-gig form with milestone builder (amounts, dates; total in tMSTC; tx state UI)
- [x] S2-P3 (platform-dev) `/api/gigs/sync` chain→Firestore mirror; called after each tx
- [x] S2-W5 (web-dev) Marketplace gig board (search, tag/budget filters) + gig detail
- [x] S2-W6 (web-dev) apply modal (proposal text → `applications`); client sees applicants
- [x] S2-W7 (web-dev) client "assign & fund" (tx) · freelancer "accept" (tx)
- [x] S2-A2 (chain-auditor) review against deployed contract; verify funding math

## S3 · Milestones + Dashboard
- [x] S3-W8 (web-dev) dashboard shell (rail, project switcher, role toggle) with empty states
- [x] S3-W9 (web-dev) role widgets: locked/released/pending funds; status donut; deadlines
- [x] S3-W10 (web-dev) milestone timeline + submit / approve / reject(reason) actions
- [ ] S3-P4 (platform-dev) evidence upload → CID (Firebase Storage)
- [x] S3-W11 (web-dev) deadline propose/accept UI
- [x] S3-A3 (design-qa) first pass on §3.7 (contrast, focus, mobile)

## S4 · Agent + Credits + Pass
- [x] S4-AG1 (agent-dev) `/api/agent` Sarvam call with tools, streaming
- [x] S4-AG2 (agent-dev) `search_gigs` / `search_freelancers` (role-gated, PII-stripped) + tests
- [x] S4-AG3 (platform-dev) credit metering (Firestore transaction, IST reset, 429 payload)
- [x] S4-W12 (web-dev) AI Mode search bar + result cards + "credits left" chip + paywall dialog
- [x] S4-W13 (web-dev) Pass purchase UI (`buy`) + `tierOf` badge
- [ ] S4-AG4 (optional) embeddings retrieval

## S5 · Agreement, Reputation, Dispute
- [ ] S5-W14 (web-dev) agreement template + client-side encryption → storage → hash on chain at `assignAndFund`
- [x] S5-W15 (web-dev) SBT gallery on profile + reputation score bar
- [ ] S5-W16 (web-dev) dispute modal (freelancer) + arbiter panel (admin wallet) + Sarvam neutral summary
- [x] S5-A4 (chain-auditor) final pass on Escrow

## S6 · Polish and QA
- [x] S6-Q1 (design-qa) full pass: contrast, focus rings, mobile responsiveness, empty/loading/error states
- [x] S6-Q2 (e2e-qa) run the golden path on testnet twice; file bugs
- [x] S6-W17 (web-dev) bug fixes

## S7 · Ship
- [x] S7-S1 (submission-scribe) README: MST integration, contract addresses, setup, known risks
- [ ] S7-S2 (submission-scribe) deploy frontend; set env vars; verify live link
- [x] S7-S3 (submission-scribe) final `PROOF.md` (contract addresses, verified tx hashes)
- [ ] S7-S4 (submission-scribe) demo pitch script & video backup
- [ ] S7-S5 (submission-scribe) submission form filed
