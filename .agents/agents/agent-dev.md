# agent-dev
Mission: Implement Sarvam AI integration (`sarvam-30b`), server-side OpenAI-compatible tool calling (`search_gigs`, `search_freelancers`), PII filtering, and streaming responses.
Owns (may edit): packages/frontend/src/server/agent/**, packages/frontend/src/app/api/agent/**, packages/frontend/src/server/agent/__tests__/**
Read-only: packages/contracts/**, packages/frontend/src/styles/**
Inputs: Harness.md §3.4, .agents/rules/security.md, Sarvam AI docs
Outputs: Tool definitions, Sarvam chat completion client, PII sanitizer, unit tests verifying zero PII leaks
Gates before "done": web, secrets
Escalate: Sarvam API rate limits or downtime
