"use client"

import { createContext, useContext, useState } from "react";
import { ethers, JsonRpcSigner, Provider } from "ethers";

interface WalletContextProps {
    provider: Provider | null;
    signer: JsonRpcSigner | null;
    address: string | null;
    loadingWallet: boolean | null;
    connectWallet: () => Promise<void>; 
}

const WalletContext = createContext<WalletContextProps>({
    provider: null,
    signer: null,
    address: null,
    loadingWallet: false,
    connectWallet: async () => {},
});

type WalletState = {
    provider: Provider | null;
    signer: JsonRpcSigner | null;
    address: string | null;
    loadingWallet: boolean;
};

export const WalletProvider = ({ children }: { children: React.ReactNode  }) => {
    const [state, setState] = useState<WalletState>({
        provider: null,
        signer: null,
        address: null,
        loadingWallet: false,
    });

    const connectWallet = async () => {
        console.log("connectWallet work");
      
        if (typeof window === "undefined" || !window.ethereum) {
          alert("Install MetaMask!");
          return;
        }
      
        try {
          setState(prev => ({ ...prev, loadingWallet: true }));
          
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
      
          const accounts = await browserProvider.send("eth_requestAccounts", []);
          if (accounts.length === 0) throw new Error("Користувач не підключив гаманець");
          
          const signer = await browserProvider.getSigner();
          const address = await signer.getAddress();
    
          console.log("Гаманець підключено:", await signer.getAddress());
      
          setState(prev => ({
            ...prev,
            provider: browserProvider,
            signer,
            address, 
            loadingWallet: false,
          }));
    
        } catch (error) {
          console.error("Error connecting wallet:", error);
        } 
      }; 

    return (
        <WalletContext.Provider value={{ ...state, connectWallet }} >{children}</WalletContext.Provider>
    )
};
    
export const useWalletContext = () => {
    return useContext(WalletContext);
};
