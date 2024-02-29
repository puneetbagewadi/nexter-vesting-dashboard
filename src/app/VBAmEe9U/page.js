"use client";
import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Contract } from "@ethersproject/contracts";

import { BigNumber } from "bignumber.js";

import distributionABI from "../abi/investor-distribution.json";
import InvestorDetails from "../components/investorDetails/investorDetails";
import InvestorAddressConfig from "../artifacts/investorsAddress";
import { useWeb3React } from "../components/web3WalletProvider/web3WalletProvider";
import { projectDetails } from "../projectConfig";
import { formatToken } from "../utils";

const InvestorInfo = () => {
  const { chainId, account, library } = useWeb3React();
  const [investorInfo, setInvestorInfo] = useState([]);

  const distriTokenData = projectDetails.tokenByNetwork[chainId];

  useEffect(() => {
    library && getInvesterDetails(library);
  }, [library]);

  const owner_address = [
    "0x327145fE18A97f5E1AB3DDa36E0062aE90fE6943",
    "0xcFDe057873492920044CD84D995B954DEC404086",
    "0x5BaAd9a04ED552791C496B8AA5627bfF48c9f2c4",
  ];

  const getInvesterDetails = (library) => {
    const tokenDistributionContract = new Contract(
      projectDetails.INVESTOR_DISTRIBUTION_ADDRESS,
      distributionABI,
      library.getSigner()
    );
    if (owner_address.includes(account)) {
      tokenDistributionContract && getAllDetails(tokenDistributionContract);
    }
  };

  const getAllDetails = (tokenDistributionContract) => {
    InvestorAddressConfig.map((item) => {
      item.InvestorAddress.map(async (data) => {
        const details = await tokenDistributionContract.investorsInfo(
          item.allocationValue,
          data
        );
        let withdrawableTokensValue =
          await tokenDistributionContract.withdrawableTokens(
            item.allocationValue,
            data
          );
        setInvestorInfo((info) => {
          return [
            ...info,
            {
              round: data,
              roundNumber: `${
                item.allocationValue === 0
                  ? "Preseed"
                  : item.allocationValue === 1
                  ? "Seed"
                  : item.allocationValue === 2
                  ? "Private1"
                  : item.allocationValue === 3
                  ? "Team"
                  : item.allocationValue === 4
                  ? "Advisor"
                  : "Value Advisor"
              }`,
              exists: details[0],
              withdrawnTokens: formatToken(
                details[1],
                distriTokenData
              ).toFormat(),
              tokensAllotment: formatToken(
                details[2],
                distriTokenData
              ).toFormat(),
              withdrawableTokens: formatToken(
                withdrawableTokensValue,
                distriTokenData
              ).toFormat(),
              remaningTokens: (
                parseFloat(
                  formatToken(details[2], distriTokenData)
                    .toFormat()
                    .replace(/,/g, "")
                ) -
                parseFloat(
                  formatToken(details[1], distriTokenData)
                    .toFormat()
                    .replace(/,/g, "")
                )
              ).toLocaleString(),
            },
          ];
        });
      });
    });
  };

  return (
    <Fragment>
      <div>
        <div className="min-h-screen text-gray-900 bg-gray-100">
          <main className="px-4 pt-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mt-6">
              {owner_address.includes(account) ? (
                <InvestorDetails investorInfo={investorInfo} />
              ) : (
                <div>
                  <h1 className="text-3xl font-semibold text-center text-red-700">
                    You are not authorized to view this page.
                  </h1>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Fragment>
  );
};

export default function InvestorData() {
  return <InvestorInfo />;
}
