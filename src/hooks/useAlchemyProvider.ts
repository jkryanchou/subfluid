import {chain, gasManagerPolicyId} from "@/config/client";
import {getRpcUrl} from "@/config/rpc";
import {
  IMSCA,
  SessionKeyPlugin,
  createMultiOwnerMSCA,
  getDefaultMultiOwnerMSCAFactoryAddress,
} from "@alchemy/aa-accounts";
import {AlchemyProvider} from "@alchemy/aa-alchemy";
import {
  SmartAccountSigner,
  getDefaultEntryPointAddress,
} from "@alchemy/aa-core";
import {useCallback, useState} from "react";
import { type Address, type Chain } from "viem";

export enum PluginType {
  SESSION_KEY,
}

export const useAlchemyProvider = () => {
  const [provider, setProvider] = useState<AlchemyProvider>(
      new AlchemyProvider({
        chain,
        rpcUrl: getRpcUrl(),
        opts: {
          txMaxRetries: 100,
          txRetryIntervalMs: 1000,
        }
      })
  );

  const connectProviderToAccount = useCallback(
      (signer: SmartAccountSigner, account?: Address) => {
        const connectedProvider = provider
        .connect((provider) => {
          // @ts-ignore
          return createMultiOwnerMSCA({
            rpcClient: provider,
            owner: signer,
            chain,
            // @ts-ignore
            entryPointAddress: getDefaultEntryPointAddress(chain),
            // @ts-ignore
            factoryAddress: getDefaultMultiOwnerMSCAFactoryAddress(chain),
            accountAddress: account,
          });
        })
        .withAlchemyGasManager({
          policyId: gasManagerPolicyId,
        });

        setProvider(connectedProvider);
        return connectedProvider;
      },
      [provider]
  );

  const disconnectProviderFromAccount = useCallback(() => {
    const disconnectedProvider = provider.disconnect();

    setProvider(disconnectedProvider);
    return disconnectedProvider;
  }, [provider]);

  const pluginInstall = useCallback(
      async (type: PluginType) => {
        if (!provider.isConnected<IMSCA>()) {
          return;
        }

        switch (type) {
          case PluginType.SESSION_KEY:
            return provider
            .extend(SessionKeyPlugin.providerMethods)
            .installSessionKeyPlugin({
              args: [[]],
            });

          default:
            throw new Error("Unexpected plugin type", type);
        }
      },
      [provider]
  );

  return {
    provider,
    connectProviderToAccount,
    disconnectProviderFromAccount,
    pluginInstall,
  };
};
