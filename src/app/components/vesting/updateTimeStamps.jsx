import { projectDetails } from "@/app/projectConfig";
import React, { useEffect, useState } from "react";
import vestingABI from "../../abi/token-vesting.json";
import investorABI from "../../abi/token-vesting.json";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { redirect } from "next/navigation";

function UpdateTimeStamps({ type = "" }) {
  const {
    VESTING_CONTRACT_ADDRESS,
    tokenByNetwork,
    INVESTOR_DISTRIBUTION_ADDRESS,
  } = projectDetails;
  const [updateInitialTimes, updateInitialTimestamp] = useState("0");

  const getContractConfig = (type) => {
    switch (type) {
      case "admin":
        return {
          address: INVESTOR_DISTRIBUTION_ADDRESS,
          abi: investorABI,
        };
      case "investor":
        return {
          address: VESTING_CONTRACT_ADDRESS,
          abi: vestingABI,
        };
      default:
        return {
          address: "",
          abi: [],
        };
    }
  };
  const wagmiVestingContract = getContractConfig(type);
  const { config } = usePrepareContractWrite({
    ...wagmiVestingContract,
    functionName: "updateInitialTimestamp",
    args: [updateInitialTimes],
  });
  const contractWrite = useContractWrite(config);
  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });
  const updateInitialTime = (e) => {
    const { value } = e.target;
    updateInitialTimestamp(value?.toString());
  };
  useEffect(() => {
    if (waitForTransaction.isSuccess && !waitForTransaction.isError) {
      redirect("/admin");
    }
  }, [waitForTransaction]);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-3 sm:col-span-2">
        <div className="">
          <label
            htmlFor="epoch"
            className="block text-sm font-medium text-gray-700 capitalize"
          >
            update Initialized Time
          </label>
          <div className="flex mt-1 rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
              Epoch
            </span>
            <input
              value={updateInitialTimes}
              onChange={(e) => updateInitialTime(e)}
              type="text"
              name="epoch"
              id="updateInitialTimestamp"
              className="flex-1 block w-full border-gray-300 rounded-none focus:ring-zee-primary focus:border-zee-primary rounded-r-md sm:text-sm"
              placeholder="0163454532522"
            />
          </div>
        </div>
        <button
          onClick={() => contractWrite?.write()}
          className="inline-flex justify-center px-4 py-2 mt-2 text-sm font-medium text-white capitalize border border-transparent rounded-md shadow-sm bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
        >
          {contractWrite.isLoading || waitForTransaction.isLoading
            ? "pending..."
            : "update Time"}
        </button>
      </div>
    </div>
  );
}

export default UpdateTimeStamps;
