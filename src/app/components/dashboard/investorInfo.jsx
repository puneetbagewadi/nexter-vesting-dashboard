import { useState, useEffect } from "react";
import { Contract } from "@ethersproject/contracts";
import { projectDetails } from "@/app/projectConfig";
import distributionABI from "../../abi/investor-distribution.json";
import { useTokenBalance } from "@/app/hooks/tokenBalance";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";
import { formatToken, truncateDecimales } from "@/app/utils";

export default function InvestorInfo(props) {
  const investConfig = projectDetails;

  const { blacklistAccounts, setNoOfDays, noOfDays } = props;

  const { chainId, account, activate, active, library } = useWeb3React();
  const tokenList = investConfig.tokenByNetwork[chainId] || [];

  const distriTokenData = tokenList;

  const { tokenBalance } = useTokenBalance({
    ...distriTokenData,
  });

  const [loadingStatus, setLoadingStatus] = useState(true);

  const tokenDistributionContract = new Contract(
    investConfig.INVESTOR_DISTRIBUTION_ADDRESS,
    distributionABI,
    library?.getSigner()
  );

  const [userInfo, setUserInfo] = useState({
    roundDetails: [],
    set: false,
  });

  const [accountInfo, setAccountInfo] = useState([]);
  const getUserInfo = async () => {
    setLoadingStatus(true);
    try {
      const noofdays = await tokenDistributionContract.dayDiff();
      setNoOfDays(noofdays.toString());
    } catch (error) {
      console.log("dayDiff contract call failed: ", error);
      setNoOfDays(null);
    }
    investConfig.distributionType.forEach(async (item, index) => {
      const userInfoNew = await tokenDistributionContract.investorsInfo(
        index,
        account
      );
      const withdrawableTokensValue =
        await tokenDistributionContract.withdrawableTokens(index, account);

      setAccountInfo((info) => {
        setLoadingStatus(false);
        return [
          ...info,
          {
            round: item,
            roundNumber: index,
            exists: userInfoNew[0],
            withdrawnTokens: formatToken(userInfoNew[1], distriTokenData),
            tokensAllotment: formatToken(userInfoNew[2], distriTokenData),
            tgeTokens: formatToken(userInfoNew[3], distriTokenData),
            withdrawableTokens: formatToken(
              withdrawableTokensValue,
              distriTokenData
            ),
          },
        ];
      });
    });
  };

  useEffect(() => {
    if (!userInfo.set) {
      getUserInfo();
    }
  }, [chainId, account, library, active, userInfo]);

  useEffect(() => {
    if (accountInfo.length === investConfig.distributionType.length) {
      const userInfoNew = accountInfo[1];

      setUserInfo({
        ...userInfo,
        roundDetails: accountInfo,
        set: true,
      });
    }
  }, [accountInfo, account, chainId]);

  useEffect(() => {
    console.log({ userInfo });
  }, [userInfo]);

  const withdrawTokens = async (item) => {
    setLoadingStatus(true);
    if (blacklistAccounts.includes(account)) {
      setLoadingStatus(false);
      console.log("This acc is blacklisted");
      return;
    } else {
      const tx = await tokenDistributionContract.withdrawTokens(
        parseInt(item.roundNumber)
      );
      await tx.wait();
      setLoadingStatus(false);
      console.log(tx);
    }
  };

  const renderWalletDetails = () => {
    let addressExists = false;
    const roundsLength = userInfo.roundDetails.length;
    addressExists = userInfo.roundDetails.some((round) => round.exists);

    return !addressExists && !loadingStatus ? (
      <div className="p-4 my-4 rounded-md bg-red-50">
        <div className="flex justify-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              This address is not part of the investor list.
            </h3>
          </div>
        </div>
      </div>
    ) : (
      <>
        {addressExists && (
          <div className="my-4 overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 ">
              <h3 className="text-lg font-medium leading-6 text-black">
                Investor Information
              </h3>
            </div>

            <div className="border-t border-poly-gray-light">
              <dl>
                <div className="px-4 py-5 bg-white border-t border-poly-gray-light sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-bold text-black">Address</dt>
                  <dd className="mt-1 text-black break-words text-md sm:mt-0 sm:col-span-2">
                    <a
                      target="_blank"
                      href={`${investConfig?.explorerUrl}/address/${account}`}
                    >
                      {account}
                    </a>
                  </dd>
                </div>

                <div className="px-4 py-5 bg-white border-t border-poly-gray-light sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-bold text-black">
                    {distriTokenData?.symbol} in wallet
                  </dt>
                  <dd className="mt-1 text-black text-md sm:mt-0 sm:col-span-2">
                    {tokenBalance} {distriTokenData?.symbol}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {userInfo.roundDetails.map((item, key) => {
        if (!item.exists) {
          return "";
        } else {
          return (
            <dl
              key={item.roundNumber}
              className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2"
            >
              <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg shadow bg-poly-gray">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-lg font-medium text-gray-100 truncate">
                    <span className="text-sm font-thin">
                      {item.round} Allotment
                    </span>
                    <span className="">
                      &nbsp;-&nbsp;{item.tokensAllotment.toFormat()}{" "}
                      {distriTokenData.symbol}
                    </span>
                  </dt>

                  <dd className="mt-1 font-semibold text-white break-words text-md">
                    <span className="font-thin ">TGE Tokens</span>
                    &nbsp;-&nbsp;
                    {truncateDecimales(item.tgeTokens.toString())}{" "}
                    {distriTokenData.symbol}
                  </dd>
                  <dd className="mt-1 font-semibold text-white break-words text-md">
                    <span className="font-thin ">Withdrawn Tokens</span>
                    &nbsp;-&nbsp;
                    {truncateDecimales(item.withdrawnTokens.toString())}{" "}
                    {distriTokenData.symbol}
                  </dd>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg shadow bg-poly-gray">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-lg font-medium text-gray-100 truncate">
                    <span>Withdrawable Tokens</span> &nbsp;
                    <span className="text-sm font-thin">({item.round})</span>
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-white">
                    {noOfDays != null
                      ? truncateDecimales(item.withdrawableTokens.toString())
                      : "0"}{" "}
                    {distriTokenData.symbol}
                  </dd>
                  {noOfDays != null &&
                    item.withdrawableTokens > 0 &&
                    !blacklistAccounts.includes(account) && (
                      <button
                        onClick={() => {
                          if (blacklistAccounts.includes(account)) {
                            console.log("this account is blacklisted");
                          } else {
                            withdrawTokens(item);
                          }
                        }}
                        className="inline-flex items-center justify-center px-5 py-1.5 my-4 text-base font-medium text-white border border-transparent rounded-md bg-poly-button hover:bg-blue-500"
                      >
                        Withdraw {distriTokenData.symbol}
                      </button>
                    )}
                </div>
              </div>
            </dl>
          );
        }
      })}

      {renderWalletDetails()}
    </>
  );
}
