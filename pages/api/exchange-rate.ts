import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const responseB = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCETH");
        const dataB = await responseB.json();
        console.log(`1 BTC = ${dataB.price} ETH`);
        const { fromCoin, toCoin } = req.query;

        if (!fromCoin || !toCoin) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        const stablecoins = ["usd", "tether", "binance-usd", "dai"];
        let intermediateCoin = toCoin as string;

        if (stablecoins.includes(toCoin as string)) {
            intermediateCoin = "usd";
        }

        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${fromCoin},${intermediateCoin}&vs_currencies=usd`
        );

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        console.log(data)

        let rate = data[fromCoin as string]?.[intermediateCoin as string] || 0;

        if (!rate) {
            const fromToUsd = data[fromCoin as string]?.usd;
            const toToUsd = data[toCoin as string]?.usd;

            if (!fromToUsd || !toToUsd) {
                return res.status(400).json({ error: `Exchange rate for ${fromCoin} or ${toCoin} is missing` });
            }

            rate = fromToUsd / toToUsd;
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({ rate });
    } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        res.status(500).json({ error: "Failed to fetch exchange rate" });
    }
}
