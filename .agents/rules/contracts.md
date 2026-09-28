# Smart Contracts Rules & Specifications (Harness.md §4.1, S1-C4)

## Architecture
- Target Chain: MST Testnet (Chain ID `91562037`, RPC `https://testnetrpc.mstblockchain.com`)
- Solidity version: `^0.8.20`
- Dependencies: OpenZeppelin v5 (`@openzeppelin/contracts`)
- Contract Patterns: `AccessControl`, `Pausable`, `ReentrancyGuard`, custom errors, checks-effects-interactions, pull payments for withdrawals (`withdraw()`), events on every state transition.

## Invariant
`address(this).balance == Σ locked milestone funds + Σ withdrawable balance`

## Required Contracts
1. `ZentrixEscrow`:
   - Enums: `GigStatus { Open, Assigned, Active, Completed, Cancelled }`
   - Enums: `MStatus { Pending, Submitted, Approved, Rejected, Disputed, Resolved, AutoReleased }`
   - Struct: `Milestone { uint96 amount; uint64 deadline; bytes32 criteriaHash; MStatus status; uint64 submittedAt; string evidenceCID; string reasonCID; }`
   - Functions:
     - `createGig(string metadataCID, Milestone[] plan, uint64 reviewWindow) returns (uint256 gigId)`
     - `assignAndFund(uint256 gigId, address freelancer, bytes32 agreementHash, string agreementCID) payable` (checks `msg.value == sum(plan)`)
     - `acceptAssignment(uint256 gigId)` (freelancer sets Active)
     - `cancelUnaccepted(uint256 gigId)` (refunds client's withdrawable balance if not accepted within 48h)
     - `submitMilestone(uint256 gigId, uint256 i, string evidenceCID)`
     - `approveMilestone(uint256 gigId, uint256 i, uint8 rating)` (triggers reputation SBT mint on final milestone)
     - `rejectMilestone(uint256 gigId, uint256 i, string reasonCID)` (mandatory reason)
     - `autoRelease(uint256 gigId, uint256 i)` (after reviewWindow expiry with no client response)
     - `raiseDispute(uint256 gigId, uint256 i)` (freelancer, after rejection)
     - `resolveDispute(uint256 gigId, uint256 i, uint16 freelancerBps, string rulingCID)` (ARBITER_ROLE only, `bps <= 10000`)
     - `proposeDeadline(uint256 gigId, uint256 i, uint64 newDeadline)`
     - `acceptDeadline(uint256 gigId, uint256 i)`
     - `withdraw()` (pull payments, nonReentrant)
   - Events:
     - `GigCreated`, `Funded`, `AgreementSigned`, `MilestoneSubmitted`, `MilestoneApproved`, `MilestoneRejected`, `MilestoneDisputed`, `MilestoneResolved`, `DeadlineProposed`, `DeadlineAccepted`, `Withdrawn`

2. `ZentrixReputation`:
   - ERC721 Soulbound credential NFT.
   - Override `_update`: revert on transfers between non-zero addresses.
   - Access control: `MINTER_ROLE` granted to `ZentrixEscrow`.
   - `mintReputation(address to, ReputationData d)`
   - `getReputationScore(address) view returns (uint256)`

3. `ZentrixPass`:
   - ERC721 Soulbound subscription NFT.
   - One active pass per wallet, 30 days validity.
   - `buy(uint8 tier) payable`
   - `tierOf(address) view returns (uint8)`
   - `setPrice(uint8 tier, uint256 priceWei)` (Admin)

## Test Coverage Checklist (S1-C4)
- Happy path: create -> assign & fund -> accept -> submit -> approve -> withdraw.
- Reject -> dispute -> arbiter split sums exactly to milestone amount.
- `autoRelease` reverts before reviewWindow expires, passes after.
- `sum(plan) == msg.value` invariant on funding.
- Role-gated `resolveDispute` reverts for non-arbiter.
- Pause blocks state-mutating functions.
- Deadline change requires mutual consent.
- Cancel refund moves funds to withdrawable balance.
- Reentrancy attack on `withdraw()` reverts.
- Final milestone approval mints exactly one Reputation SBT.
- Transfer of Soulbound SBT or Pass reverts.
- Pass expiry returns tier 0 after 30 days.
