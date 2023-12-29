import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";

import router from "./router";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import MetaMaskSignMessageComponent from "./containers/EthSign";

export default function App() {
  const { chains, publicClient } = configureChains(
    [sepolia, arbitrumSepolia],
    [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === sepolia.id) {
            return { http: process.env.REACT_APP_L1RPC }; // Use L1 RPC for Sepolia
          } else if (chain.id === arbitrumSepolia.id) {
            return { http: process.env.REACT_APP_L2RPC }; // Use L2 RPC for Arbitrum Sepolia
          }
          // Fallback or default URL if needed
          return { http: "https://default-rpc-url.com" };
        },
      }),
    ]
  );

  // When using livenet
  // const { chains, publicClient } = configureChains(
  //   [ethereum, arbitrum],
  //   [publicProvider()]
  // );

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet({ chains })],
    },
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <RouterProvider router={router} />
        {/* Include the MetaMaskSignMessageComponent */}
        <div className="metamask-sign-button">
          <MetaMaskSignMessageComponent message="Your custom message here" />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}