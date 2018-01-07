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
        <Header>
          <HistoricalPrice>
            {currency(historicalPrice, 6)}
          </HistoricalPrice>
          <TotalCoins>{symbol} {totalCoins}</TotalCoins>
        </Header>
        <Image src={`${DOMAIN}${imageUrl}`} />
        <Price>{currency(currentPrice, 6)}</Price>
        <Worth>{currency(worth)}</Worth>
        <Footer>
          <Name>{name}</Name>
        </Footer>
      </Container>
    );
  }
}

const Container = styled.a`
  display: flex;
  flex: 1;
  min-width: 240px;
  max-width: 240px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: white;
  background: black;
  margin: 20px;
  border: 1px solid #666;
  text-decoration: none;
  border: 3px solid black;

  &:hover {
    border: 3px solid white;
  }

  &:visited, &:link {
    color: black;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  width: 100%;
  align-items: center;
  font-size: 14px;
  color: grey;
`;

const HistoricalPrice = styled.div`
`;

const TotalCoins = styled.div`

`;

const Image = styled.img`
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 100%;
  margin-top: 10px;
`;

const Price = styled.h4`
  font-size: 20px;
  color: white;
`;

const Worth = styled.div`
  color: #63A615;
  padding: 5px 0;
  font-weight: bold;
  font-size: 36px;
  margin-top: 30px;
`;

const Footer = styled.footer`
  background: #F54123;
  width: 100%;
  margin-top: 10px;
`;

const Name = styled.h3`
  text-align: center;
  color: white;
  font-size: 20px;
  font-weight: normal;
`;
