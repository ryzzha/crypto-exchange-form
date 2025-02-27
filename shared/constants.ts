import { ICurrency } from "@/features/exchange/model/types";

const currencies: ICurrency[] = [
    { id: "ethereum", name: "Ethereum", symbol: "ETH", type: "crypto", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", network: "ethereum", contractAddress: null, minAmount: 0.01, maxAmount: 1000 },
    { id: "usd", name: "USD Coin", symbol: "USDC", type: "crypto", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", network: "ethereum", contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", minAmount: 1, maxAmount: 100000 },
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", type: "crypto", icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", network: "bitcoin", contractAddress: null, minAmount: 0.0001, maxAmount: 500 },
    { id: "tether-trc20", name: "Tether TRC20", symbol: "USDT-TRC20", type: "crypto", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", network: "tron", contractAddress: null, minAmount: 1, maxAmount: 100000 },
    { id: "tether-erc20", name: "Tether ERC20", symbol: "USDT-ERC20", type: "crypto", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", network: "ethereum", contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7", minAmount: 1, maxAmount: 100000 },
    
    { id: "privatbank", name: "PrivatBank", symbol: "UAH", type: "bank", icon: "https://upload.wikimedia.org/wikipedia/commons/0/06/PrivatBank_logo.svg", network: "ukraine", contractAddress: null, minAmount: 10, maxAmount: 1000000 },
    { id: "monobank", name: "Monobank", symbol: "UAH", type: "bank", icon: "https://upload.wikimedia.org/wikipedia/commons/8/88/MonoBank_logo.png", network: "ukraine", contractAddress: null, minAmount: 10, maxAmount: 1000000 },
    { id: "pumb", name: "PUMB", symbol: "UAH", type: "bank", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a8/PUMB_logo.png", network: "ukraine", contractAddress: null, minAmount: 10, maxAmount: 1000000 },
    { id: "otpbank", name: "OTP Bank", symbol: "UAH", type: "bank", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Otpbank_logo.svg", network: "ukraine", contractAddress: null, minAmount: 10, maxAmount: 1000000 },
    
    { id: "cash", name: "Cash", symbol: "UAH", type: "cash", icon: "https://cdn-icons-png.flaticon.com/512/2175/2175285.png", network: "ukraine", contractAddress: null, minAmount: 10, maxAmount: 50000 },
];


 export { currencies };