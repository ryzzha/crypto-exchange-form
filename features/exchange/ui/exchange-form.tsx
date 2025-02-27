"use client"

import { ExchangeIcon } from "@/components/exchange-icon"
import { useEffect, useState, useRef, useCallback } from "react"
import { getExchangeRate } from "../api/get-exchange-rate";
import { CurrencySelect } from "@/components/currency-select";
import { useWalletContext } from "@/context/WalletContext";
import { ethers } from "ethers";
import { currencies } from "@/shared/constants";
import { ICurrency } from "../model/types";
import { formatTime } from "@/shared/helpers";

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
  
export function ExchangeForm() {
   const { provider, signer } = useWalletContext();
   const [coursetype, setCoursetype] = useState<"best" | "fixed">("best")
   const [timeBeforeUpdate, setTimeBeforeUpdate] = useState(30)
   const [fromCurrency, setFromCurrency] = useState<ICurrency>(currencies[0])
   const [toCurrency, setToCurrency] = useState<ICurrency>(currencies[1])
   const [exchangeRate, setExchangeRate] = useState(0)
   const [fromAmount, setFromAmount] = useState<number | null>(null)
   const [toAmount, setToAmount] = useState<number | null>(null)
   const [selectedTokenBalance, setSelectedTokenBalance] = useState(0);
   const [email, setEmail] = useState("")
   const [address, setAddress] = useState("")

   const timerRef = useRef<NodeJS.Timeout | null>(null); 
   const lastUpdateRef = useRef<number>(Date.now());

   const fetchExchangeRate = useCallback(async () => {
        const now = Date.now();

        console.log("fetchExchangeRate start")
        
        if (exchangeRate !== 0 && now - lastUpdateRef.current < 1000) {
            setToAmount((fromAmount ?? 0) * exchangeRate);
            console.log("fetchExchangeRate if now - lastUpdateRef.current < 1000")
            return;
        }

        lastUpdateRef.current = now;

        const rate = await getExchangeRate(fromCurrency.id, toCurrency.id);
        console.log("New exchange rate:", rate);
        
        setExchangeRate(rate ?? 0);
        const calcToAmount = (fromAmount ?? 0) * rate;
        setToAmount(calcToAmount == 0 ? null : calcToAmount); 
    }, [fromCurrency, toCurrency, fromAmount]);


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
        if (timerRef.current) clearInterval(timerRef.current);

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
      }, [fetchExchangeRate]);
    
    useEffect(() => {
        getSelectedCoinBalance();
    }, [provider, signer, fromCurrency])

    useEffect(() => {
        fetchExchangeRate();
    }, [fromCurrency, toCurrency, fromAmount])

 return (
    <div className="w-full flex flex-col items-center gap-7 p-10 bg-white border border-gray-100 shadow-lg rounded-3xl ">
        <div className="w-full p-5 border-2 border-gray-200 mb-8 bg-gray-100 rounded-3xl">
            <div className="w-full flex items-center gap-1 md:gap-2">
                <span className=" md:mr-3 text-gray-400 text-sm md:text-base">Select course type</span>
                <button 
                    className={`px-2 md:px-5 py-1 text-sm md:text-base font-semibold rounded-md ${coursetype == "best" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"} `} 
                    onClick={() => setCoursetype("best")}
                >Best</button>
                <button  
                    className={`px-2 md:px-5 py-1 text-sm md:text-base font-semibold rounded-md ${coursetype == "fixed" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"} `}
                    onClick={() => setCoursetype("fixed")}
                >Fixed</button>
                <div className="w-[1px] h-7 mx-3 bg-gray-300"></div>
                <div className="flex items-center gap-1 md:gap-2 font-semibold">
                  1 {fromCurrency.symbol} = {exchangeRate} {toCurrency.symbol}
                </div>
                <div className="flex items-center gap-1 md:ml-auto text-gray-400 ">
                    <span className="text-sm md:text-base">Time before course has been updated:</span>
                    <span className="text-red-500 font-semibold">{formatTime(timeBeforeUpdate)}</span>
                </div>
            </div>
        </div>

        <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col md:flex-row items-center gap-5">
                <div
                    className="flex flex-1 border-2 relative z-50 rounded-xl transition-colors 
                    bg-white border-gray-200 focus-within:border-gray-500 p-1 "
                >
                    <span className="absolute -top-8">
                        {signer ? `Your ${fromCurrency.symbol} balance: ${selectedTokenBalance}` : "Connect wallet to see balance"}  
                    </span>
                    <div className="w-1/2 px-5 py-2 flex flex-1 flex-col" >
                        <span>Give</span>
                        <input
                            type="number"
                            className="outline-none bg-transparent"
                            placeholder={`${fromCurrency.minAmount}-${fromCurrency.maxAmount}`}
                            value={fromAmount ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFromAmount(value === "" ? null : Number(value));
                            }}
                            min={fromCurrency.minAmount || ""} 
                            max={fromCurrency.maxAmount}
                        />
                    </div>
                    <div className="w-1/2 bg-gray-900/85 rounded-xl z-0" >
                         <CurrencySelect selectedCurrency={fromCurrency} onSelect={setFromCurrency} currencies={currencies} />
                    </div>
                </div>

                <div className="p-3 bg-gray-700 hover:bg-gray-500  transition-colors  rounded-xl"> <ExchangeIcon /> </div>

                <div
                    className={`flex flex-1 border-2 rounded-xl relative border-gray-200 focus-within:border-gray-500 p-1`}
                >
                    <div className="w-1/2 px-5 py-2 flex flex-1 flex-col" >
                        <span>Receive</span>
                        <input
                            type="number"
                            className="outline-none"
                            placeholder={`${toCurrency.minAmount}-${toCurrency.maxAmount}`}
                            value={toAmount ?? ""}
                            min={toCurrency.minAmount || ""} 
                            max={toCurrency.maxAmount}
                            readOnly
                        />
                    </div>
                    <div className="w-1/2 bg-gray-900/85 rounded-xl" >
                        <CurrencySelect selectedCurrency={toCurrency} onSelect={setToCurrency} currencies={currencies} />
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-between gap-4">
                <div
                    className={`flex flex-1 flex-col px-5 py-2 border-2 rounded-xl border-gray-200 focus-within:border-gray-500`}
                    >
                    <span>Email</span>
                    <input
                        type="email"
                        className="outline-none"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div
                    className={`flex flex-1 flex-col px-5 py-2 border-2 rounded-xl border-gray-200 focus-within:border-gray-500`}
                    >
                    <span>Wallet address in {toCurrency.network} network</span>
                    <input
                        className="outline-none"
                        placeholder={`${toCurrency.network} wallet address`}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div className="w-full flex justify-center">
            <button className="px-5 py-7 text-white bg-red-600/85 hover:bg-red-500 rounded-2xl">PROCEED TO PAYMENT</button>
        </div>

        <div className="w-1/2 md:w-2/6 flex justify-center items-center">
            <p className="text-center text-gray-400">
                By clicking the button, you agree to the <span className="text-red-500/85 underline underline-offset-1">AML and KYC policy</span> {" "}
                and the CryptoExchange <span className="text-red-500/85 underline underline-offset-1">user agreement</span>
            </p>
        </div>
    </div>
 )
}
