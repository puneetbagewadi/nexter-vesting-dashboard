import React, { useEffect, useState } from "react";
import vestingABI from "../../abi/token-vesting.json";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { projectDetails } from "@/app/projectConfig";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";

const TransferOwnership = ({ ownerAddress }) => {
  const { account } = useWeb3React();
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const { VESTING_CONTRACT_ADDRESS } = projectDetails;

  const wagmiVestingContract = {
    address: VESTING_CONTRACT_ADDRESS,
    abi: vestingABI,
  };
  const { config } = usePrepareContractWrite({
    ...wagmiVestingContract,
    functionName: "transferOwnership",
    args: [newOwnerAddress],
  });
  const contractWrite = useContractWrite(config);
  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  const handlOwnerShip = (e) => {
    setNewOwnerAddress(e.target.value);
  };

  return (
    <div className="items-center block px-4 py-2 text-sm font-medium text-white bg-gray-100 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary">
      <label className="block text-sm font-medium text-gray-700">
        Transfer Ownership
      </label>
      <div className="flex mt-1 rounded-md shadow-sm">
        <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
          Address
        </span>
        <input
          onChange={handlOwnerShip}
          type="text"
          id="reward"
          className="flex-1 block w-full text-gray-500 border-gray-300 rounded-none focus:ring-zee-primary focus:border-blue-500 rounded-r-md sm:text-sm"
          placeholder="address"
        />
      </div>
      {waitForTransaction.isSuccess && (
        <span className="inline-flex items-center px-3 text-sm text-gray-500">
          successfully transfered ownership
        </span>
      )}
      <div className="mt-2">
        <button
          disabled={ownerAddress?.toLowerCase() != account?.toLowerCase()}
          onClick={() => contractWrite?.write()}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm disabled:opacity-50 bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
        >
          {contractWrite.isLoading || waitForTransaction.isLoading
            ? "pending..."
            : "Write"}
        </button>
      </div>
    </div>
  );
};

export default TransferOwnership;
