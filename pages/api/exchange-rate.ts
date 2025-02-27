import { NextApiRequest, NextApiResponse } from "next";

let fetchAmount = 0;

const fallbackRates: Record<string, number> = {
    "ethereum": 2500,  
    "bitcoin": 83000,  
    "usd": 1,         
    "tether": 1,       
    "tether-erc20": 1,       
    "tether-trc20": 1,       
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { fromCoin, toCoin } = req.query;

    if (!fromCoin || !toCoin) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const stablecoins = ["usd", "tether", "binance-usd", "dai"];
    let intermediateCoin = toCoin as string;

    if (stablecoins.includes(toCoin as string)) {
        intermediateCoin = "usd";
    }

    fetchAmount++;
    console.log("fetch amount: " + fetchAmount);

    let rate: number | null = null;

    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${fromCoin},${intermediateCoin}&vs_currencies=usd`
        );

        if (response.ok) {
            const data = await response.json();
            console.log("CoinGecko response:", data);

            rate = data[fromCoin as string]?.[intermediateCoin as string] || 0;

            if (!rate || rate === 0) {
                const fromToUsd = data[fromCoin as string]?.usd;
                const toToUsd = data[toCoin as string]?.usd;
                if (fromToUsd && toToUsd) {
                    rate = fromToUsd / toToUsd;
                }
            }
        } else {
            console.error("CoinGecko API response not ok");
        }
    } catch (error) {
        console.error("CoinGecko API error:", error);
    }

    if (!rate || rate === 0) {
        console.log(`⚠️ CoinGecko API failed. Using fallback rate for ${fromCoin} -> ${toCoin}`);
        rate = getFallbackRate(fromCoin as string, intermediateCoin);
    } else {
        console.log(`Using CoinGecko rate for ${fromCoin} -> ${toCoin}: ${rate}`);
    }

    if (!rate) {
        return res.status(500).json({ error: `Exchange rate for ${fromCoin} -> ${toCoin} is missing` });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ rate });
}

function getFallbackRate(fromCoin: string, toCoin: string): number | null {
    const fromToUsd = fallbackRates[fromCoin];
    const toToUsd = fallbackRates[toCoin];

    if (!fromToUsd || !toToUsd) {
        console.error(`Fallback rate missing for ${fromCoin} or ${toCoin}`);
        return null;
    }

    return fromToUsd / toToUsd;
}
