// @flow
import { coinSymbols, coinsMap } from './coins';
import { priceHistorical, priceMulti } from 'cryptocompare';

export type CoinType = {
  name: string,
  imageUrl: string,
  symbol: string,
  url: string,
  currentPrice?: number,
  historicalPrice?: number
};


export const getRandomDate = (
  start: Date = new Date(2017, 0, 1),
  end: Date = new Date(2017, 11, 30)
): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const getRandomSymbols = () => [...coinSymbols].sort(() => 0.5 - Math.random());

export const getCoinsFromApi = async (
  n: number = 6,
  historicalDate: Date = getRandomDate(),
  symbols: string[]
) => {
  const coins = [];
  symbols = symbols.length > 0 ? symbols : getRandomSymbols();

  while (coins.length < n) {
    const symbol = symbols.pop();
    const historicalPrice = await priceHistorical(symbol, 'USD', historicalDate);

    if (historicalPrice.USD > 0) {
      coins.push({
        ...coinsMap[symbol],
        historicalPrice: historicalPrice.USD
      });
    }
  }

  const currentPrices = await priceMulti( coins.map(((coin: CoinType) => coin.symbol)), 'USD');

  return coins.map((coin: CoinType) => ({ ...coin, currentPrice: currentPrices[coin.symbol].USD }));
};

export const currency = (n: number, maximumFractionDigits: number = 2) => {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits });
};
