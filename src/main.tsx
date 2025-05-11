import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, optimism, optimismSepolia } from "wagmi/chains"; // TODO: Change from optimismSepolia to optimism
import App from "./App";
import "./styles/globals.css";

const queryClient = new QueryClient();

const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;

const { connectors } = getDefaultWallets({
  appName: import.meta.env.VITE_WALLET_CONNECT_APP_NAME,
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
});

const config = createConfig({
  chains: [optimism, optimismSepolia],
  connectors,
  transports: {
    [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [optimismSepolia.id]: http(
      `https://opt-sepolia.g.alchemy.com/v2/${alchemyKey}`
    ),
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`), // Use mainnet for ENS
  },
}) as any; // Type assertion pour éviter l'erreur de type

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
