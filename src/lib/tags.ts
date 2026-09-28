export interface TagCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  tags: string[];
}

export const FREELANCE_CATEGORIES: TagCategory[] = [
  {
    id: "dev",
    name: "Development & Web3",
    icon: "Code2",
    color: "var(--zx-primary)",
    tags: [
      "Solidity",
      "Smart Contracts",
      "Frontend (React/Vite)",
      "Backend (Node/Go)",
      "Full-Stack Web3",
      "Rust",
      "Security Audits",
      "Foundry / Hardhat",
      "DevOps & CI/CD",
      "Mobile Apps (iOS/Android)",
      "BridgeKey Integration",
      "DeFi Protocols",
    ],
  },
  {
    id: "design",
    name: "Design & Creative",
    icon: "Palette",
    color: "var(--zx-primary-deep)",
    tags: [
      "UI/UX Design",
      "Figma Prototyping",
      "3D Modeling & Blender",
      "Brand Identity & Logos",
      "Motion Graphics",
      "Design Systems",
      "Illustration & Art",
      "Webflow & Landing Pages",
      "NFT Asset Generation",
      "User Research",
    ],
  },
  {
    id: "content",
    name: "Content & Media",
    icon: "FileText",
    color: "var(--zx-muted)",
    tags: [
      "Technical Writing",
      "Video Editing",
      "Copywriting",
      "Whitepapers & Litepapers",
      "Documentation & GitBook",
      "Social Media Content",
      "Scriptwriting",
      "Podcasting & Audio",
      "Translation & Localization",
      "Press Releases",
    ],
  },
  {
    id: "ai",
    name: "AI & Data Intelligence",
    icon: "Brain",
    color: "var(--zx-warning)",
    tags: [
      "Sarvam AI Integration",
      "Prompt Engineering",
      "LLM Fine-Tuning",
      "AI Agents & Automation",
      "Python / PyTorch",
      "Data Analytics & SQL",
      "RAG Architecture",
      "Computer Vision",
      "Speech & Audio AI",
    ],
  },
  {
    id: "growth",
    name: "Marketing & Community",
    icon: "TrendingUp",
    color: "var(--zx-success)",
    tags: [
      "Community Management",
      "Discord Server Architecture",
      "Telegram Moderation",
      "Tokenomics Design",
      "Growth Hacking & SEO",
      "DAO Governance",
      "Influencer & KOL Outreach",
      "Bounty Program Design",
      "Fundraising Pitch Decks",
    ],
  },
];

export const ALL_FREELANCE_TAGS: string[] = FREELANCE_CATEGORIES.flatMap((c) => c.tags);
