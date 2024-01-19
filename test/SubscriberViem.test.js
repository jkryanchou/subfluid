import { expect } from 'chai';
import { SubscriberViem } from '../src/services/SubscriberViem.js';
import { USDC, AAVE, GHO } from '../src/services/Contracts.js';

import { createWalletClient, http, publicActions } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

describe('SubscriberViem Test Suites', function () {

    let testSubscriber;
    // let testPlan = 'monthly';
    let userAddr = '0x0';
    let serviceAddr = '0x0';

    before(function () {
        // runs once before the first test in this block
        userAddr = '0xfA357FDa11349B3Cf1b326b8bE03d83B43930Ab3';
        serviceAddr = '0x828E57850A43692B627d1804D8BbA38736bF2683';

        const testWalletClient = createWalletClient({
            chain: sepolia,
            transport: http('http://localhost:8545'),
            account: privateKeyToAccount('<PRIVATE-KEY>'),
        }).extend(publicActions);

        testSubscriber = new SubscriberViem(testWalletClient);

    });

    it('Should generate correct USDC Approve Calldata', function () {
        const testCalldata = testSubscriber.genUSDCApproveCalldata(AAVE.address, 30n * USDC.decimals);
        expect(testCalldata).to.equal('0x095ea7b30000000000000000000000006ae43d3271ff6888e7fc43fd7321a503ff7389510000000000000000000000000000000000000000000000000000000001c9c380');
    });

    it('Should generate correct supply USDC to AAVE Calldata', function () {
        const testCalldata = testSubscriber.genSupplyUSDCToAAVECalldata(30n * USDC.decimals, userAddr);
        expect(testCalldata).to.equal('0x617ba03700000000000000000000000094a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c80000000000000000000000000000000000000000000000000000000001c9c380000000000000000000000000fa357fda11349b3cf1b326b8be03d83b43930ab30000000000000000000000000000000000000000000000000000000000000000');
    });

    it('Should generate correct borrow GHO Calldata', function () {
        const testCalldata = testSubscriber.genBorrowGHOFromAAVECalldata(30n * GHO.decimals, userAddr);
        expect(testCalldata).to.equal('0xa415bcad000000000000000000000000c4bf5cbdabe595361438f8c6a187bdc330539c60000000000000000000000000000000000000000000000001a055690d9db8000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fa357fda11349b3cf1b326b8be03d83b43930ab3');
    });

    it('Should send approve data correctly', async function () {
        this.timeout(10000);
        const callData = testSubscriber.genUSDCApproveCalldata(AAVE.address, 30n * USDC.decimals);
        const txHash = await testSubscriber.walletClient.sendTransaction({ 
            to: USDC.address,
            data: callData 
        });
        const tx = await testSubscriber.walletClient.getTransaction({
            hash: txHash
        });

        expect(tx.to).to.equal(USDC.address.toLowerCase());
    });

    it('Should subscribe service successfully', async function () {
        this.timeout(15000);
        const plan = 'monthly';
        const { approveTx, supplyTx, borrowTx, transferTx } = await testSubscriber.subscribe(plan, userAddr, serviceAddr);

        expect(approveTx.to).to.equal(USDC.address.toLowerCase());
        expect(supplyTx.to).to.equal(AAVE.address.toLowerCase());
        expect(borrowTx.to).to.equal(AAVE.address.toLowerCase());
        expect(transferTx.to).to.equal(GHO.address.toLowerCase());
      
    });

    it('Should generate batch user operations successfully', async function () {
        this.timeout(15000);
        const plan = 'monthly';
        const batchUserOperations = await testSubscriber.genUserOperations(plan, userAddr, serviceAddr);

        expect(batchUserOperations[0].to).to.equal(USDC.address);
        expect(batchUserOperations[1].to).to.equal(AAVE.address);
        expect(batchUserOperations[2].to).to.equal(AAVE.address);
        expect(batchUserOperations[3].to).to.equal(GHO.address);
    
    });

});