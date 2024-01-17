# subfluid
---

Subfluid A subscription protocol built for crypto product to help users to subscribe any product or servcies and pay for it with crypto.
it built on top of AAVE Protocol and Account-Abstraction. It allows users to supply USDC and borrow GHO to pay for the subscription. 
The whole process is seamless and users don't need to worry about the gas fee and no more other compliated steps.

# Requirements
---

- Firstly, Before running the apps, you need to install the following dependencies.

  ```
  npm install --save
  ```

- Secondly, you should prepare some ETH in Sepolia testnet. You could visit [faucet](https://sepoliafaucet.com/) to register a Alchemy account and send some ETH to your test wallet.

  ![Sepolia Testnet](./docs/images/sepolia-testnet.png))

- And you need a local ethereum node to run the local-testing. You can use ganache-cli, hardhat or Anvil. Here are the Anvil commands
to fork with sepolia testnet. replace with your API-Key and the local node will listen on port `8545`.

  ```
  anvil --fork-url=https://eth-sepolia.g.alchemy.com/v2/<API-KEY>
  ```

# Usages
---

Here is the usages run subfluid.

```
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
```

- Subscribe a service on a wallet based on montly plan.  
  Pay attention to the --rpc-url and --private-key. You should replace with your own rpc-url and private key.

  ```
  node ./src/index.js sub --user-wallet=<Your-Wallet-Address> --service-wallet=<Subscribe-Service-Wallet> --plan=monthly --private-key=<Private-Key> --rpc-url=http://localhost:8545
  ```

# Tests & Contributes
---

You could run the `unittests` based on mocha and chai. The tests are located in `./test` folder. You could run the following command to run the tests.

```
npx mocha ./test/Subscriber.test.js
```

**NOTE**

You should replace some hardcode wallet address (`userAddr & serviceAddr`) with your own wallet address and private key in the `./test/Subscriber.test.js` file.

```
...
    before(function () {
        // runs once before the first test in this block
        userAddr = '0xYourWalletAddress';           // User Wallet Address
        serviceAddr = '0xYourServiceWalletAddress'; // Service Wallet Address
        testSubscriber = new Subscriber(plan, userAddr, serviceAddr, '<Private-KEY>', 'http://localhost:8545');
    });
...
```

**TODO** Read from the env file to replace the hardcode wallet address.