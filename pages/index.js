// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Coin from '../components/Coin';
import { getRandomDate, getCoins, currency } from '../lib/utils';

const TOTAL_INVESTMENT = 1000;
const TOTAL_COINS = 6;

import type { CoinType } from '../lib/utils';

type Props = {
  historicalDate: Date
};

type State = {
  historicalDate: Date,
  totalInvestment: number,
  totalCoins: number,
  coins: CoinType[],
  worth: number,
  hasError: boolean
};

export default class extends Component<Props, State> {
  static async getInitialProps() {
    return {
      historicalDate: getRandomDate().toString()
    };
  }

  state = {
    historicalDate: this.props.historicalDate,
    totalInvestment: TOTAL_INVESTMENT,
    totalCoins: TOTAL_COINS,
    coins: [],
    worth: 0,
    hasError: false
  }

  componentDidMount() {
    this.getCoins();
  }

  getCoins = async (date: Date = new Date(this.props.historicalDate)) => {
    try {
      const coins = await getCoins(this.state.totalCoins, date);
      this.setState({ coins });
    } catch(e) {
      this.setState({ hasError: true });
    }
  }

  showMeTheMoney = () => {
    this.setState({
      worth: 0,
      coins: [],
      historicalDate: getRandomDate(),
      hasError: false
    });
    this.getCoins();
  }

  updateWorth = (value: number) => {
    this.setState(({ worth }: State) => ({ worth: worth + value }));
  }

  render() {
    const { historicalDate, coins, totalInvestment, totalCoins, worth, hasError } = this.state;
    const invested = totalInvestment / totalCoins;
    const dateOptions =  { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(historicalDate).toLocaleString('en-US', dateOptions);

    return (
      <Container>
        <Button onClick={this.showMeTheMoney}>Show me the money!</Button>
        <HistoricalDate>{formattedDate}</HistoricalDate>
        <TotalWorth>{currency(worth)}</TotalWorth>
        {hasError ? (
          <Error>ERROR: I just broke the blockchain. Please try again.</Error>
        ) : (
          <CoinContainer>
            {coins.length > 0 ? coins.map((coin: CoinType) => (
              <Coin
                key={coin.symbol}
                {...coin}
                invested={invested}
                onWorthUpdate={this.updateWorth}
              />
            )) : <Loading>computing the crypto bubble...</Loading>}
          </CoinContainer>
        )}
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistoricalDate = styled.h2`

`;

const TotalWorth = styled.h1`
  color: green;
`;

const CoinContainer = styled.div`
  display: flex;
`;

const Error = styled.div`
  color: red;
  font-size: 20px;
`;

const Loading = styled.div`

`;

const Button = styled.button`
  cursor: pointer;
  max-width: 200px;
  padding: 20px;
  color: white;
  background: green;
  font-size: 20px;
`;
