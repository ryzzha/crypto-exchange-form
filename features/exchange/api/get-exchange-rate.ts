export const getExchangeRate = async (fromCoin: string, toCoin: string): Promise<number> => {
  try {
    const response = await fetch(
      `/api/exchange-rate?fromCoin=${fromCoin}&toCoin=${toCoin}`
    );

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    return data.rate;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    return 0;
  }
};
