import { projectDetails } from "@/app/projectConfig";
import React, { useEffect, useState } from "react";
import vestingABI from "../../abi/token-vesting.json";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getUtcDateFormat } from "@/app/utils";
import UpdateTimeStamps from "./updateTimeStamps";

function SetVestingTimeStamps() {
  const { VESTING_CONTRACT_ADDRESS } = projectDetails;
  const [initialTimesStamp, setInitialTimesStamp] = useState("0");
  const wagmiVestingContract = {
    address: VESTING_CONTRACT_ADDRESS,
    abi: vestingABI,
  };

  const {
    isError,
    isLoading,
    status: txStatus,
  } = useContractRead({
    ...wagmiVestingContract,
    functionName: "getInitialTimestamp",
    cacheOnBlock: false,
    blockTag: "latest",
    onSuccess(data) {
      setInitialTimesStamp(data?.toString());
    },
  });

  const { config } = usePrepareContractWrite({
    ...wagmiVestingContract,
    functionName: "setInitialTimestamp",
    args: [initialTimesStamp],
  });
  const contractWrite = useContractWrite(config);
  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  useEffect(() => {
    if (waitForTransaction.isSuccess && !waitForTransaction.isError) {
      redirect("/admin");
    }
  }, [waitForTransaction]);
  return (
    <div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-5 space-y-6 bg-white sm:p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="epoch"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time
                </label>
                <div className="flex mt-1 rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                    UTC Date
                  </span>
                  <input
                    value={getUtcDateFormat(initialTimesStamp)}
                    readOnly
                    onChange={(e) => {}}
                    type="text"
                    name="epoch"
                    id="epoch"
                    className="flex-1 block w-full border-gray-300 rounded-none focus:ring-zee-primary focus:border-zee-primary rounded-r-md sm:text-sm"
                    placeholder="0163454532522"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 gap-2 sm:col-span-2">
                <label
                  htmlFor="epoch"
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  set Initialized Time
                </label>
                <div className="flex mt-1 rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                    Epoch
                  </span>
                  <input
                    value={initialTimesStamp}
                    onChange={(e) => setInitialTimesStamp(e.target.value)}
                    type="text"
                    name="epoch"
                    id="setInitialTimes"
                    className="flex-1 block w-full border-gray-300 rounded-none focus:ring-zee-primary focus:border-zee-primary rounded-r-md sm:text-sm"
                    placeholder="0163454532522"
                  />
                </div>
                <button
                  onClick={() => contractWrite?.write()}
                  className="inline-flex justify-center px-4 py-2 mt-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                >
                  {contractWrite.isLoading || waitForTransaction.isLoading
                    ? "Pending..."
                    : "Set Time"}
                </button>
              </div>
            </div>

            {/* <UpdateTimeStamps type="investor" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetVestingTimeStamps;
