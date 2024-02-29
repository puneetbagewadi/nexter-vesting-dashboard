import { useEffect,useState } from 'react'
import { useBlockNumber } from 'wagmi'
import { useWeb3React } from '../web3WalletProvider/web3WalletProvider'

const BlockNumber = () => {
    const { active, library } = useWeb3React()
    const [blockNumber, setBlockNumber] = useState();

    useEffect(() => {
        if (library) {
            try {
                library.on("block", (blockNumber) => {
                    setBlockNumber(blockNumber);
                });
            } catch (error) {
                setBlockNumber();
                console.log("setBlockNumber error :", error);
            }
        }
    }, [library])

    return (
        active ? (
            <div className="flex items-center justify-end">
                <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full bg-green-600 rounded-full opacity-75 animate-ping"></span>
                    <span className="relative inline-flex w-2 h-2 bg-green-600 rounded-full"></span>
                </span>
                <span className="pl-2 text-green-600">
                    {blockNumber}
                </span>
            </div>
        ) : <></>
    )

}
export default BlockNumber
