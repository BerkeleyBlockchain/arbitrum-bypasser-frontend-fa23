import React, { useContext, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ProtocolsProvider } from "./containers/ProtocolsContext";
import "./App.css";

import router from "./router";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia, arbitrumSepolia, arbitrum, mainnet } from "wagmi/chains";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { GlobalContext } from "./ContextProvider";

export default function App() {
  const { livenet } = useContext(GlobalContext);

  const { chains, publicClient } = !livenet
    ? configureChains(
        // Testnet configuration
        [sepolia, arbitrumSepolia],
        [
          jsonRpcProvider({
            rpc: (chain) => {
              if (chain.id === sepolia.id) {
                return { http: process.env.REACT_APP_TESTNET_L1RPC }; // L1 RPC for Sepolia
              } else if (chain.id === arbitrumSepolia.id) {
                return { http: process.env.REACT_APP_TESTNET_L2RPC }; // L2 RPC for Arbitrum Sepolia
              }
              return { http: "https://default-rpc-url.com" }; // Fallback URL
            },
          }),
        ]
      )
    : configureChains(
        // Mainnet configuration
        [mainnet, arbitrum],
        [
          jsonRpcProvider({
            rpc: (chain) => {
              if (chain.id === mainnet.id) {
                return { http: process.env.REACT_APP_MAINNET_L1RPC }; // L1 RPC for Mainnet
              } else if (chain.id === arbitrum.id) {
                return { http: process.env.REACT_APP_MAINNET_L2RPC }; // L2 RPC for Arbitrum
              }
              return { http: "https://default-rpc-url.com" }; // Fallback URL
            },
          }),
        ]
      );

  console.log(chains, publicClient);

  // const { chains, publicClient } = configureChains(
  //   livenet ? [mainnet, arbitrum] : [sepolia, arbitrumSepolia],
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
  console.log(wagmiConfig);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ProtocolsProvider>
          <RouterProvider router={router} />
        </ProtocolsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
