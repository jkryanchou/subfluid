
import { expect } from 'chai';
import { assert } from 'chai';

import { Subscriber } from '../src/Subscriber.js';
import { USDC, AAVE, GHO } from '../src/Contracts.js';

describe('Subscriber Test Suites', function () {
    let testSubscriber;
    let plan = 'monthly';
    let userAddr = '0x0';
    let serviceAddr = '0x0';

    before(function () {
        // runs once before the first test in this block
        userAddr = '0xYourWalletAddress';
        serviceAddr = '0xYourServiceWalletAddress';
        testSubscriber = new Subscriber(plan, userAddr, serviceAddr, '<Private-KEY>', 'http://localhost:8545');
    });

    it('Should approve USDC to wallet address', async function () {
        this.timeout(10000);
        const testSupplyAmount = 30n * USDC.decimals;
        const { approveTx, supplyTx } = await testSubscriber.supplyUSDCToAAVE(testSupplyAmount, userAddr);
        expect(approveTx.from).to.equal(userAddr);
        expect(supplyTx.to).to.equal(AAVE.address);
    });

    it('Should return correct amounts when the plan was monthly', async function () {
        const testPlan = 'monthly'
        const { supplyAmount, borrowAmount, payAmount } = Subscriber.calculateAmounts(testPlan);
        expect(supplyAmount).to.equal(20n * USDC.decimals);
        expect(borrowAmount).to.equal(15n * GHO.decimals);
        expect(payAmount).to.equal(15n * GHO.decimals);

    });

    it('Should return correct amounts when the plan was annual', async function () {
        const testPlan = 'annual'
        const { supplyAmount, borrowAmount, payAmount } = Subscriber.calculateAmounts(testPlan);

        expect(supplyAmount).to.equal(192000000n);
        expect(borrowAmount).to.equal(192000000000000000000n);
        expect(payAmount).to.equal(144000000000000000000n);
    });

});