import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "../src/contracts";

const provider = new ethers.JsonRpcProvider("https://testnetrpc.mstblockchain.com");
const pass = new ethers.Contract(CONTRACT_ADDRESSES.ZentrixPass, CONTRACT_ABIS.ZentrixPass, provider);
const rep = new ethers.Contract(CONTRACT_ADDRESSES.ZentrixReputation, CONTRACT_ABIS.ZentrixReputation, provider);

async function scan() {
  const currentBlock = await provider.getBlockNumber();
  console.log("Current block:", currentBlock);

  // Get all transfer events on ZentrixPass
  try {
    const filter = pass.filters.Transfer();
    const events = await pass.queryFilter(filter, Math.max(0, currentBlock - 50000));
    console.log(`\n=== ZentrixPass Transfer Events (${events.length}) ===`);
    for (const e of events) {
      if ('args' in e && e.args) {
        const from = e.args[0];
        const to = e.args[1];
        const tokenId = e.args[2].toString();
        console.log(`From: ${from} -> To: ${to}, TokenId: ${tokenId}`);
        const bal = await pass.balanceOf(to);
        const passData = await pass.getPass(to);
        const tier = await pass.tierOf(to);
        console.log(`  Target ${to}: bal=${bal}, getPass=(tier:${passData.tier}, exp:${passData.expiresAt}, id:${passData.tokenId}), tierOf=${tier}`);
      }
    }
  } catch (err) {
    console.error("Error querying pass transfers:", err);
  }
  try {
    const purchasedFilter = pass.filters.PassPurchased();
    const pEvents = await pass.queryFilter(purchasedFilter, Math.max(0, currentBlock - 50000));
    console.log(`\n=== ZentrixPass PassPurchased Events (${pEvents.length}) ===`);
    for (const e of pEvents) {
      if ('args' in e && e.args) {
        console.log(`Buyer: ${e.args[0]}, TokenId: ${e.args[1]}, Tier: ${e.args[2]}, Expiry: ${e.args[3]}`);
      }
    }
  } catch (err) {
    console.error("Error querying PassPurchased events:", err);
  }

  // Get all transfer events on ZentrixReputation
  try {
    const repFilter = rep.filters.Transfer();
    const repEvents = await rep.queryFilter(repFilter, Math.max(0, currentBlock - 50000));
    console.log(`\n=== ZentrixReputation Transfer Events (${repEvents.length}) ===`);
    for (const e of repEvents) {
      if ('args' in e && e.args) {
        console.log(`From: ${e.args[0]} -> To: ${e.args[1]}, TokenId: ${e.args[2].toString()}`);
      }
    }
  } catch (err) {
    console.error("Error querying rep transfers:", err);
  }
}

scan().catch(console.error);
