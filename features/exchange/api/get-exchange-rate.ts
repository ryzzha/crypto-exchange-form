export const getExchangeRate = async (fromCoin: string, toCoin: string): Promise<number> => {
  try {
    const stablecoins = ["usd", "tether", "binance-usd", "dai"];
    let intermediateCoin = toCoin;

    if (stablecoins.includes(toCoin)) {
      intermediateCoin = "usd"; 
    }

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromCoin}&vs_currencies=${intermediateCoin}`
    );

    if (!res.ok) throw new Error("API request failed");

    const data = await res.json();
    let rate = data[fromCoin]?.[intermediateCoin] || 0;

    return rate;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    return 0;
  }
}

  