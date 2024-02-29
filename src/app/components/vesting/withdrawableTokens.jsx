import { projectDetails } from "@/app/projectConfig";
import React, { useCallback, useEffect, useState } from "react";
import vestingABI from "../../abi/token-vesting.json";
import {
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Button from "../button/button";
import { fromBase, toBase } from "@/app/utils";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";
import commaNumber from "comma-number";

function WithdrawableTokens() {
  const { chainId, account } = useWeb3React();
  const [withdrawabaleInfo, setWithdrawableTokens] = useState();
  const [withdrawResult, setResultData] = useState();
  const { VESTING_CONTRACT_ADDRESS, tokenByNetwork, BENEFICIARY_ADDRESS } =
    projectDetails;
  const tokenDetails = tokenByNetwork[chainId];
  const wagmiVestingContract = {
    address: VESTING_CONTRACT_ADDRESS,
    abi: vestingABI,
  };
  const { config } = usePrepareContractWrite({
    address: VESTING_CONTRACT_ADDRESS,
    abi: vestingABI,
    functionName: "withdrawMonthlyVesting",
  });
  const contractWrite = useContractWrite(config);
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...wagmiVestingContract,
        functionName: "getWithdrawableTokens",
      },
      {
        ...wagmiVestingContract,
        functionName: "getDays",
      },
      {
        ...wagmiVestingContract,
        functionName: "getMonths",
      },
      {
        ...wagmiVestingContract,
        functionName: "tokenReceived",
        args: [BENEFICIARY_ADDRESS],
      },
    ],
  });

  // const { data: result, isLoading: pending, isSuccess, write, status } = useContractWrite({
  //     address: VESTING_CONTRACT_ADDRESS,
  //     abi: vestingABI,
  //     functionName: 'withdrawMonthlyVesting',
  // })

  useEffect(() => {
    if (!isLoading) {
      const withdawabaleTokens = data[0]?.result?.toString()
        ? fromBase(data[0]?.result?.toString(), tokenDetails?.decimals)
        : "";
      const withdrawabaleInfo = {
        withdawabaleTokens: withdawabaleTokens,
        numberOfDays: data[1]?.result?.toString(),
        numberOfMonths: data[2]?.result?.toString(),
        withdrawnTokens: fromBase(data[3]?.result?.toString(), 18),
      };
      setWithdrawableTokens(withdrawabaleInfo);
    }
  }, [data, isLoading]);

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  useEffect(() => {
    if (waitForTransaction.isSuccess && !waitForTransaction.isError) {
      redirect("/admin");
    }
  }, [waitForTransaction]);

  const handleWriteAction = useCallback(() => {
    contractWrite?.write();
  }, [contractWrite]);
  if (isError) return <div>Contract data fetching issue</div>;

  return (
    <div className="items-center block w-full px-4 py-2 text-sm font-medium text-white bg-gray-100 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary">
      <label className="block text-sm font-medium text-gray-700">
        {" "}
        Withdrawable Information
      </label>
      {isLoading ? (
        "loading.."
      ) : (
        <div className="flex items-center">
          <div className="inline-block py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full bg-white border divide-y divide-gray-300">
              <thead>
                <tr className="">
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                  >
                    Number of Days
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                  >
                    Number of Months
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900"
                  >
                    Withdrawable Tokens
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900"
                  >
                    Withdrawn Tokens
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr key={"info"}>
                  <td className="px-3 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">
                    {withdrawabaleInfo?.numberOfDays}
                  </td>
                  <td className="px-3 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">
                    {withdrawabaleInfo?.numberOfMonths}
                  </td>
                  <td className="px-3 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">
                    {commaNumber(withdrawabaleInfo?.withdawabaleTokens)}
                  </td>
                  <td className="px-3 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">
                    {commaNumber(withdrawabaleInfo?.withdrawnTokens)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button onClick={() => handleWriteAction()} className="">
            {contractWrite.isLoading || waitForTransaction.isLoading
              ? "Pending..."
              : "Withdraw"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default WithdrawableTokens;
