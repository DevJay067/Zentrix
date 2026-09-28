import { ethers } from "ethers";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.MST_TESTNET_RPC || "https://testnetrpc.mstblockchain.com");
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("No PRIVATE_KEY found in .env.local");

  const deployer = new ethers.Wallet(privateKey, provider);
  console.log("Deployer:", deployer.address);

  const bal = await provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(bal), "tMSTC");

  // Create demo client & freelancer
  const clientWallet = ethers.Wallet.createRandom();
  const freelancerWallet = ethers.Wallet.createRandom();

  console.log("Funding Demo Client:", clientWallet.address);
  const tx1 = await deployer.sendTransaction({
    to: clientWallet.address,
    value: ethers.parseEther("0.5"),
  });
  console.log("Tx 1 Hash:", tx1.hash);
  await tx1.wait();

  console.log("Funding Demo Freelancer:", freelancerWallet.address);
  const tx2 = await deployer.sendTransaction({
    to: freelancerWallet.address,
    value: ethers.parseEther("0.5"),
  });
  console.log("Tx 2 Hash:", tx2.hash);
  await tx2.wait();

  const walletAddrs = [deployer.address, clientWallet.address, freelancerWallet.address].join(",");

  // Update .env.local
  let envContent = fs.readFileSync(".env.local", "utf8");
  if (!envContent.includes("WALLET_ADDRESSES=")) {
    envContent += `\nWALLET_ADDRESSES=${walletAddrs}\nMIN_BALANCE=0.1\n`;
  } else {
    envContent = envContent.replace(/WALLET_ADDRESSES=.*/, `WALLET_ADDRESSES=${walletAddrs}`);
  }
  fs.writeFileSync(".env.local", envContent);

  // Update PROOF.md with funding txs
  let proof = fs.readFileSync("docs/PROOF.md", "utf8");
  proof += `\n| Fund Demo Client | \`${tx1.hash}\` | [Explorer](https://testnet.mstscan.com/tx/${tx1.hash}) | Confirmed |\n`;
  proof += `| Fund Demo Freelancer | \`${tx2.hash}\` | [Explorer](https://testnet.mstscan.com/tx/${tx2.hash}) | Confirmed |\n`;
  fs.writeFileSync("docs/PROOF.md", proof);

  console.log("✓ Preflight Wallets Funded and Verified on MST Testnet!");
}

main().catch(console.error);
