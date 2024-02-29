import React, { useState, useEffect, useCallback } from "react";
import { numAsHex, vestingContract } from "../../utils/index";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";
import BlockNumber from "../blockNumber/blockNumber";
import { projectDetails } from "../../projectConfig/index";
import WithdrawableTokens from "./withdrawableTokens";
import SetVestingTimeStamps from "./setVestingTimeStamps";
import WithdrawableTokensInfo from "./withdrawableTokensinfo";
import TransferOwnership from "./transferOwnership";

const Vesting = () => {
  const { VESTING_CONTRACT_ADDRESS, allocationType: distributionType } =
    projectDetails;
  const [distributionIndex, setDistributionIndex] = useState();
  const [ownerAddress, setOwnerAddress] = useState();
  const [recoveryTokenAddress, setRecoveryTokenAddress] = useState();
  const { library, active, account, chainId } = useWeb3React();
  const [recoveryTokenAmount, setRecoveryTokenAmount] = useState();
  // const [tokensDistributionData, setTokensDistributionData] = useState(null);
  // const [contractInstance, setVestingContractInstance] = useState(null);

  // const setContractInstance = useCallback( async () => {
  //   const instance = await vestingContract(
  //     library,
  //     VESTING_CONTRACT_ADDRESS
  //   );
  //   setVestingContractInstance(instance)
  // },[library])

  // useEffect(() => {
  //   if (library) {
  //     setContractInstance()
  //   }
  // }, [library,setContractInstance])

  // const handleclick = async (e, distributionIndex) => {
  //   const vestingContractInstance = await vestingContract(
  //     library,
  //     VESTING_CONTRACT_ADDRESS
  //   );
  //   try {
  //     // if(withdrawTokens){
  //     const tx = await vestingContractInstance.withdrawTokens(
  //       distributionIndex
  //     );
  //     await tx.wait();
  //     console.log(tx);
  //     // }
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   setDistributionIndex(distributionIndex);
  // };

  useEffect(() => {
    if (account && library) {
      getOwnerAddress();
    }
  }, [library, account, chainId]);

  const recoveryClick = (e) => {
    setRecoveryTokenAddress(e.target.value);
  };

  const recoveryExcessTokenAmount = (e) => {
    setRecoveryTokenAmount(e.target.value);
  };

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

    const hexAmount = numAsHex(recoveryTokenAmount, {decimals: 18})
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

  // const getWithdrawableTokens = useCallback( async (index) => {

  //   const vestingContractInstance = await vestingContract(
  //     library,
  //     VESTING_CONTRACT_ADDRESS
  //   );
  // const tokensAvailable = await vestingContractInstance.withdrawableTokens(index)
  // const numberOfDays = await vestingContractInstance.getDays()
  // const numberOfMonths = await vestingContractInstance.getMonths()
  // const tokens = formatToken(tokensAvailable, {decimals:18}).toString();
  //    const data  = {
  //     distributionType:distributionType[index],
  //     tokensAvailable:tokens,
  //     numberOfDays:numberOfDays?.toString(),
  //     numberOfMonths:numberOfMonths?.toString()
  //    };
  //   setTokensDistributionData(data)
  // })
  // const getVestingInfo = ({distributionType,tokensAvailable,numberOfMonths,numberOfDays }) => {
  //   return <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
  //   <table className="min-w-full divide-y divide-gray-300">
  //     <thead>
  //       <tr>
  //         <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900 sm:pl-0">
  //         Distribution Type
  //         </th>
  //         <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900 sm:pl-0">
  //         Tokens Available
  //         </th>
  //         <th scope="col" className="px-3 py-3.5 text-left text-base font-semibold text-gray-900">
  //           Number of Days
  //         </th>
  //         <th scope="col" className="px-3 py-3.5 text-left text-base font-semibold text-gray-900">
  //           Number of Months
  //         </th>
  //       </tr>
  //     </thead>
  //     <tbody className="divide-y divide-gray-200">
  //         <tr key={"info"}>
  //           <td className="px-3 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">{distributionType}</td>
  //           <td className="px-3 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">{ commaNumber(tokensAvailable)}</td>
  //           <td className="px-3 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">{numberOfDays}</td>
  //           <td className="px-3 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">{numberOfMonths}</td>
  //         </tr>
  //     </tbody>
  //   </table>
  // </div>
  // }

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
            {/* <div className="mt-5 md:mt-0 md:col-span-2">
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
                              onClick={setInitialTimes}

                              className="inline-flex justify-center px-4 py-2 mt-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                            >
                              Set Time
                            </button>
                          </div>
                        </div>
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
                                  onChange={(e) => updateInitialTimestamp(e.target.value)}
                                  type="text"
                                  name="epoch"
                                  id="updateInitialTimestamp"
                                  className="flex-1 block w-full border-gray-300 rounded-none focus:ring-zee-primary focus:border-zee-primary rounded-r-md sm:text-sm"
                                  placeholder="0163454532522"
                                />
                              </div>
                            </div>
                            <button
                              onClick={updateInitialTime}
                              className="inline-flex justify-center px-4 py-2 mt-2 text-sm font-medium text-white capitalize border border-transparent rounded-md shadow-sm bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                            >
                              update Time
                            </button>


                          </div>
                        </div>
                  </div>
              
                </div>
          </div> */}
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
              {/* <div className="items-center block px-4 py-2 text-sm font-medium text-white bg-gray-100 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary">
                  <label className="block text-sm font-medium text-gray-700">
                    withdrawTokens{" "}
                  </label>{" "}
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      value={distributionIndex}
                      readOnly={true}
                      id="distribution"
                      className="flex-1 block text-gray-500 border-gray-300 rounded-none focus:ring-zee-primary focus:border-blue-500 rounded-r-md sm:text-sm"
                      placeholder="uint256"
                    />
                  </div>{" "}
                  <div className="grid text-sm rounded-md md:grid-cols-6 grid-col-2 lg:max-w-none">
                    {" "}
                    {distributionType.map((buttonName, index) => {
                      return (
                        <div className="m-2 mx-auto" key={buttonName}>
                          <button
                            onClick={(e) => {
                              // TODO enable the below callback in prod 
                                ///handleclick(e, index)
                                setTokensDistributionData(null)
                                getWithdrawableTokens(index)

                            }}
                            variant={"button-data-card-div"}
                            content={"More"}
                            className="flex justify-center px-20 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-zee-primary w-28 hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                          >
                            {buttonName}
                          </button>
                        </div>
                      );
                    })}{" "}
                  </div>{" "}
                </div>{" "} */}
              {/* <div className="">
                   { tokensDistributionData && getVestingInfo(tokensDistributionData)}
                    </div> */}
            </div>
            <div className="col-span-3 sm:col-span-2">
              {ownerAddress && (
                <TransferOwnership ownerAddress={ownerAddress} />
              )}
            </div>
            <div className="col-span-3 sm:col-span-2">
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
              {active && <BlockNumber />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Vesting;
