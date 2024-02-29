"use client";
import React, { useState } from "react";
import Link from "next/link";
import ConnectWalletBtn from "../button/connectWalletBtn";
import EthBalance from "../balance/ethBalance";
import { useAccount, useNetwork } from "wagmi";
import { shorter } from "@/app/utils";
import { projectDetails } from "@/app/projectConfig";
import Image from "next/image";
import { useWeb3Modal } from "@web3modal/react";
import { usePathname } from "next/navigation";
import { TESTNET_CHAIN_ID } from "@/app/constants";
import { useWeb3React } from "../web3WalletProvider/web3WalletProvider";

export default function Header() {
  const { open, isOpen } = useWeb3Modal();
  const pathName = usePathname();
  const { isUnSupportedNetwork, active, account, chainId } = useWeb3React();

  return (
    <header className="relative pb-32">
      <nav className="relative z-10 border-b border-opacity-50 border-zee-primary-hover lg:border-none bg-black">
        <div className="px-2 mx-auto max-w-7xl sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between h-16 lg:border-b lg:border-zee-primary-hover lg:border-opacity-50">
            <div className="flex items-center flex-1 px-2 lg:px-0">
              <Link href="https://nexter.fi/" className="flex items-center">
                <Image
                  className="block p-1 max-w-[190px]"
                  src="/images/nexter_logo.png"
                  alt="Nexter"
                  width="150"
                  height="100"
                />
              </Link>
            </div>

            <div className="md:flex">
              {active ? (
                <div className="flex items-center gap-1">
                  {isUnSupportedNetwork ? (
                    <button className="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-md sm:inline">
                      Unsupported Network
                    </button>
                  ) : (
                    ""
                  )}

                  <button
                    onClick={open}
                    className="inline-flex items-center px-4 py-2 text-sm font-normal text-white rounded-md bg-zee-primary "
                  >
                    {TESTNET_CHAIN_ID.includes(chainId) ? (
                      <span className="hidden pr-2 font-bold text-red-500 sm:inline">
                        Testnet
                      </span>
                    ) : (
                      ""
                    )}{" "}
                    Connected {shorter(account)} <EthBalance />
                  </button>
                </div>
              ) : (
                // <button
                //   onClick={connectWallet}
                //   className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-zee-primary-hover hover:text-white bg-zee-primary"
                // >
                //   Connect Wallet
                // </button>

                <ConnectWalletBtn />
              )}
            </div>
          </div>
        </div>
      </nav>
      <div
        className="absolute inset-x-0 inset-y-0 flex justify-center w-full overflow-hidden transform -translate-x-1/2 bg-white left-1/2"
        aria-hidden="true"
      ></div>

      <div className="relative py-10 min-h-[8.125rem] flex-col justify-center">
        <div className="flex items-center px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 justify-left">
          {/* <h1 className="mr-2 text-xl font-bold text-black sm:text-3xl">
            {pathName.split("/")[1].toLowerCase() == "" ? "Investor " : "Admin"}{" "}
            |{" "}
          </h1>
          <div>
            <Image
              src={projectDetails.brand.brand_logo}
              alt={projectDetails.brand.name}
              height="50"
              width="100"
            />
          </div>
          <span className="pl-2 text-lg font-bold text-black sm:text-3xl">
                {projectDetails.brand.name}
          </span> */}
        </div>
      </div>
    </header>
  );
}
