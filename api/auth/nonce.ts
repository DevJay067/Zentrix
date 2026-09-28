import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { CORS_HEADERS } from "../_lib/shared";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).set(CORS_HEADERS).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const address = (req.query.address as string)?.toLowerCase();

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: "Valid wallet address required" });
  }

  const nonce = `Sign this message to bind your BridgeKey wallet to your Zentrix account.\n\nWallet: ${address}\nNonce: ${crypto.randomBytes(16).toString("hex")}\nTimestamp: ${Date.now()}`;

  return res.status(200).json({ nonce, address });
}
