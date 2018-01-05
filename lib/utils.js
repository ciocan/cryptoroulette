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

export const getCoins = async (
  n: number = 6,
  date: Date = getRandomDate()
) => {
  const coins = [];
  const randomCoins = [...coinSymbols].sort(() => 0.5 - Math.random());

  while (coins.length < n) {
    const symbol = randomCoins.pop();
    const historicalPrice = await priceHistorical(symbol, 'USD', date);

    if (historicalPrice.USD > 0) {
      coins.push({
        ...coinsMap[symbol],
        historicalPrice: historicalPrice.USD
      });
    }
  }

  const symbols = coins.map(((coin: CoinType) => coin.symbol));
  const currentPrices = await priceMulti(symbols, 'USD');

  return coins.map((coin: CoinType) => ({ ...coin, currentPrice: currentPrices[coin.symbol].USD }));
};

export const currency = (n: number, maximumFractionDigits: number = 2) => {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits });
};
