import fs from "fs";
import path from "path";

const deploymentsPath = path.resolve(process.cwd(), "contracts/deployments.json");
const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf-8"));

const code = `// Auto-generated from contracts/deployments.json
export const CHAIN_ID = 91562037;
export const RPC_URL = "https://testnetrpc.mstblockchain.com";

export const CONTRACT_ADDRESSES = {
  ZentrixReputation: "${deployments.testnet.ZentrixReputation.address}",
  ZentrixEscrow: "${deployments.testnet.ZentrixEscrow.address}",
  ZentrixPass: "${deployments.testnet.ZentrixPass.address}",
} as const;

export const CONTRACT_ABIS = {
  ZentrixReputation: ${JSON.stringify(deployments.testnet.ZentrixReputation.abi, null, 2)} as const,
  ZentrixEscrow: ${JSON.stringify(deployments.testnet.ZentrixEscrow.abi, null, 2)} as const,
  ZentrixPass: ${JSON.stringify(deployments.testnet.ZentrixPass.abi, null, 2)} as const,
};
`;

fs.writeFileSync(path.resolve(process.cwd(), "src/contracts.ts"), code);
console.log("Generated src/contracts.ts successfully!");
