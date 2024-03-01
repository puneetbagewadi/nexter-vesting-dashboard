import { CHAIN_ID } from "../constants";

export const projectDetails = {
  BENEFICIARY_ADDRESS: "0xC160430d341B2B41F40BDfa6D1bb5419f6959566",
  INVESTOR_DISTRIBUTION_ADDRESS: "0x39c57f6f0ad10c3E26b15Bd2baF4Bb11377FCa34",
  VESTING_CONTRACT_ADDRESS: "0x72f9626e7336713E13F7b58f3D3Bcb6ce7B717F2",
  distributionType: [
    "SEED",
    "PRIVATE",
    "PRIVATE_KOL",
    "PUBLIC",
    "TEAM",
    "ADVISOR",
  ],
  allocationType: [
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
    [CHAIN_ID.SEPOLIA]: {
      address: "0x32860C49C6abB7E699339ebCc2A47D97B6589DC8",
      name: "Nexter",
      symbol: "NXT",
      decimals: 18,
    },
  },
};
