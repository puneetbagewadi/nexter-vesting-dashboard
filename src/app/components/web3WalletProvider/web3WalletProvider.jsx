"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useMemo,
  useContext,
} from "react";
import { useAccount, useConnect, useNetwork, useDisconnect } from "wagmi";
import { Web3Provider } from "@ethersproject/providers";
import { SUPPORTED_CHAIN_IDS } from "@/app/constants";
const WalletWeb3Provider = createContext();
export default function Web3WalletProvider({ children }) {
  const [library, setLibrary] = useState(null);
  const [context, setContext] = useState(null);
  const { chain, chains } = useNetwork();
  const { disconnect } = useDisconnect();
  const { error, isLoading, pendingConnector, isError } = useConnect();
  const {
    address,
    connector,
    isConnected,
    isConnecting,
    isReconnecting,
    status,
  } = useAccount();

  const isUnSupportedNetwork = useMemo(
    () => (isConnected ? !SUPPORTED_CHAIN_IDS.includes(chain?.id) : false),
    [isConnected, chain, status]
  );

  const handleProvider = useCallback(async () => {
    const provider = await connector?.getProvider();
    const librarySigner = new Web3Provider(provider);
    librarySigner.pollingInterval = 12000;
    setLibrary(librarySigner);
  }, [connector, library]);

  useEffect(() => {
    setTimeout(() => {
      setContext({
        active: isConnected,
        account: address,
        chainId: chain?.id,
        chains,
        connector,
        error,
        isError,
        isConnecting,
        isReconnecting,
        status,
        isUnSupportedNetwork,
        library,
        isLoading,
        pendingConnector,
        disconnect,
      });
    }, 300);
  }, [library, status, chain, address]);

  useEffect(() => {
    if (connector) {
      handleProvider();
    }
  }, [isConnected, connector, address, chain]);

  return (
    <WalletWeb3Provider.Provider value={{ ...context }}>
      {children}
    </WalletWeb3Provider.Provider>
  );
}
const useWeb3React = () => useContext(WalletWeb3Provider);

export { Web3WalletProvider, useWeb3React };
