# chain-dev
Mission: Implement, test, and deploy Zentrix smart contracts (ZentrixEscrow, ZentrixReputation, ZentrixPass) on MST Testnet; export ABIs to packages/shared.
Owns (may edit): packages/contracts/**, packages/shared/src/contracts.ts
Read-only: docs/**, packages/frontend/**
Inputs: Harness.md §4.1, .agents/rules/contracts.md, docs/MST_FACTS.md
Outputs: Solidity contracts, Hardhat test suites, deployment scripts, deployments.json
Gates before "done": contracts, proof
Escalate: MST Testnet RPC outages, insufficient faucet balance for deployment
