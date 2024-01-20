
import { encodeFunctionData, getContract, parseAbi } from 'viem'
import { USDC, AAVE, GHO } from './Contracts.js'

export class SubscriberViem {
  
  constructor(walletClient) {
    this.walletClient = walletClient;

    this.usdcContract = getContract({
      address: USDC.address,
      abi: USDC.abi,
      client: this.walletClient,
    });

    this.aavePoolContract = getContract({
      address: AAVE.address,
      abi: AAVE.abi,
      client: this.walletClient,
    });

    this.ghoContract = getContract({
      address: GHO.address,
      abi: GHO.abi,
      client: this.walletClient,
    }); 

  }

  genUSDCApproveCalldata(spender, amount) {
    const callData = encodeFunctionData({
      abi: parseAbi(USDC.abi),
      functionName: 'approve',
      args: [spender, amount]
    });
    return callData.toString();
  }

  genSupplyUSDCToAAVECalldata(supplyAmount, userAddr) {
    const callData = encodeFunctionData({
      abi: parseAbi(AAVE.abi),
      functionName: 'supply',
      args: [USDC.address, supplyAmount, userAddr, 0]
    });
    return callData;
  }

  genBorrowGHOFromAAVECalldata(borrowAmount, userAddr) {
    const callData = encodeFunctionData({
      abi: parseAbi(AAVE.abi),
      functionName: 'borrow',
      args: [GHO.address, borrowAmount, 2, 0, userAddr]
    });
    return callData
  }

  genGHOTransferCalldata(serviceAddr, borrowAmount) {
    const callData = encodeFunctionData({
      abi: parseAbi(GHO.abi),
      functionName: 'transfer',
      args: [serviceAddr, borrowAmount]
    });
    return callData
  }

  async sendTransaction({ to, data }) {
    const txHash = await this.walletClient.sendTransaction({ to, data });
    const tx = await this.walletClient.getTransaction({ hash: txHash });
    return tx;
  }

  // NOTE: Not call this function directly, use subscribe() instead
  async estimateBorrowGasLimit(borrowAmount, userAddr) {
    const gasLimit = await this.walletClient.estimateGas({ 
      address: AAVE.address,
      abi: parseAbi(AAVE.abi),
      functionName: 'borrow',
      args: [GHO.address, borrowAmount, 2, 0, userAddr]
    });
    
    return gasLimit + (gasLimit / 5n);  // 20% more Gas buffer to avoid out of Gas
  }

  async subscribe(plan, userAddr, serviceAddr) {
    const { supplyAmount, borrowAmount, payAmount } = SubscriberViem.calculateAmounts(plan);

    const approveTxHash = await this.walletClient.sendTransaction({ to: USDC.address, data: this.genUSDCApproveCalldata(AAVE.address, supplyAmount) });
    const approveTx = await this.walletClient.getTransaction({ hash: approveTxHash });
    console.log('Approve USDC Tx:', approveTx);

    const supplyTxHash = await this.walletClient.sendTransaction({ to: AAVE.address, data: this.genSupplyUSDCToAAVECalldata(supplyAmount, userAddr) });
    const supplyTx = await this.walletClient.getTransaction({ hash: supplyTxHash });
    console.log('Supply USDC Tx:', supplyTx);

    const borrowTxHash = await this.walletClient.sendTransaction({ to: AAVE.address, data: this.genBorrowGHOFromAAVECalldata(borrowAmount, userAddr) });
    const borrowTx = await this.walletClient.getTransaction({ hash: borrowTxHash });
    console.log('Borrow GHO Tx:', borrowTx);

    const transferTxHash = await this.walletClient.sendTransaction({ to: GHO.address, data: this.genGHOTransferCalldata(serviceAddr, payAmount) });
    const transferTx = await this.walletClient.getTransaction({ hash: transferTxHash });
    console.log('Transfer GHO Tx:', transferTx);

    return { approveTx, supplyTx, borrowTx, transferTx };
  }

  genUserOperations(plan, userAddr, serviceAddr) {
    const { supplyAmount, borrowAmount, payAmount } = SubscriberViem.calculateAmounts(plan);
    return [
      {
        target: USDC.address,
        data: this.genUSDCApproveCalldata(AAVE.address, supplyAmount)
      },
      {
        target: AAVE.address,
        data: this.genSupplyUSDCToAAVECalldata(supplyAmount, userAddr)
      },
      {
        target: AAVE.address,
        data: this.genBorrowGHOFromAAVECalldata(borrowAmount, userAddr)
      },
      {
        target: GHO.address,
        data: this.genGHOTransferCalldata(serviceAddr, payAmount)
      }
    ]
  }

  static calculateAmounts(plan) {
    let [supplyAmount, borrowAmount, payAmount] = [0n, 0n, 0n];

    if (plan.toLowerCase() === 'monthly') {
      // Pay 15 GHO to service
      // -> Borrow 15 GHO from AAVE Pool
      // -> Supply 20 USDC to AAVE Pool (75%)
      payAmount = 15n * GHO.decimals;
      borrowAmount = 15n * GHO.decimals;
      supplyAmount = 20n * USDC.decimals;
      return { supplyAmount, borrowAmount, payAmount };

    } else if (plan.toLowerCase() === 'annual') {
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
