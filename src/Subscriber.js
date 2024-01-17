import { ethers } from "ethers";

import { USDC, AAVE, GHO } from "./Contracts.js";

export class Subscriber {

  constructor(plan, userAddr, serviceAddr, privateKey, rpcUrl) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.opWallet = new ethers.Wallet(privateKey, this.provider);

    this.usdcContract = new ethers.Contract(USDC.address, USDC.abi, this.opWallet);
    this.aavePoolContract = new ethers.Contract(AAVE.address, AAVE.abi, this.opWallet);
    this.ghoContract = new ethers.Contract(GHO.address, GHO.abi, this.opWallet);
  }

  async supplyUSDCToAAVE(supplyAmount, userAddr) {
    const approveTx = await this.usdcContract.approve(AAVE.address, supplyAmount);
    await approveTx.wait();

    const supplyTx = await this.aavePoolContract.supply(USDC.address, supplyAmount, userAddr, 0);
    await supplyTx.wait();
    return { approveTx, supplyTx };
  }

  async borrowGHOFromAAVE(borrowAmount, userAddr) {
    const estimateLimit = await this.aavePoolContract.borrow.estimateGas(GHO.address, borrowAmount, 2, 0, userAddr);
    const adjustedLimit = estimateLimit + (estimateLimit / 5n);  // 20% more Gas buffer to avoid out of Gas
    const tx = await this.aavePoolContract.borrow(GHO.address, borrowAmount, 2, 0, userAddr, {gasLimit: adjustedLimit});
    await tx.wait();
    return tx;
  }

  async payToService(serviceAddr, borrowAmount) {
    const tx = await this.ghoContract.transfer(serviceAddr, borrowAmount);
    await tx.wait();
    return tx;
  }

  static calculateAmounts(plan) {
    let [supplyAmount, borrowAmount, payAmount] = [0n, 0n, 0n];
    if (plan == 'monthly') {
      // Pay 15 GHO to service
      // -> Borrow 15 GHO from AAVE Pool
      // -> Supply 20 USDC to AAVE Pool (75%)
      payAmount = 15n * GHO.decimals;
      borrowAmount = 15n * GHO.decimals;
      supplyAmount = 20n * USDC.decimals;
      return { supplyAmount, borrowAmount, payAmount };

    } else if (plan == 'annual') {
      // 20% discount for annual plan
      // Pay 15 GHO * 12 * 0.8 to service
      // -> Borrow 15 GHO * 12 * 0.8 from AAVE Pool
      // -> Supply 20 USDC * 12 * 0.8 to AAVE Pool (75%)
      payAmount = 15n * GHO.decimals * 12n * BigInt(8) / 10n;
      supplyAmount = 20n * USDC.decimals * 12n * BigInt(8) / 10n;
      borrowAmount = 20n * GHO.decimals * 12n * BigInt(8) / 10n;
      return { supplyAmount, borrowAmount, payAmount };
    }
  }
}
