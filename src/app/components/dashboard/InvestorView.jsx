"use client";
import { projectDetails } from "@/app/projectConfig";
import React, { useState } from "react";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";
import InvestorInfo from "./investorInfo";

function InvestorView() {
  const { account, active, library } = useWeb3React();
  const { brand } = projectDetails;
  const blacklistAccounts = [];
  const [noOfDays, setNoOfDays] = useState(null);
  return (
    <div className="px-4 py-12 mx-auto overflow-hidden bg-gray-100 rounded-lg shadow max-w-7xl sm:px-6 lg:px-8">
      <div className="px-0 py-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center lg:flex-row">
          <div className="">
            <h2 className="pb-4 text-3xl font-extrabold tracking-tight text-center text-black sm:text-4xl">
              <span className="block">{brand.name} - Investor dashboard</span>
            </h2>
          </div>
        </div>

        {/* {noOfDays != null ? (
          <div>Day : {noOfDays}</div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full bg-green-600 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2 h-2 bg-green-600 rounded-full"></span>
            </span>
            <span className="pl-2">Claiming is live. Connect to BSC Network to check your eligibility</span>
          </div>
        )} */}

        {active && (
          <div>
            {blacklistAccounts.includes(account) ? (
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  This address is not part of the investor list.
                </h3>
              </div>
            ) : library ? (
              <InvestorInfo
                blacklistAccounts={blacklistAccounts}
                setNoOfDays={setNoOfDays}
                noOfDays={noOfDays}
              />
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestorView;
