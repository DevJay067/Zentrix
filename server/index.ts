import crypto from "crypto";
import { verifyMessage } from "ethers";

// IST Date helper (UTC+5:30)
function getISTDateString(): string {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 5.5 * 3600000);
  return istDate.toISOString().slice(0, 10);
}

// Tier query allowances
const TIER_LIMITS: Record<number, number> = {
  0: 2,  // Free
  1: 5,  // Pro Pass
  2: 15, // Enterprise Pass
};

// In-memory usage store: key = `${walletAddress}_${istDate}` -> count
const usageStore = new Map<string, number>();

// Sarvam AI Tools Definition
const AGENT_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_gigs",
      description: "Search open freelance gigs and project milestones available on Zentrix marketplace.",
      parameters: {
        type: "object",
        properties: {
          tag: { type: "string", description: "Filter by industry tag or category, e.g. web3, frontend, smart-contracts" },
          minBudget: { type: "number", description: "Minimum budget in tMSTC" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_freelancers",
      description: "Search verified freelance talent profiles on Zentrix.",
      parameters: {
        type: "object",
        properties: {
          skill: { type: "string", description: "Technology or expertise, e.g. Solidity, React, Rust, UI/UX" },
        },
      },
    },
  },
];

const PORT = Number(process.env.PORT || 3001);

const server = Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);

    // Standard CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Health check
    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok", chainId: 91562037 }, { headers: corsHeaders });
    }

    // 2. GET /api/auth/nonce
    if (url.pathname === "/api/auth/nonce" && req.method === "GET") {
      const address = url.searchParams.get("address")?.toLowerCase();
      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return Response.json({ error: "Valid wallet address required" }, { status: 400, headers: corsHeaders });
      }

      const nonce = `Sign this message to bind your BridgeKey wallet to your Zentrix account.\n\nWallet: ${address}\nNonce: ${crypto.randomBytes(16).toString("hex")}\nTimestamp: ${Date.now()}`;
      return Response.json({ nonce, address }, { headers: corsHeaders });
    }

    // 3. POST /api/auth/verify
    if (url.pathname === "/api/auth/verify" && req.method === "POST") {
      try {
        const { address, signature, message } = await req.json();
        if (!address || !signature || !message) {
          return Response.json({ error: "Address, signature, and message are required" }, { status: 400, headers: corsHeaders });
        }

        const recoveredAddress = verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          return Response.json({ error: "Cryptographic signature verification failed" }, { status: 401, headers: corsHeaders });
        }

        return Response.json({
          success: true,
          verifiedAddress: recoveredAddress.toLowerCase(),
          timestamp: Date.now(),
        }, { headers: corsHeaders });
      } catch (err: any) {
        return Response.json({ error: err?.message || "Internal server error" }, { status: 500, headers: corsHeaders });
      }
    }

    // 4. POST /api/agent (Sarvam 30B LLM Proxy)
    if (url.pathname === "/api/agent" && req.method === "POST") {
      try {
        const { prompt, walletAddress, role = "freelancer", tier = 0 } = await req.json();

        if (!prompt) {
          return Response.json({ error: "Prompt is required" }, { status: 400, headers: corsHeaders });
        }

        const apiKey = process.env.SARVAM_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "SARVAM_API_KEY is not configured on the server." }, { status: 500, headers: corsHeaders });
        }

        // Rate & Credit Limiting
        const userWallet = (walletAddress || "anonymous").toLowerCase();
        const todayIST = getISTDateString();
        const usageKey = `${userWallet}_${todayIST}`;
        const allowedQueries = TIER_LIMITS[tier] ?? 2;
        const currentQueries = usageStore.get(usageKey) || 0;

        if (currentQueries >= allowedQueries) {
          return Response.json({
            error: "Daily query limit reached.",
            limitReached: true,
            current: currentQueries,
            allowed: allowedQueries,
            tier,
            resetAt: "Midnight IST",
            upgradeAvailable: tier < 2,
          }, { status: 429, headers: corsHeaders });
        }

        const systemPrompt = `You are Zentrix Assistant, an expert AI agent assisting a ${role} on the Zentrix marketplace built on MST Blockchain.
- Native token: tMSTC (MST Testnet, Chain ID 91562037).
- If the user asks for available jobs or gigs, use the 'search_gigs' tool.
- If the user is a client looking for talent, use the 'search_freelancers' tool.
- Always provide clear, actionable summaries and explain why each recommendation matches their criteria.
- Never output personal contact information (no raw emails or phone numbers). Everything is negotiated through Zentrix escrow.`;

        // Sarvam Chat API Request
        const sarvamPayload = {
          model: "sarvam-30b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          tools: AGENT_TOOLS,
          tool_choice: "auto",
          temperature: 0.3,
        };

        const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": apiKey,
          },
          body: JSON.stringify(sarvamPayload),
        });

        if (!sarvamRes.ok) {
          const errText = await sarvamRes.text();
          console.error("Sarvam API error response:", errText);
          return Response.json({ error: `Sarvam API error: ${sarvamRes.statusText}` }, { status: 502, headers: corsHeaders });
        }

        const sarvamData: any = await sarvamRes.json();
        const choice = sarvamData.choices?.[0];
        const message = choice?.message;
        let finalAnswer = message?.content || "";

        // Handle Tool Calls
        if (message?.tool_calls && message.tool_calls.length > 0) {
          const toolCall = message.tool_calls[0];
          const fnName = toolCall.function?.name;
          let toolResult: any[] = [];

          if (fnName === "search_gigs") {
            toolResult = [
              {
                gigId: "1",
                title: "Implement BridgeKey Multi-Sig Wallet Integration",
                totalBudget: "3.5 tMSTC",
                tags: ["Web3", "Frontend"],
                technologies: ["React", "BridgeKey", "TypeScript"],
              },
              {
                gigId: "2",
                title: "Solidity Escrow Contract Invariant Fuzzing",
                totalBudget: "2.0 tMSTC",
                tags: ["Smart Contracts", "Security"],
                technologies: ["Solidity", "Hardhat", "Foundry"],
              },
            ];
          } else if (fnName === "search_freelancers") {
            toolResult = [
              {
                name: "Alex Dev",
                designation: "Senior Smart Contract Engineer",
                expertise: ["Solidity", "OpenZeppelin v5", "Hardhat"],
                industryTags: ["DeFi", "Smart Contracts"],
                walletAddress: "0x8cA0f3176997F32CCBb4598Fc8C966C95aeEEc9e",
              },
              {
                name: "Priya Sharma",
                designation: "Lead Frontend Web3 Architect",
                expertise: ["React", "BridgeKey", "TypeScript", "Tailwind"],
                industryTags: ["Frontend", "Web3"],
                walletAddress: "0x7FC1d02922d4865fd53De59697407a42e64d1Cad",
              },
            ];
          }

          // Follow-up completion turn
          const followUpRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-subscription-key": apiKey,
            },
            body: JSON.stringify({
              model: "sarvam-30b",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
                message,
                {
                  role: "tool",
                  tool_call_id: toolCall.id,
                  name: fnName,
                  content: JSON.stringify(toolResult),
                },
              ],
              temperature: 0.3,
            }),
          });

          if (followUpRes.ok) {
            const followUpData: any = await followUpRes.json();
            finalAnswer = followUpData.choices?.[0]?.message?.content || finalAnswer;
          }
        }

        // Increment usage
        usageStore.set(usageKey, currentQueries + 1);

        return Response.json({
          answer: finalAnswer,
          creditsLeft: Math.max(0, allowedQueries - (currentQueries + 1)),
          totalLimit: allowedQueries,
          tier,
        }, { headers: corsHeaders });
      } catch (err: any) {
        return Response.json({ error: err?.message || "Internal server error" }, { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

console.log(`Zentrix Backend Server running on http://localhost:${server.port}`);
