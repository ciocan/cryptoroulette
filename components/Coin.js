// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { currency } from '../lib/utils';

import type { CoinType } from '../lib/utils';

const DOMAIN = 'https://cryptocompare.com';

type Props = CoinType & {
  invested: number,
  onWorthUpdate: Function
};

export default class Coin extends Component<Props> {
  componentDidMount() {
    this.props.onWorthUpdate(this.computeWorth());
  }

  computeWorth = () => {
    const { invested, currentPrice = 0, historicalPrice = 0 } = this.props;
    return invested / historicalPrice * currentPrice;
  }

  render() {
    const { name, url, imageUrl, symbol, currentPrice = 0, historicalPrice = 0, invested } = this.props;
    const totalCoins = (invested / historicalPrice).toLocaleString('en-US', { maximumFractionDigits: 2 });
    const worth = this.computeWorth();

    return (
      <Container href={`${DOMAIN}${url}`} target="_blank">
        <Name>{name}</Name>
        <Image src={`${DOMAIN}${imageUrl}`} />
        <CoinSymbol>
          {symbol}
        </CoinSymbol>
        <Price>
          {currency(currentPrice, 6)}
        </Price>
        <HistoricalPrice>
          {currency(historicalPrice, 6)}
        </HistoricalPrice>
        <TotalCoins>{symbol} {totalCoins}</TotalCoins>
        <Worth>{currency(worth)}</Worth>
      </Container>
    );
  }
}

const Container = styled.a`
  display: flex;
  flex: 1 auto;
  min-width: 100px;
  max-width: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin: 10px;
  border: 1px solid #666;
  background: white;
  text-decoration: none;

  &:hover {
    background: #FFA;
  }

  &:visited, &:link {
    color: black;
  }
`;

const Name = styled.h3`
  text-align: center;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
`;

const CoinSymbol = styled.h3`

`;

const Price = styled.h4`
  font-size: 20px;
`;

const HistoricalPrice = styled.div`
  color: grey;
`;

const TotalCoins = styled.div`
  padding: 5px;
  color: grey;
`;

const Worth = styled.div`
  color: green;
  padding: 5px 0;
  font-weight: bold;
  font-size: 18px;
`;
