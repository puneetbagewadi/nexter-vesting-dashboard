"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Contract } from "@ethersproject/contracts";
import distributionABI from "../../abi/investor-distribution.json";
import { projectDetails } from "../../projectConfig";
import {
  arrayToObjectKeyIndexMap,
  formatToken,
  getUtcDateFormat,
  numAsHex,
} from "../../utils";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";

const OwnerInformation = () => {
  const { chainId, library, account, isUnSupportedNetwork } = useWeb3React();
  const {
    INVESTOR_DISTRIBUTION_ADDRESS,
    tokenByNetwork: TOKENS_BY_NETWORK,
    distributionType,
  } = projectDetails;

  const tokenList = TOKENS_BY_NETWORK[chainId];
  console.log(tokenList);
  const [tokenData, setTokenData] = useState(tokenList);
  const [epochvalue, setEpochValue] = useState("0");
  const [investorvalue, setInvestorValue] = useState("");
  const [removeinvestor, setRemoveInvestor] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [timeStamp, setTimestamp] = useState("");
  const [currentOwner, setCurrentOwner] = useState("");
  const [error, setError] = useState(false);
  const [investorAddressDetails, setInvestorAddressDetails] = useState("");
  const [investorDetails, setInvestorDetails] = useState({});
  const [allocationErr, setAllocationErr] = useState("");
  const [allocationTypeIndex, setAllocationTypeIndex] = useState();

  const distriTokenData = tokenList;

  const allocationTypeIndexMapping = arrayToObjectKeyIndexMap(distributionType);

  let distriContract;
  distriContract = new Contract(
    INVESTOR_DISTRIBUTION_ADDRESS,
    distributionABI,
    library?.getSigner()
  );

  const getInitialTimestamp = async () => {
    const timestamp = await distriContract.getInitialTimestamp();
    setTimestamp(timestamp);
  };

  const getCurrentOwner = async () => {
    const contractOwner = await distriContract.owner();
    setCurrentOwner(contractOwner);
  };

  const setEpoch = () => {
    distriContract.setInitialTimestamp(epochvalue);
  };

  const setInvestor = () => {
    if (!investorvalue) {
      alert("Add entries");
      return;
    }

    console.log(investorvalue);
    const setInvestor = investorvalue.replace(/(\r\n|\n|\r)/gm, "").split(",");
    const addresses = [];
    const amount = [];
    const withdrawnAmount = [];
    const round = [];
    const tgeTokens = [];
    setInvestor.forEach((item) => {
      const indValues = item.split("=");
      const amountBN = numAsHex(indValues[1].trim().toString(), tokenData);
      const withdrawnAmountBN = numAsHex(
        indValues[2].trim().toString(),
        tokenData
      );
      const tgeTokensHex = numAsHex(indValues[4].trim().toString(), tokenData);

      addresses.push(indValues[0].trim().toString());
      amount.push(amountBN);
      withdrawnAmount.push(withdrawnAmountBN);
      round.push(indValues[3].trim().toString());
      // round.push(
      //   allocationTypeIndexMapping[
      //     indValues[3].trim().toString()?.toUpperCase()
      //   ]
      // );
      tgeTokens.push(tgeTokensHex);
    });

    if (addresses.length === amount.length) {
      try {
        distriContract.addInvestors(
          addresses,
          amount,
          withdrawnAmount,
          round,
          tgeTokens
        );
      } catch (error) {
        console.log("error :", error);
      }
    } else {
      alert("Values not matching the format");
    }
  };

  const removeInvestor = () => {
    if (!removeinvestor) {
      setError("Add entries");
      return;
    }

    const removeInvestor = removeinvestor
      .replace(/(\r\n|\n|\r)/gm, "")
      .split(",");
    let address;
    let round;

    removeInvestor.forEach((item) => {
      const indValues = item.split("=");
      address = indValues[0];
      round = indValues[1];
    });

    if (address && round) {
      distriContract.removeInvestor(address, round);
    } else {
      setError("Values not matching the format");
    }
  };

  const releaseTokens = () => {
    distriContract.releaseTokens();
  };

  const transferOwnership = () => {
    distriContract.transferOwnership(transferAddress);
  };

  // Get Investor Details
  const getInvestorDetails = async () => {
    const tokenAddr = investorAddressDetails.trim().toString();
    const details =
      allocationTypeIndex === undefined
        ? setAllocationErr("Select allocation type")
        : await distriContract.investorsInfo(allocationTypeIndex, tokenAddr);
    allocationTypeIndex !== undefined && setInvestorDetails(details);
  };

  const investorDetailsData = [
    {
      label: "Tokens Allotment",
      id: "tokensAllotment",
      value: formatToken(
        investorDetails.tokensAllotment,
        distriTokenData
      )?.toString(),
    },
    {
      label: "Withdrawn Tokens",
      id: "withdrawnTokens",
      value: formatToken(
        investorDetails.withdrawnTokens,
        distriTokenData
      )?.toString(),
    },
    {
      label: "TGE Tokens",
      id: "tgeTokens",
      value: formatToken(
        investorDetails.tgeTokens,
        distriTokenData
      )?.toString(),
    },
    {
      label: "Allocation Type",
      id: "allocation_type",
      value: distributionType[investorDetails.allocationType],
    },
  ];
  useEffect(() => {
    getInitialTimestamp();
    getCurrentOwner();
  }, [library]);

  return (
    <>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Initial timestamp
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Time when the distribution started. Use{" "}
              <Link
                target={"_blank"}
                href="https://www.epochconverter.com/"
                className="text-zee-primary"
              >
                Epoch converter
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 space-y-6 bg-white sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="epoch"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Initialized Time
                  </label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                      UTC Date
                    </span>
                    <input
                      value={getUtcDateFormat(timeStamp)}
                      readOnly
                      type="text"
                      name="epoch"
                      id="epoch"
                      className="flex-1 block w-full border-gray-300 rounded-none focus:ring-zee-primary focus:border-zee-primary rounded-r-md sm:text-sm"
                      placeholder="0163454532522"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Set initial timestamp
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Time when the distribution starts. Use{" "}
                <Link
                  target={"_blank"}
                  href="https://www.epochconverter.com/"
                  className="text-zee-primary"
                >
                  Epoch converter
                </Link>
              </p>
            </div>
          </div>
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
                        Epoch
                      </span>
                      <input
                        value={epochvalue}
                        onChange={(e) => setEpochValue(e.target.value)}
                        type="text"
                        name="epoch"
                        id="epoch"
                        className="flex-1 block w-full border-gray-300 rounded-none focus:ring-zee-primary focus:border-zee-primary rounded-r-md sm:text-sm"
                        placeholder="0163454532522"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                <button
                  onClick={setEpoch}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                >
                  Set Time
                </button>
              </div>
              {/* <div className="p-6">
                <UpdateTimeStamps type={"admin"} />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add investor
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Enter address=amount comma separated.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700"
                    >
                      [Address, Token allotment, Withdrawn tokens, Allocation
                      type, Tge-Tokens]
                    </label>
                    <div className="mt-1">
                      <textarea
                        value={investorvalue}
                        onChange={(e) => setInvestorValue(e.target.value)}
                        id="investor"
                        name="investor"
                        rows="3"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-zee-primary focus:border-zee-primary sm:text-sm placeholder:text-opacity-5s placeholder:text-gray-400"
                        placeholder="0x314ab97b76e39d63c78d5c86c2daf8eaa306b182=3141592=0,  0x141ca95b6177615fb1417cf70e930e102bf8f584=1.41421=1, 0x141ca95b6177615fb23456f70e930e102bf8f584=12312=0"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                <button
                  onClick={setInvestor}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                >
                  Add Investor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Remove investor
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Enter address=allocationType comma separated.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address=allocationType
                    </label>
                    <div className="mt-1">
                      <textarea
                        value={removeinvestor}
                        onChange={(e) => setRemoveInvestor(e.target.value)}
                        id="removeinvestor"
                        name="removeinvestor"
                        rows="1"
                        placeholder="0x314ab97b76e39d63c78d5c86c2daf8eaa306b182=0"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-zee-primary focus:border-zee-primary sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <p className="px-1 text-red-600">{error} </p>
              </div>
              <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                <button
                  onClick={removeInvestor}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-zee-primary hover:bg-zee-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                >
                  Remove investor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Transfer ownership
              </h3>
              <p className="mt-1 text-sm text-red-600">
                Make sure its the correct account
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label
                      htmlFor="transfer_address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      value={transferAddress}
                      onChange={(e) => setTransferAddress(e.target.value)}
                      type="text"
                      name="transfer_address"
                      id="transfer_address"
                      autoComplete="transfer-address"
                      placeholder={`Current owner: ${currentOwner}`}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-zee-primary focus:border-zee-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                <button
                  onClick={transferOwnership}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Get Investor Details
              </h3>
              <p className="mt-1 text-sm text-red-600"></p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-4">
                    <label
                      htmlFor="recover_token_address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Investor Address
                    </label>
                    <input
                      value={investorAddressDetails}
                      onChange={(e) => {
                        setInvestorAddressDetails(e.target.value);
                        setInvestorDetails({});
                      }}
                      type="text"
                      id="recover_token_address"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-zee-primary focus:border-zee-primary sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="recover_token_address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Allocation Type
                    </label>
                    <select
                      onChange={(e) => {
                        setAllocationTypeIndex(e.target.value);
                        setAllocationErr("");
                      }}
                      className="inline-flex justify-center w-full px-4 py-2 mt-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                      <option>Select Allocation Type</option>
                      {distributionType.map((item, index) => {
                        return (
                          <option key={index} value={index}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                    <p className="mt-1 text-sm text-red-600">{allocationErr}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                <button
                  onClick={getInvestorDetails}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zee-primary"
                >
                  Get details
                </button>
              </div>
              {Object.keys(investorDetails).length ? (
                <>
                  {investorDetails.exists ? (
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        {investorDetailsData.map((item) => {
                          return (
                            <div className="col-span-3" key={item.id}>
                              <label
                                htmlFor="recover_token_address"
                                className="block text-sm font-medium text-gray-700"
                              >
                                {item.label}
                              </label>
                              <input
                                value={item.value}
                                type="text"
                                id={item.id}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-zee-primary focus:border-zee-primary sm:text-sm"
                                readOnly
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <p className="text-sm font-medium text-red-800">
                        This address is not part of the investor list.
                      </p>
                    </div>
                  )}{" "}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerInformation;
