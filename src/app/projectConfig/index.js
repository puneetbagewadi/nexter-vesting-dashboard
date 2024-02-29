import { CHAIN_ID } from "../constants";

export const projectDetails = {
  BENEFICIARY_ADDRESS: "0xC160430d341B2B41F40BDfa6D1bb5419f6959566",
  INVESTOR_DISTRIBUTION_ADDRESS: "",
  VESTING_CONTRACT_ADDRESS: "0xaD7a42dF2DA3bB2D59Be16beACa426F7bFa99265",
  distributionType: [
    "SEED",
    "PRIVATE",
    "PRIVATE_KOL",
    "PUBLIC",
    "TEAM",
    "ADVISOR",
  ],
  allocationType: [
    "SEED",
    "PRIVATE",
    "PRIVATE_KOL",
    "PUBLIC",
    "TEAM",
    "ADVISOR",
    "MARKETING",
    "STAKING",
    "ECOSYSTEM",
    "TREASURY",
    "LIQUIDITY",
  ],
  brand: {
    brand_logo: "/images/nexter_logo.png",
    name: "Nexter",
  },
  explorerUrl: "https://bscscan.com",
  tokenByNetwork: {
    [CHAIN_ID.BSC_TESTNET]: {
      address: "0x32860C49C6abB7E699339ebCc2A47D97B6589DC8",
      name: "Nexter",
      symbol: "NXT",
      decimals: 18,
    },
  },
};
