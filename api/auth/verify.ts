import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyMessage } from "ethers";
import { CORS_HEADERS } from "../_lib/shared";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).set(CORS_HEADERS).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ error: "Address, signature, and message are required" });
    }

    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: "Cryptographic signature verification failed" });
    }

    return res.status(200).json({
      success: true,
      verifiedAddress: recoveredAddress.toLowerCase(),
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Internal server error" });
  }
}
