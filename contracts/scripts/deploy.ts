import hre from "hardhat";
import { deployAll } from "../deploy.config";
import { writeDeploymentAddresses } from "./lib/writeDeployment";

async function main() {
  const network = hre.network.name;

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set. Check .env.local.");
  }

  console.log(`\nDeploying Zentrix to ${network}...\n`);

  const results = await deployAll(hre);

  const deployed: Record<
    string,
    { address: string; abi: unknown; constructorArguments: unknown[] }
  > = {};
  for (const [name, { address, constructorArguments }] of Object.entries(results)) {
    const artifact = await hre.artifacts.readArtifact(name);
    deployed[name] = { address, abi: artifact.abi, constructorArguments };
  }

  writeDeploymentAddresses(network, deployed);

  console.log("\n✓ All contracts deployed successfully:");
  for (const [name, { address }] of Object.entries(deployed)) {
    console.log(`  ${name}: ${address} -> https://testnet.mstscan.com/address/${address}`);
  }
  console.log(`\nDeployment records saved to deployments.json and packages/shared/src/contracts.ts\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
