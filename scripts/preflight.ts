import { JsonRpcProvider, formatEther, parseEther } from "ethers";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const RPC = process.env.MST_TESTNET_RPC ?? "https://testnetrpc.mstblockchain.com";
const EXPECTED = 91562037n;
const MIN = parseEther(process.env.MIN_BALANCE ?? "0.01");
const addrs = (process.env.WALLET_ADDRESSES ?? "").split(",").map(s => s.trim()).filter(Boolean);

(async () => {
  let ok = true;
  const p = new JsonRpcProvider(RPC);
  const net = await p.getNetwork();
  if (net.chainId !== EXPECTED) {
    console.error(`✗ chainId ${net.chainId} != ${EXPECTED}`);
    ok = false;
  }
  const b1 = await p.getBlockNumber();
  await new Promise(r => setTimeout(r, 6000));
  const b2 = await p.getBlockNumber();
  console.log(`block ${b1} → ${b2}`);
  if (b2 <= b1) {
    console.error("✗ blocks not advancing (or block time > 6s; rerun)");
    ok = false;
  }
  if (addrs.length === 0) {
    console.warn("! WALLET_ADDRESSES not provided, checking RPC connectivity only");
  } else {
    for (const a of addrs) {
      try {
        const bal = await p.getBalance(a);
        const good = bal >= MIN;
        console.log(`${good ? "✓" : "✗"} ${a} ${formatEther(bal)} tMSTC`);
        if (!good) ok = false;
      } catch (e: any) {
        console.error(`✗ error fetching balance for ${a}:`, e.message);
        ok = false;
      }
    }
  }
  process.exit(ok ? 0 : 1);
})().catch(e => {
  console.error("✗ RPC error:", e.message);
  process.exit(1);
});
