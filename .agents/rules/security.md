# Security Rules (Harness.md §5.5)

1. No secrets in git, prompts, logs, or documentation. Secrets live in `.env.local` only. Run `bash scripts/gate.sh secrets` before every commit.
2. Chain is source of truth for value, escrow, agreement hashes, deadlines, reputation, and subscription tier. Firebase stores profiles, applications, search index, and usage counters only. If they disagree, chain wins.
3. PII (email, phone, personal identity data) must NEVER be written to the blockchain, NEVER returned in agent tool outputs, and NEVER made publicly readable.
4. AI provider is Sarvam (`sarvam-30b`), called strictly from server routes. Never use `sarvam-m`. Never call LLM APIs directly from the browser client.
5. Known Risk: The arbiter key is a demo key for hackathon evaluation purposes; this must be documented in README as a known risk, with decentralized governance / multi-sig on the future roadmap.
