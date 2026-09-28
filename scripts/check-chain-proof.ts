import { JsonRpcProvider } from "ethers";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const p = new JsonRpcProvider(process.env.MST_TESTNET_RPC ?? "https://testnetrpc.mstblockchain.com");
const hashRe = /0x[0-9a-fA-F]{64}/g;

(async () => {
  let ok = true;
  if (!fs.existsSync("contracts/deployments.json")) {
    console.error("✗ contracts/deployments.json not found");
    process.exit(1);
  }
  const deploymentsData = JSON.parse(fs.readFileSync("contracts/deployments.json", "utf8"));
  const networkDeployments = deploymentsData.testnet || deploymentsData;

  const addrs: string[] = [];
  for (const [name, info] of Object.entries(networkDeployments as Record<string, any>)) {
    if (info && info.address) {
      addrs.push(info.address);
    }
  }

  if (!addrs.length) {
    console.error("✗ no contract addresses in deployments.json");
    ok = false;
  }
  for (const a of addrs) {
    const code = await p.getCode(a);
    const good = code !== "0x" && code.length > 2;
    console.log(`${good ? "✓" : "✗"} ${a} https://testnet.mstscan.com/address/${a}`);
    if (!good) ok = false;
  }
  const hashes = (fs.existsSync("docs/PROOF.md") ? fs.readFileSync("docs/PROOF.md", "utf8") : "").match(hashRe) ?? [];
  if (!hashes.length) {
    console.error("✗ docs/PROOF.md has no tx hash");
    ok = false;
  }
  for (const h of hashes) {
    const r = await p.getTransactionReceipt(h);
    const good = r?.status === 1;
    console.log(`${good ? "✓" : "✗"} tx ${h}`);
    if (!good) ok = false;
  }
  process.exit(ok ? 0 : 1);
})().catch(e => {
  console.error("✗ Chain proof check failed:", e.message);
  process.exit(1);
});
