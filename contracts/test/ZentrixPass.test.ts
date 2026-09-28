import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ZentrixPass } from "../typechain-types";

describe("ZentrixPass", function () {
  let pass: ZentrixPass;
  let owner: any;
  let buyer: any;
  let recipient: any;

  beforeEach(async function () {
    [owner, buyer, recipient] = await ethers.getSigners();
    const PassFactory = await ethers.getContractFactory("ZentrixPass");
    pass = await PassFactory.deploy();
    await pass.waitForDeployment();
  });

  it("should have correct initial tier prices", async function () {
    expect(await pass.tierPrices(1)).to.equal(ethers.parseEther("5.0"));
    expect(await pass.tierPrices(2)).to.equal(ethers.parseEther("15.0"));
  });

  it("should allow purchasing Pro Pass (Tier 1) and report tier 1", async function () {
    expect(await pass.tierOf(buyer.address)).to.equal(0);

    await expect(pass.connect(buyer).buy(1, { value: ethers.parseEther("5.0") }))
      .to.emit(pass, "PassPurchased");

    expect(await pass.tierOf(buyer.address)).to.equal(1);
    expect(await pass.balanceOf(buyer.address)).to.equal(1n);
  });

  it("should refund excess payment when buying a pass", async function () {
    const balBefore = await ethers.provider.getBalance(buyer.address);
    const tx = await pass.connect(buyer).buy(1, { value: ethers.parseEther("6.0") });
    const receipt = await tx.wait();
    const gasSpent = receipt!.gasUsed * receipt!.gasPrice;
    const balAfter = await ethers.provider.getBalance(buyer.address);

    // Only 5.0 ether deducted plus gas
    expect(balBefore - balAfter - gasSpent).to.equal(ethers.parseEther("5.0"));
  });

  it("should expire after 30 days and return tier 0", async function () {
    await pass.connect(buyer).buy(1, { value: ethers.parseEther("5.0") });
    expect(await pass.tierOf(buyer.address)).to.equal(1);

    // Fast-forward 30 days + 1 second
    await time.increase(30 * 86400 + 1);
    expect(await pass.tierOf(buyer.address)).to.equal(0);
  });

  it("should revert transfer between accounts (soulbound)", async function () {
    await pass.connect(buyer).buy(1, { value: ethers.parseEther("5.0") });

    await expect(
      pass.connect(buyer).transferFrom(buyer.address, recipient.address, 1)
    ).to.be.revertedWith("ZentrixPass: soulbound, non-transferable");
  });

  it("should allow admin to update tier price", async function () {
    await expect(pass.connect(owner).setPrice(1, ethers.parseEther("3.0")))
      .to.emit(pass, "PriceUpdated")
      .withArgs(1, ethers.parseEther("3.0"));

    expect(await pass.tierPrices(1)).to.equal(ethers.parseEther("3.0"));
  });

  it("should allow admin to withdraw accumulated fees", async function () {
    await pass.connect(buyer).buy(2, { value: ethers.parseEther("15.0") });

    const balBefore = await ethers.provider.getBalance(owner.address);
    const tx = await pass.connect(owner).withdrawFees();
    const receipt = await tx.wait();
    const gasSpent = receipt!.gasUsed * receipt!.gasPrice;
    const balAfter = await ethers.provider.getBalance(owner.address);

    expect(balAfter + gasSpent - balBefore).to.equal(ethers.parseEther("15.0"));
  });
});
