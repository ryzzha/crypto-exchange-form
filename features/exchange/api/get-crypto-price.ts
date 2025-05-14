export const getCryptoPrice = async (name: string): Promise<number | null> => {
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${name.toLowerCase()}&vs_currencies=usd`);
        const data = await res.json();
    
        if (data[name.toLocaleLowerCase()].usd) {
          return parseFloat(data[name.toLocaleLowerCase()].usd); 
        } else {
          console.error("Помилка: немає даних для", name);
          return null;
        }
      } catch (error) {
        console.error("Помилка отримання ціни:", error);
        return null;
      }
}

  