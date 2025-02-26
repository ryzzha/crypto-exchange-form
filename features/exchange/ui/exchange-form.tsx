"use client"

import { ExchangeIcon } from "@/components/exchange-icon"
import { useEffect, useState, useRef } from "react"
import { getExchangeRate } from "../api/get-exchange-rate";
import { CurrencySelect } from "@/components/currency-select";
import { useWalletContext } from "@/context/WalletContext";
import { ethers } from "ethers";

const ERC20_ABI = [
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
];

const currencies = [
    { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", network: "ethereum", contractAddress: null  },
    { id: "usd", name: "USD Coin", symbol: "USDC", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", network: "ethereum", contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }, 
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", network: "bitcoin", contractAddress: null  },
    { id: "tether", name: "Tether TRC20", symbol: "USDT-TRC20", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", network: "ethereum", contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7"  },
 ];
  
export function ExchangeForm() {
   const { provider, signer } = useWalletContext();
   const [coursetype, setCoursetype] = useState<"best" | "fixed">("best")
   const [timeBeforeUpdate, setTimeBeforeUpdate] = useState(30)
   const [fromCurrency, setFromCurrency] = useState(currencies[0])
   const [toCurrency, setToCurrency] = useState(currencies[1])
   const [exchangeRate, setExchangeRate] = useState(0)
   const [fromAmount, setFromAmount] = useState(1)
   const [toAmount, setToAmount] = useState(2)
   const [selectedTokenBalance, setSelectedTokenBalance] = useState(0);
   const [email, setEmail] = useState("")
   const [address, setAddress] = useState("")

   const timerRef = useRef<NodeJS.Timeout | null>(null); 

   const fetchExchangeRate = async () => {
        const exchangeRate = await getExchangeRate(fromCurrency.id, toCurrency.id);
        
        console.log(exchangeRate);
        setExchangeRate(exchangeRate ?? 0);
        setToAmount(fromAmount * exchangeRate)
        
    }

    const getSelectedCoinBalance = async() => {
        if (!signer) return 0;

        // const provider = providersByNetwork[fromCurrency.network];
        if (!provider) return 0;

        try {
            if (!fromCurrency.contractAddress) {
              const balance = await provider.getBalance(await signer.getAddress());
              console.log("eth balance in wei")
              console.log(balance)
              setSelectedTokenBalance(Math.floor(Number(ethers.formatEther(balance)) * 100000) / 100000);
            } else {
              const tokenContract = new ethers.Contract(fromCurrency.contractAddress, ERC20_ABI, signer);
              const balance = await tokenContract.balanceOf(await signer.getAddress());
              console.log("token balance in units")
              console.log(balance)
              setSelectedTokenBalance(Number(ethers.formatUnits(balance, 18)));
            }
          } catch (error) {
            console.error("Error fetching balance:", error);
            return 0;
          }
    }

    useEffect(() => {
        timerRef.current = setInterval(() => {
          setTimeBeforeUpdate((prev) => {
            if (prev <= 1) {
              fetchExchangeRate(); 
              return 30; 
            }
            return prev - 1;
          });
        }, 1000);
    
        return () => {
          if (timerRef.current) clearInterval(timerRef.current);
        };
      }, []);
    

    useEffect(() => {
        fetchExchangeRate();
        getSelectedCoinBalance();
    }, [provider, signer, fromCurrency, toCurrency, fromAmount])

 return (
    <div className="w-full flex flex-col items-center gap-10 p-10 bg-white border-2 border-gray-100 shadow-xl rounded-xl">
        <div className="w-full p-5 border-2 border-gray-200 bg-gray-100 rounded-xl">
            <div className="w-full flex items-center gap-2">
                <span className="mr-3 text-gray-400 font-semibold">Select course type:</span>
                <button 
                    className={`px-5 py-1 font-semibold rounded-xl ${coursetype == "best" ? "bg-gray-600 text-white" : "bg-gray-300 text-black"} `} 
                    onClick={() => setCoursetype("best")}
                >Best</button>
                <button  
                    className={`px-5 py-1 font-semibold rounded-xl ${coursetype == "fixed" ? "bg-gray-600 text-white" : "bg-gray-300 text-black"} `}
                    onClick={() => setCoursetype("fixed")}
                >Fixed</button>
                <div className="w-[1px] h-7 mx-5 bg-gray-300"></div>
                <div className="flex items-center gap-2 font-semibold">
                  1 {fromCurrency.symbol} = {exchangeRate} {toCurrency.symbol}
                </div>
                <div className="flex items-center gap-1 ml-auto text-gray-400 font-semibold">
                    <span>Time before course has been updated:</span>
                    <span className="text-red-500">{timeBeforeUpdate}</span>
                </div>
            </div>
        </div>

        <div className="w-full flex flex-col gap-5">
            <div className="w-full flex items-center gap-5">
                <div
                    className="flex flex-1 border-2 relative rounded-xl transition-colors 
                    border-gray-100 focus-within:border-gray-500 p-1"
                >
                    <span className="absolute -top-8">
                        {signer ? `Your ${fromCurrency.symbol} balance: ${selectedTokenBalance}` : "Connect wallet to see balance"}  
                    </span>
                    <div className="w-1/2 px-5 py-2 flex flex-1 flex-col" >
                        <span>Give</span>
                        <input
                            className="outline-none bg-transparent"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(Number(e.target.value))}
                        />
                    </div>
                    <div className="w-1/2 bg-gray-900/85 rounded-xl" >
                         <CurrencySelect selectedCurrency={fromCurrency} onSelect={setFromCurrency} currencies={currencies} />
                    </div>
                </div>

                <div className="p-3 bg-gray-700 hover:bg-gray-500  transition-colors  rounded-xl"> <ExchangeIcon /> </div>

                <div
                    className={`flex flex-1 border-2 rounded-xl relative border-gray-100 focus-within:border-gray-500 p-1`}
                >
                    <div className="w-1/2 px-5 py-2 flex flex-1 flex-col" >
                        <span>Receive</span>
                        <input
                            className="outline-none"
                            value={toAmount}
                            readOnly
                        />
                    </div>
                    <div className="w-1/2 bg-gray-900/85 rounded-xl" >
                        <CurrencySelect selectedCurrency={toCurrency} onSelect={setToCurrency} currencies={currencies} />
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-between gap-5">
                <div
                    className={`flex flex-1 flex-col px-5 py-2 border-2 rounded-xl border-gray-100 focus-within:border-gray-500`}
                    >
                    <span>Email</span>
                    <input
                        className="outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div
                    className={`flex flex-1 flex-col px-5 py-2 border-2 rounded-xl border-gray-100 focus-within:border-gray-500`}
                    >
                    <span>Wallet address in {toCurrency.network} network</span>
                    <input
                        className="outline-none"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div className="w-full flex justify-center">
            <button className="px-8 py-3 text-white bg-red-600 hover:bg-red-500 rounded-xl">PROCEED TO PAYMENT</button>
        </div>
    </div>
 )
}