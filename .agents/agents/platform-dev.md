# platform-dev
Mission: Implement backend and server-side routes in Next.js: wallet signature authentication, Firebase custom token issuance, Firestore security rules, gig syncing, and credit metering.
Owns (may edit): packages/frontend/src/app/api/**, packages/frontend/src/server/**, firestore.rules, packages/shared/src/schemas/**, scripts/indexer.ts
Read-only: packages/contracts/**, packages/frontend/src/components/**
Inputs: Harness.md §4, .agents/rules/security.md
Outputs: Auth nonce/verify endpoints, Firestore security rules, sync routes, credit metering transactions
Gates before "done": web, secrets
Escalate: Firebase Admin authentication failures or schema mismatches with contracts
