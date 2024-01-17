
import { docopt } from "docopt";

import { Subscriber } from "../src/Subscriber.js";
import { USDC, GHO } from "./Contracts.js";

const doc = `
    Usage:
        subscribe.js sub [options] (--user-wallet=<USER>) (--service-wallet=<SERVICE>) (--plan=<PLAN>) (--private-key=<PRIVATE-KEY>) (--rpc-url=<RPC-URL>)
        subscribe.js deduct [options] (--user-wallet=<USER>) (--service-wallet=<SERVICE>) (--private-key=<PRIVATE-KEY>) (--rpc-url=<RPC-URL>)

    Commands:
        sub                            Subscribe service by monthly or annual payment
        deduct                         Deduct monthly fee from user wallet

    Options:
        -u, --user-wallet USER         User wallet address to subscribe   
        -s, --service-wallet SERVICE   Service wallet address to receive the subscription and GHO Token.
        -e, --plan PLAN                Subscription Fee to pay for service
        -r, --rpc-url RPC-URL          Specify RPC URL to connect to Network or Chains
        -p, --private-key PRIVATE-KEY  Specify private key to connect to Network or Chains
`;

const main = async () => {
  const args = docopt(doc, { version: '1.0' });

  if (args['sub']) {
    const [userAddr, serviceAddr] = [args['--user-wallet'], args['--service-wallet']];
    const plan = args['--plan'];
    let subscriber = new Subscriber(plan, userAddr, serviceAddr, args['--private-key'], args['--rpc-url']);

    // Core Logic:
    // 1. Calculate supply & borrow amount for USDC based on subscription plan;
    // 2. Supply USDC to AAVE Pool;
    // 3. Borrow GHO Token from AAVE Pool;
    // 4. Transfer GHO Token to service wallet as subscription fee (Pay to Service);
    console.log(`User Wallet: ${userAddr}, Service Wallet: ${serviceAddr}`);
    console.log(`Subscription Plan: ${plan}`);

    const { supplyAmount, borrowAmount, payAmount } = Subscriber.calculateAmounts(plan);
    const { approveTx, supplyTx } = await subscriber.supplyUSDCToAAVE(supplyAmount, userAddr);
    console.log(`Supply ${supplyAmount / USDC.decimals} USDC to AAVE Pool Supply TX: ${supplyTx.hash}, Approve TX: ${approveTx.hash}`);

    const borrowTx = await subscriber.borrowGHOFromAAVE(borrowAmount, userAddr);
    console.log(`Borrow ${borrowAmount / GHO.decimals} GHO from AAVE Pool TX: ${borrowTx.hash}`);

    const payTx = await subscriber.payToService(serviceAddr, payAmount);
    console.log(`Pay ${payAmount / GHO.decimals} GHO to service wallet TX: ${payTx.hash}`);

  } else {
    // Deduct monthly fee from user wallet

  }

};

main()