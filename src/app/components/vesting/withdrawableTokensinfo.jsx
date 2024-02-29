import { projectDetails } from "@/app/projectConfig";
import React, { useEffect, useState } from "react";
import vestingABI from "../../abi/token-vesting.json";
import { useContractReads } from "wagmi";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";
import { fromBase } from "@/app/utils";
import commaNumber from "comma-number";

export default function WithdrawableTokensInfo() {
  const { chainId, account } = useWeb3React();
  const [withdrawabaleInfo, setWithdrawableTokens] = useState();
  const [timeStampData, setTimeStampsData] = useState();
  const { VESTING_CONTRACT_ADDRESS, tokenByNetwork, allocationType } =
    projectDetails;
  const token = tokenByNetwork[chainId] || {};
  const wagmiVestingContract = {
    address: VESTING_CONTRACT_ADDRESS,
    abi: vestingABI,
  };
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [0],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [1],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [2],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [3],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [4],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [5],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [6],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [7],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [8],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [9],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [10],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [11],
      },
      {
        ...wagmiVestingContract,
        functionName: "withdrawableTokens",
        args: [12],
      },
    ],
    cacheOnBlock: false,
    blockTag: "latest",
    onSuccess(data) {
      setWithdrawableTokens(data);
    },
  });
  const { isError: timeStampsError, isLoading: pending } = useContractReads({
    contracts: [
      {
        ...wagmiVestingContract,
        functionName: "getDays",
      },
      {
        ...wagmiVestingContract,
        functionName: "getMonths",
      },
    ],
    // watch: true,
    onSuccess(data) {
      setTimeStampsData(data);
    },
  });
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Withdrawable Tokens
          </h1>
        </div>
      </div>
      {timeStampData && withdrawabaleInfo && (
        <div className="flow-root mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Distribution Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Tokens Available
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Number of days
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Number of Months
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {withdrawabaleInfo.map((item, index) => (
                    <tr key={index + "w" + item?.result}>
                      <td className="px-3 py-4 text-sm text-gray-900 font-noraml whitespace-nowrap">
                        {allocationType[index]}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 font-noraml whitespace-nowrap">
                        {commaNumber(
                          fromBase(item?.result || 0, token?.decimals)
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 font-noraml whitespace-nowrap">
                        {timeStampData[0]?.result?.toString()}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 font-noraml whitespace-nowrap">
                        {timeStampData[1]?.result?.toString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
