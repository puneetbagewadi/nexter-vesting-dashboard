import React, { useState, useEffect, useCallback } from "react";
import { numAsHex, vestingContract } from "../../utils/index";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";
import { projectDetails } from "../../projectConfig/index";
import WithdrawableTokens from "./withdrawableTokens";
import SetVestingTimeStamps from "./setVestingTimeStamps";
import WithdrawableTokensInfo from "./withdrawableTokensinfo";
import TransferOwnership from "./transferOwnership";

const Vesting = () => {
  const { VESTING_CONTRACT_ADDRESS, allocationType: distributionType } =
    projectDetails;
  const [ownerAddress, setOwnerAddress] = useState();
  const [recoveryTokenAddress, setRecoveryTokenAddress] = useState();
  const { library, active, account, chainId } = useWeb3React();
  const [recoveryTokenAmount, setRecoveryTokenAmount] = useState();

  useEffect(() => {
    if (account && library) {
      getOwnerAddress();
    }
  }, [library, account, chainId]);

  // const recoveryClick = (e) => {
  //   setRecoveryTokenAddress(e.target.value);
  // };

  // const recoveryExcessTokenAmount = (e) => {
  //   setRecoveryTokenAmount(e.target.value);
  // };

  const getOwnerAddress = async () => {
    const vestingContractInstance = await vestingContract(
      library,
      VESTING_CONTRACT_ADDRESS
    );
    const owner = await vestingContractInstance.owner();
    setOwnerAddress(owner);
  };

  const recoverExcessToken = async () => {
    const vestingContractInstance = await vestingContract(
      library,
      VESTING_CONTRACT_ADDRESS
    );

    const hexAmount = numAsHex(recoveryTokenAmount, { decimals: 18 });
    try {
      if (recoveryTokenAddress && recoveryTokenAmount) {
        const tx = await vestingContractInstance.recoverToken(
          recoveryTokenAddress,
          hexAmount
        );
        await tx.wait();
        console.log(tx);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full px-4 py-12 mx-auto overflow-hidden bg-gray-100 rounded-lg shadow sm:px-6 lg:px-8">
      <div className="px-0 py-4 mx-auto full sm:px-6 lg:px-4">
        <h2 className="pb-1 text-2xl font-bold tracking-tight text-left text-gray-900 sm:text-2xl">
          <span className="block">Vesting </span>
        </h2>
      </div>

      <div className="mt-5 md:mt-0 md:col-span-1">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-5 space-y-6 bg-white sm:p-6">
            <SetVestingTimeStamps />

            <div className="col-span-3 sm:col-span-2">
              <div className="items-center block px-4 py-2 text-sm font-medium text-white bg-gray-100 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary">
                <label className="block text-sm font-medium text-gray-700">
                  Owner
                </label>
                <div className="flex mt-1 rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                    Address
                  </span>
                  <input
                    value={ownerAddress}
                    type="text"
                    readOnly={true}
                    id="address"
                    className="flex-1 block w-full text-gray-500 border-gray-300 rounded-none rounded-r-md sm:text-sm"
                    placeholder="0x7D2..."
                  />
                </div>
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <div className="flex flex-col gap-2 my-3">
                <WithdrawableTokensInfo />
                <WithdrawableTokens />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2">
              {ownerAddress && (
                <TransferOwnership ownerAddress={ownerAddress} />
              )}
            </div>
            {/* <div className="col-span-3 sm:col-span-2">
              <div className="items-center block px-4 py-2 text-sm font-medium text-white bg-gray-100 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary">
                <label className="block text-sm font-medium text-gray-700">
                  Recover Excess Token
                </label>
                <div className="flex mt-1 rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                    Address
                  </span>
                  <input
                    onChange={recoveryClick}
                    value={recoveryTokenAddress}
                    type="text"
                    className="flex-1 block w-full text-gray-500 border-gray-300 rounded-none focus:ring-zee-primary focus:border-blue-500 rounded-r-md sm:text-sm"
                    placeholder="token address"
                  />
                </div>

                <div className="flex mt-1 rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                    Amount
                  </span>
                  <input
                    onChange={recoveryExcessTokenAmount}
                    value={recoveryTokenAmount}
                    type="text"
                    className="flex-1 block w-full text-gray-500 border-gray-300 rounded-none focus:ring-zee-primary focus:border-blue-500 rounded-r-md sm:text-sm"
                    placeholder="amount (uint256)"
                  />
                </div>
                <div className="mt-2">
                  <button
                    onClick={recoverExcessToken}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                  >
                    Write
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Vesting;
