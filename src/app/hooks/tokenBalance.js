
import {useEffect, useState} from 'react';
import { useBalance } from 'wagmi';
import { useWeb3React } from '../components/web3WalletProvider/web3WalletProvider';
import commaNumber from 'comma-number';

export const useTokenBalance = ({address}) => {
    const [tokenBalance, setTokenBalance] = useState(0);
    const {account} = useWeb3React();

    const { data, isError, isLoading:balanceLoading } = useBalance({
      address:account,
      token:address,
      onSuccess(data) {
        setTokenBalance(commaNumber(parseFloat(data?.formatted)))
      },
      onError(error) {
        setTokenBalance(0)
      },
    })
    return {tokenBalance,balanceLoading,isError}
};