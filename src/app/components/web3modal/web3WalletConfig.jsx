"use client";
import React, { useState, useEffect } from "react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  optimism,
  polygon,
  bsc,
  arbitrum,
  fantom,
  polygonZkEvm,
  celo,
  polygonMumbai,
  bscTestnet,
  sepolia,
} from "wagmi/chains";

if (!process.env.NEXT_PUBLIC_WALLET_MODAL_PROJECT_ID) {
  throw new Error(
    "You need to provide NEXT_PUBLIC_WALLET_MODAL_PROJECT_ID env variable"
  );
}
const projectId = process.env.NEXT_PUBLIC_WALLET_MODAL_PROJECT_ID;

// 2. Configure wagmi client
const chains = [mainnet, polygon, bsc, polygonMumbai, bscTestnet, sepolia];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ version: 2, chains, projectId }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function Web3WalletConfig({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      ) : null}

      <Web3Modal
        themeMode={"light"}
        termsOfServiceUrl={"https://zeroswap.io/"}
        privacyPolicyUrl={"https://zeroswap.io/"}
        projectId={projectId}
        ethereumClient={ethereumClient}
        explorerRecommendedWalletIds={[
          "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
          "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
          "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
          "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
          "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18",
          "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66",
          "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",
          "163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3",
        ]}
        explorerExcludedWalletIds={"ALL"}
        themeVariables={{
          "--w3m-overlay-background-color": "rgba(0, 0, 0, 0.6)",
          "--w3m-accent-color": "#474747",
          "--w3m-accent-fill-color": "#fff",
          "--w3m-text-medium-regular-weight": "600",
          "--w3m-text-medium-regular-line-height": "2rem",
          "--w3m-button-border-radius": "9999px",
          "--w3m-font-family": "Nunito Sans, sans-serif",
          "--w3m-background-color": "#e8f5f9",
          "--w3m-logo-image-url":
            "https://github-production-user-asset-6210df.s3.amazonaws.com/79899121/256473779-80a51633-4b98-4696-b29b-104ecb459f3a.png",
        }}
      />
    </>
  );
}
