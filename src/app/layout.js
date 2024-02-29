import "./globals.css";
import { Quicksand } from "next/font/google";
import Web3WalletConfig from "./components/web3modal/web3WalletConfig";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Script from "next/script";
import Web3WalletProvider from "./components/web3WalletProvider/web3WalletProvider";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata = {
  title: "Vesting Dashboard",
  description: "",
  icons: {
    icon: "/favicon.svg", // /public path
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <Web3WalletConfig>
          <Web3WalletProvider>
            <div className="flex flex-col justify-between h-screen">
              <Header />
              <main className="relative w-full max-w-screen-xl px-4 pb-6 mx-auto -mt-32 sm:px-6 lg:pb-16 lg:px-8">
                {children}
              </main>
              <Footer />
            </div>
          </Web3WalletProvider>
        </Web3WalletConfig>
      </body>
    </html>
  );
}
