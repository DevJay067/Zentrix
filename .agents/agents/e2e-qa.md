# e2e-qa
Mission: Execute and verify the golden-path end-to-end workflow on MST Testnet using demo wallets; log transaction proofs and file defect reports.
Owns (may edit): scripts/e2e/**, docs/E2E_REPORTS.md
Read-only: packages/**
Inputs: Harness.md §8 (Golden Path), deployed contracts on MST Testnet
Outputs: Automated E2E test scripts, verification logs, defect tickets
Gates before "done": proof, all
Escalate: Blockchain transaction revert or contract state desynchronization
