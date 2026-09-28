import type { HardhatRuntimeEnvironment } from "hardhat/types";

export async function deployAll(hre: HardhatRuntimeEnvironment) {
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log(`Deploying Zentrix contracts with deployer: ${deployerAddress}`);

  // 1. Deploy ZentrixReputation
  const ReputationFactory = await hre.ethers.getContractFactory("ZentrixReputation");
  const reputation = await ReputationFactory.deploy();
  await reputation.waitForDeployment();
  const reputationAddress = await reputation.getAddress();
  console.log(`✓ ZentrixReputation deployed at: ${reputationAddress}`);

  // 2. Deploy ZentrixEscrow
  // Arbiter is deployer by default for testnet hackathon demo
  const EscrowFactory = await hre.ethers.getContractFactory("ZentrixEscrow");
  const escrow = await EscrowFactory.deploy(deployerAddress, reputationAddress);
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log(`✓ ZentrixEscrow deployed at: ${escrowAddress}`);

  // 3. Grant MINTER_ROLE on Reputation to Escrow
  const MINTER_ROLE = await reputation.MINTER_ROLE();
  const grantTx = await reputation.grantRole(MINTER_ROLE, escrowAddress);
  await grantTx.wait();
  console.log(`✓ Granted MINTER_ROLE on ZentrixReputation to ZentrixEscrow`);

  // 4. Deploy ZentrixPass
  const PassFactory = await hre.ethers.getContractFactory("ZentrixPass");
  const pass = await PassFactory.deploy();
  await pass.waitForDeployment();
  const passAddress = await pass.getAddress();
  console.log(`✓ ZentrixPass deployed at: ${passAddress}`);

  return {
    ZentrixReputation: {
      address: reputationAddress,
      constructorArguments: [],
    },
    ZentrixEscrow: {
      address: escrowAddress,
      constructorArguments: [deployerAddress, reputationAddress],
    },
    ZentrixPass: {
      address: passAddress,
      constructorArguments: [],
    },
  };
}
