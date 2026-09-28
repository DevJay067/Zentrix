import type { VercelRequest, VercelResponse } from "@vercel/node";
import { CORS_HEADERS } from "./_lib/shared";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).set(CORS_HEADERS).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  return res.status(200).json({ status: "ok", chainId: 91562037 });
}
