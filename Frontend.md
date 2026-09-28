# Zentrix - High-Fidelity Stitch UI Prompt

## MASTER PROMPT

Design and generate a complete, high-fidelity responsive web application named **Zentrix**.

Zentrix is a formal decentralized freelance marketplace where businesses hire freelancers, project work is broken into milestones, milestone payments are held and released through MST Blockchain smart-contract escrow, reputation is portable, and a Sarvam AI agent helps users discover the right projects or freelancers.

This is NOT a crypto trading product and must NOT visually resemble a generic Web3 dashboard.

The product must feel like a serious enterprise SaaS platform with financial-grade trust, strong information hierarchy, subtle tactile skeuomorphism, restrained glassmorphism, and a premium modern marketplace experience.

The UI must look credible enough to be a real startup product, not a hackathon prototype.

---

## 1. BRAND / VISUAL IDENTITY

Brand:
**Zentrix**

Core colors:
- Primary red: `#D84040`
- Deep red: `#A31D1D`
- Warm cream: `#ECDCBF`

Supporting palette:
- Warm white surfaces
- Ivory backgrounds
- Charcoal / near-black typography
- muted warm grays
- extremely restrained green for confirmed states
- amber only for warnings
- muted red only for critical/destructive states

Use the three brand colors consistently.

Visual mood:
- formal
- minimal
- precise
- trustworthy
- sophisticated
- calm
- intelligent
- enterprise-grade
- subtly tactile
- financial infrastructure aesthetic
- premium marketplace
- Indian technology brand without using stereotypical visual motifs

Do NOT use:
- neon crypto gradients
- purple Web3 gradients
- glowing blockchain networks
- cartoon illustrations
- excessive 3D icons
- generic startup blobs
- huge colorful cards
- noisy backgrounds
- meme-like Web3 visuals
- futuristic cyberpunk styling
- excessive red everywhere
- excessive glass blur that damages readability

---

## 2. DESIGN LANGUAGE

Combine three styles carefully:

### Minimalism
Use:
- generous whitespace
- clear typography
- disciplined grid
- strong hierarchy
- small number of visible controls
- progressive disclosure
- restrained iconography

### Subtle skeuomorphism
Use it only for:
- wallet status controls
- segmented controls
- toggles
- milestone progress tracks
- buttons
- search controls
- confirmation states
- small tactile cards

Skeuomorphic effect should feel like premium hardware/software controls:
- slight raised surfaces
- soft directional shadows
- inset tracks
- small highlights
- subtle depth
- realistic press states

Never make the whole interface look vintage.

### Controlled glassmorphism
Use glass effects selectively:
- top navigation
- floating AI assistant panel
- command search overlay
- wallet status popover
- modal dialogs
- sticky filters
- contextual side panels

Glass:
- translucent warm-white
- 10-18px backdrop blur
- very thin warm border
- soft shadow
- high legibility

Most content cards should remain solid, not glass.

---

## 3. TYPOGRAPHY

Use a premium modern sans-serif comparable to Inter, Geist, or Suisse.

Typography hierarchy:
- large editorial page titles
- compact technical labels
- readable body text
- strong numeric styling for money and progress
- small uppercase metadata labels

Avoid overly rounded playful fonts.

Use tabular numerals for:
- escrow values
- milestones
- dates
- balances
- AI credits

---

## 4. GLOBAL LAYOUT

Desktop:
- optimize for 1440px wide screens
- max content width around 1320px
- persistent left navigation on authenticated screens
- compact top bar
- dense but breathable information layout

Authenticated shell:
- left sidebar around 248px
- top utility header
- main content with 32px desktop gutters
- responsive collapse for tablet
- mobile bottom navigation or compact drawer

Sidebar:
Zentrix logo
Overview
Marketplace
Projects
Milestones
Payments
AI Discovery
Reputation
Messages
Documents
Settings

Bottom of sidebar:
AI Credits
Wallet status
Profile
role badge: Client / Freelancer

---

## 5. LANDING PAGE

Create a premium landing page.

Header:
- Zentrix logo
- Marketplace
- How it works
- For Clients
- For Freelancers
- Pricing
- Sign In
- Get Started

Hero:
Large headline:
**Work with confidence. Get paid by milestone.**

Supporting copy:
A decentralized freelance marketplace with smart-contract escrow, portable reputation, and AI-assisted discovery.

Hero actions:
- Explore Projects
- Hire Talent

Right side:
A polished layered product preview showing:
- active project
- milestone tracker
- escrow locked amount
- verified freelancer
- small AI match badge

Hero background:
soft warm ivory with extremely subtle texture, not a gradient-heavy background.

Below hero:
three trust pillars:
- Milestone Escrow
- Portable Reputation
- AI Discovery

Then:
- client workflow
- freelancer workflow
- marketplace preview
- reputation visualization
- pricing
- final CTA

---

## 6. ROLE SELECTION / AUTHENTICATION

Screen title:
**How will you use Zentrix?**

Two large premium role cards:

### Client
Hire verified talent and manage projects with milestone-based escrow.

CTA:
Continue as Client

### Freelancer
Discover projects, build portable reputation, and get paid by milestone.

CTA:
Continue as Freelancer

Do not make cards childish.

Authentication:
- Email
- Password / supported SSO
- BridgeKey wallet connection as a separate trust step

Show:
"Wallet connection is used for blockchain identity and settlement. Your application profile remains editable."

---

## 7. STRICT ONBOARDING

Create a multi-step onboarding wizard.

Top progress:
01 Identity
02 Professional Details
03 Industry & Skills
04 Wallet
05 Review

### Client onboarding fields
- Full name
- Email
- Organization
- Phone
- Designation
- Industry
- Industry tags
- Company size
- Organization description
- Hiring preferences
- BridgeKey wallet mapping

### Freelancer onboarding fields
- Full name
- Email
- Designation
- Phone
- Industry tags
- Technologies
- Areas of expertise
- Years / experience level
- Previous projects
- Portfolio links
- Availability
- Expected rate
- BridgeKey wallet mapping

Use:
- step summaries
- autosave indicator
- validation
- completion percentage
- clear privacy copy

Final step:
"Review your Zentrix profile"

Primary CTA:
Complete Setup

---

## 8. CLIENT DASHBOARD

Visual reference:
Think Firebase Console meets Linear meets a premium fintech workspace.

Do not clone Firebase literally.

Dashboard top:
Good morning, [Name]
Organization: [Company]

Primary cards:
- Active Projects
- Escrow Locked
- Released
- Upcoming Milestones

Main content:
### Active Projects
Table/card hybrid:
Project name
Freelancer
Progress
Next milestone
Due date
Escrow state
Status

Example:
Fintech Analytics Dashboard
Aarav Mehta
67%
UI Integration
18 Oct
₹48,000 locked
On Track

Right rail:
Upcoming actions
- Approve milestone
- Review proposal
- Release payment

Charts:
- project progress
- monthly payments
- milestone completion

Do not over-chart. Use 1-2 useful charts only.

Empty state:
If no projects:
Large quiet empty state
"No projects yet."
"Create a project and define the milestones that will drive delivery and payment."

CTA:
Create Project

Secondary:
Find Freelancers

---

## 9. FREELANCER DASHBOARD

Header:
Good morning, [Name]
Freelancer

Cards:
- Active Projects
- Pending Release
- Total Earned
- AI Credits Remaining

Main panel:
### My Projects

Columns:
Project
Client
Current Milestone
Progress
Next Deadline
Payment
Status

Right side:
### Next Deliverables
- Submit milestone
- Review client feedback
- Update availability

Bottom:
### Reputation
Portable reputation score
Completed projects
On-chain credentials
Skill signals

Empty state:
"No active projects yet."
"Use Zentrix AI Discovery to find work that matches your expertise."

CTA:
Find Projects

---

## 10. MARKETPLACE / GIG DISCOVERY

Screen:
**Projects**

Top search control:
`Search projects, technologies, industries, budgets...`

Filters:
- Industry
- Technology
- Budget
- Project type
- Timeline
- Availability
- Milestones
- Remote / location

Project card:
Title
Short description
Industry tags
Technology tags
Budget
Milestones
Deadline
Client organization
Verification badge
Posted time
Match percentage when AI is active

Primary action:
View Project

Secondary:
Save

Use compact cards with high information density.

Example match:
**94% match**
React
TypeScript
Firebase
Fintech

Below:
"Strong match based on your verified skills, relevant project history, and availability."

Do not expose chain-of-thought.

---

## 11. AI DISCOVERY MODE

This is one of the hero experiences.

Create a visually distinctive but restrained AI workspace inspired by modern AI search modes.

Persistent floating search bar:
**Ask Zentrix**

Placeholder examples:
- "Find React projects under ₹2L starting next month"
- "Find fintech freelancers with Firebase and TypeScript experience"
- "Show projects with 3 milestones and flexible deadlines"

When activated:
open a centered command/search surface with:
- large prompt
- recent searches
- usage counter
- role-aware suggestions

Response layout:
Left:
AI answer and concise summary

Right:
source-backed result cards

Example:
**I found 8 projects matching your constraints.**

Result card:
Project title
Budget
Milestones
Deadline
Match score
Evidence tags
View project

AI result metadata:
- Matched skills
- Industry fit
- Availability fit
- Experience evidence

Never display internal chain-of-thought.

Show only concise decision-relevant rationale.

At bottom:
"2 AI searches remaining today"

Upgrade CTA:
"Upgrade for more discovery"

---

## 12. CLIENT AI TALENT SEARCH

Same AI interaction model, reversed.

Example query:
"Find freelancers who have built fintech dashboards and know React, TypeScript, Firebase."

Results:
Freelancer photo/avatar
Name
Designation
Top technologies
Industry tags
Relevant completed projects
Availability
Reputation
AI match

Actions:
- View Profile
- Invite to Project
- Save

AI match rationale:
"Strong match: 3 verified fintech projects, React + TypeScript + Firebase, available within your target window."

---

## 13. PROJECT CREATION

Screen:
**Create a Project**

Use a clean multi-section form, not one massive card.

Sections:
1 Project Basics
2 Scope
3 Skills
4 Timeline
5 Milestones
6 Review & Publish

Fields:
Project title
Short summary
Detailed description
Industry
Technologies
Budget
Preferred start date
Target completion date
Client availability
Application deadline

Milestones:
Allow dynamic rows.

Each milestone:
- title
- deliverables
- due date
- payment amount
- acceptance conditions

Show live summary panel:
Total budget
Number of milestones
Planned duration
Escrow funding required

Before publishing:
"Project metadata will be anchored to MST for verification."

CTA:
Publish Project

Secondary:
Save Draft

---

## 14. PROJECT DETAIL

Top:
Project title
Client / Freelancer
Status
Verification state

Hero summary:
Budget
Milestones
Timeline
Escrow

Main:
Detailed description

Skills and industry

Milestone roadmap:
01 Discovery
02 Implementation
03 Delivery

Each milestone has:
- amount
- due date
- deliverables
- current state
- evidence
- payment release state

Client view:
Review proposal
Accept freelancer
Fund escrow
Approve milestone
Release payment

Freelancer view:
Submit proposal
Submit milestone
Upload evidence
View feedback

---

## 15. ESCROW / PAYMENT EXPERIENCE

Make blockchain feel understandable.

Never show unexplained wallet jargon.

Escrow panel:
**Milestone Escrow**

₹40,000 locked
₹20,000 released
₹20,000 remaining

Visual:
inset progress rail with milestone checkpoints.

Each checkpoint:
Funded
Submitted
Approved
Released

Transaction state:
- Waiting for wallet signature
- Transaction submitted
- Confirming on MST
- Confirmed

After confirmation:
show:
MST Testnet
Transaction hash
View on Explorer

Avoid making the user think money "disappears into a black box".

---

## 16. WALLET / BRIDGEKEY

Create a compact wallet identity screen.

Header:
BridgeKey Wallet

Status:
Connected

Show:
Wallet address
Network: MST Testnet
Balance
Verification

Actions:
Change Wallet
View on Explorer
Disconnect

Use a subtle hardware-like wallet status control.

Never display private keys or seed phrases.

---

## 17. FREELANCER PROFILE

Profile should feel like a professional verified portfolio.

Header:
Profile photo/avatar
Name
Designation
Availability
Wallet verification
Reputation

Sections:
About
Expertise
Technologies
Industry Experience
Previous Projects
Portfolio
Milestone History
Reputation

Reputation:
Large score
Completed projects
On-chain credentials

Reputation credential card:
Project title
Client rating
AI skill signal
Payment earned
Completion date
MST reference

Use a subtle "verified on MST" label.

Do not make NFTs the visual centerpiece. Reputation should look like professional career infrastructure.

---

## 18. CLIENT PROFILE

Organization-focused.

Header:
Organization name
Industry
Verification
Wallet

Sections:
About
Hiring focus
Active projects
Completed projects
Industries
Typical project size
Milestone practices

Keep personally sensitive information visually secondary.

---

## 19. MILESTONE WORKSPACE

Screen:
**Milestone 02 - Frontend Integration**

Top:
Project
Milestone state
Due date
Payment amount

Main left:
Deliverables checklist

Main center:
Evidence / submission area

Right:
Escrow state
Amount
Client action

Freelancer actions:
Submit milestone

Client actions:
Approve
Request revision
Raise dispute

Timeline:
Submitted
Under review
Approved
Released

Use a clear audit timeline.

---

## 20. DISPUTE / EVIDENCE WORKSPACE

Formal and calm.

Header:
**Dispute Review**

Summary:
Project
Milestone
Amount
Status

Tabs:
Claims
Evidence
AI Summary
Audit Trail

AI summary should be short and neutral.

Never present AI as the legal authority.

Evidence document UI:
- encrypted document label
- access state
- hash/CID
- uploader
- timestamp
- authorized viewers

Copy:
"Evidence is encrypted. Integrity is anchored to MST."

Actions:
Request Access
View Authorized Evidence
Add Evidence

No plaintext secret content in blockchain-facing screens.

---

## 21. REPUTATION CENTER

Page:
**Reputation**

Top summary:
Portable Reputation
Verified Work
Completed Milestones
Earned

Credential cards:
- project
- role
- rating
- skills
- date
- on-chain verification

CTA:
View on MST Explorer

Use understated credential visuals.

---

## 22. AI CREDITS / PRICING

Pricing page:
**Choose your discovery capacity**

Three plans:

### Free
2 AI searches/day

### Pro
5 AI searches/day

### Enterprise
15 AI searches/day

Use pricing values from Zentrix configuration, not hardcoded assumptions.

Visual:
Free = quiet neutral
Pro = primary brand emphasis
Enterprise = deep red emphasis

Each card:
price
daily AI searches
features
CTA

Explain:
"Payments and escrow remain available according to marketplace access rules. AI limits govern the discovery assistant."

Use a small usage meter:
`1 / 2 searches used today`

Subscription checkout should feel SaaS-like, not crypto-like.

---

## 23. NOTIFICATIONS

Use a compact notification center.

Categories:
- Project
- Milestone
- Payment
- AI
- Security

Examples:
"Milestone 2 submitted for review."
"₹35,000 escrow is waiting for approval."
"Your AI search found 6 matching projects."
"BridgeKey wallet connected to MST Testnet."

---

## 24. SETTINGS

Sections:
Account
Professional Profile
Organization
Wallet
Security
Notifications
AI & Privacy
Billing
Data Access

Include:
- connected wallet
- AI history
- data export
- privacy controls
- document permissions

---

## 25. EMPTY / LOADING / ERROR STATES

Every core view must have intentional states.

Loading:
- skeletons
- transaction progress
- AI retrieval progress

Empty:
minimal illustration or geometric mark
clear explanation
single primary action

Error:
human-readable explanation
retry action
technical transaction ID when relevant

Never show a blank screen.

---

## 26. MICROINTERACTIONS

Use:
- 150-220ms transitions
- soft elevation on hover
- tactile press state
- subtle backdrop blur
- progress animations
- number transitions only for important totals
- milestone completion check animation

Avoid:
- spinning everything
- excessive parallax
- dramatic blockchain animations
- unnecessary particle effects

---

## 27. ICONOGRAPHY

Use a Lucide-like line icon system.

Icons should be:
- small
- precise
- consistent
- 1.5-2px stroke
- no mixed icon styles

Important icons:
Briefcase
Search
Spark / AI
Wallet
Shield
Check
Clock
Milestone
File
Building
User
Chart
Settings
Lock

---

## 28. RESPONSIVE DESIGN

Desktop:
1440 x 1024 reference

Tablet:
1024 x 1366

Mobile:
390 x 844

On mobile:
- sidebar becomes drawer
- important actions become sticky bottom actions
- project cards stack
- milestone tracker becomes vertical
- tables become card lists
- AI search becomes full-screen command surface
- wallet status remains easily accessible

Do not simply shrink desktop UI.

Recompose layouts for mobile.

---

## 29. ACCESSIBILITY

Use:
- WCAG-minded contrast
- keyboard navigation
- focus rings
- accessible labels
- semantic forms
- error text tied to fields

Do not use color alone to represent payment or milestone state.

---

## 30. HIGH-FIDELITY MOCK DATA

Generate realistic Indian and global professional data.

Example clients:
- Meridian Fintech Labs
- Asteria Analytics
- Northstar Mobility
- Vistara Digital Systems

Example freelancers:
- Ananya Rao - Full Stack Engineer
- Rohan Mehta - ML Engineer
- Kavya Nair - Product Designer
- Arjun Shah - Blockchain Engineer

Use realistic project amounts in INR.

Example project:
"Fintech Transaction Intelligence Dashboard"
Budget: ₹1,80,000
Milestones: 3
Timeline: 32 days

Do not use lorem ipsum.

---

## 31. FINAL VISUAL TARGET

The final experience should feel like:

**Linear + Firebase Console + Stripe Dashboard + premium enterprise marketplace**

with:

**subtle hardware-like skeuomorphic controls + restrained glassmorphism + Zentrix red/cream identity**

The result should communicate:
trust
professionalism
financial clarity
technical credibility
AI assistance
decentralized verification

The user should understand what to do within 5 seconds of opening every main screen.

---

## 32. STITCH OUTPUT REQUIREMENTS

Generate:
1. Landing page
2. Authentication
3. Role selector
4. Client onboarding
5. Freelancer onboarding
6. Client dashboard
7. Freelancer dashboard
8. Project marketplace
9. AI Discovery mode
10. Client AI talent discovery
11. Project creation
12. Project detail
13. Proposal detail
14. Escrow / payment
15. Milestone workspace
16. Freelancer profile
17. Client organization profile
18. Reputation center
19. Dispute/evidence workspace
20. AI pricing
21. Notifications
22. Settings
23. Wallet / BridgeKey panel
24. Mobile responsive variants

Use shared components and a consistent design system across every screen.

Prioritize visual consistency over novelty.

The app must look like the same product from every route.

---

## 33. DO NOT DO THIS

Do not:
- create a generic crypto dashboard
- create a token trading page
- show NFT collectibles as the core product
- overuse glassmorphism
- overuse shadows
- use purple/blue Web3 gradients
- fill pages with oversized statistics
- make AI look like a chatbot toy
- expose internal model reasoning
- show fake blockchain confirmations
- show random wallet balances
- use placeholder copy
- create arbitrary sidebars for each page
- use different component styles across screens

Build a coherent, formal, production-grade SaaS marketplace called **Zentrix**.
