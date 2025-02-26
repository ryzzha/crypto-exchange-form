"use client";

import { useWalletContext } from "@/context/WalletContext";

export default function Navigation() {
  const { address, connectWallet, loadingWallet } = useWalletContext();


  return (
    <nav className="w-full flex items-center justify-between px-10 py-5 bg-gray-900 text-white">
      <h1 className="text-lg font-bold">Exchange</h1>
      <div className="flex items-center gap-4">
        {address ? (
          <span className="text-sm bg-gray-800 px-3 py-1 rounded">{address.slice(0, 6)}...{address.slice(-4)}</span>
        ) : (
          <button
            onClick={() => connectWallet()}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded transition"
          >
            {loadingWallet ? "loading..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </nav>
  );
}
