export const CHAIN_ID = {
  MAINNET: 1,
  BSC: 56,
  POLYGON: 137,
  MUMBAI: 80001,
  BSC_TESTNET: 97,
  SEPOLIA: 11155111,
};

export const SUPPORTED_CHAIN_IDS = [
  CHAIN_ID.BSC,
  CHAIN_ID.BSC_TESTNET,
  CHAIN_ID.SEPOLIA,
];
export const NETWORK_LABELS = {
  [CHAIN_ID.MAINNET]: "Ethereum",
  [CHAIN_ID.BSC]: "BNB Chain",
  [CHAIN_ID.BSC_TESTNET]: "Binance Smart Chain Testnet",
  [CHAIN_ID.POLYGON]: "Polygon",
  [CHAIN_ID.MUMBAI]: "Mumbai",
};

export const TESTNET_CHAIN_ID = [CHAIN_ID.SEPOLIA];
// export const NETWORKS = {
//   [CHAIN_ID.MAINNET]: {
//     name: NETWORK_LABELS[CHAIN_ID.MAINNET],
//     icon: "",
//     href: null,
//     primary: true,
//     logoUrl: "",
//   },
//   [CHAIN_ID.BSC]: {
//     name: NETWORK_LABELS[CHAIN_ID.BSC],
//     icon: "",
//     href: null,
//     logoUrl: "",
//   },
//   [CHAIN_ID.POLYGON]: {
//     name: NETWORK_LABELS[CHAIN_ID.POLYGON],
//     icon: "",
//     href: null,
//     logoUrl: "",
//   },
//   [CHAIN_ID.MUMBAI]: {
//     name: NETWORK_LABELS[CHAIN_ID.MUMBAI],
//     icon: "",
//     href: null,
//     logoUrl: "",
//   },
// };
