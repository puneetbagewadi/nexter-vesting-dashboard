"use client";
import Vesting from "../components/vesting/vesting";
import { useWeb3React } from "../components/web3WalletProvider/web3WalletProvider";
import ConnectWalletBtn from "../components/button/connectWalletBtn";
import BlockNumber from "../components/blockNumber/blockNumber";
import OwnerInformation from "../components/ownerInformation/ownerInformation";

const AdminPage = () => {
  const { active, library, account } = useWeb3React();

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full px-4 py-12 mx-auto overflow-hidden bg-gray-100 rounded-lg shadow sm:px-6 lg:px-8">
        <div className="px-0 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="pb-1 text-2xl font-bold tracking-tight text-left text-gray-900 sm:text-2xl">
            <span className="block">Admin Panel </span>
          </h2>

          <section className="my-10">
            {account ? <OwnerInformation /> : <ConnectWalletBtn />}
          </section>
        </div>
        {active && <BlockNumber />}
      </div>
      <Vesting />
    </div>
  );
};
export default AdminPage;
