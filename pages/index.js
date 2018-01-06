// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Router } from '../routes';
import Coin from '../components/Coin';
import { getRandomDate, getCoinsFromApi, currency } from '../lib/utils';
import { initGA, logEvent, logPageView } from '../lib/analytics';

const TOTAL_INVESTMENT = 1000;
const TOTAL_COINS = 6;

import type { CoinType } from '../lib/utils';

type ProvidedProps = {
  query: Object
};

type Props = ProvidedProps & {
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
  static async getInitialProps({ query }: ProvidedProps) {
    const historicalDate = query.date
      ? new Date(parseInt(query.date))
      : getRandomDate().toString();

    return { historicalDate, query };
  }

  state = {
    historicalDate: this.props.historicalDate,
    totalInvestment: TOTAL_INVESTMENT,
    totalCoins: TOTAL_COINS,
    coins: [],
    worth: 0,
    hasError: false
  }

  async componentDidMount() {
    const { query: { date, symbols } } = this.props;

    if (date && symbols) {
      this.getCoins(new Date(parseInt(date)), symbols.split(':'));
    } else {
      await this.getCoins();
      const { historicalDate, coins } = this.state;
      const timestamp = new Date(historicalDate).getTime();
      const symbols = coins.map((coin: CoinType) => coin.symbol).join(':');

      Router.replaceRoute(`/${timestamp}/${symbols}`);
    }

    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }

    logPageView();
  }

  getCoins = async (historicalDate: Date = new Date(this.props.historicalDate), symbols: string[] = []) => {
    try {
      const coins = await getCoinsFromApi(this.state.totalCoins, historicalDate, symbols);
      this.setState({ coins, historicalDate });
    } catch(e) {
      this.setState({ hasError: true });
    }
  }

  showMeTheMoney = async () => {
    const historicalDate = getRandomDate();

    this.setState({
      worth: 0,
      coins: [],
      historicalDate,
      hasError: false
    });

    await this.getCoins();
    const timestamp = new Date(historicalDate).getTime();
    const symbols = this.state.coins.map((coin: CoinType) => coin.symbol).join(':');

    Router.replaceRoute(`/${timestamp}/${symbols}`);
    logPageView();
    logEvent('button click', 'showMeTheMoney');
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
        <Headline>
          If I invested $1,000 in 6 random cryptocurrencies
          on <HistoricalDate>{formattedDate}</HistoricalDate>
          now I have worth of
        </Headline>

        <TotalWorth>{currency(worth)}</TotalWorth>
        {hasError ? (
          <Error>OH Nooo!!! I just broke the blockchain. Please try again.</Error>
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
        <Button onClick={this.showMeTheMoney}>Show me the money!</Button>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`;

const Headline = styled.h1`
  text-align: center;
`;

const HistoricalDate = styled.span`
  display: block;
`;

const TotalWorth = styled.h1`
  color: green;
  font-size: 42px;
`;

const CoinContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 420px;
  background-color: lightgrey;
  margin: 20px 60px;
  padding: 10px;
`;

const Error = styled.div`
  color: red;
  font-size: 20px;
  min-height: 420px;
  align-items: center;
  display: flex;
  font-size: 22px;
`;

const Loading = styled.div`
  font-style: italic;
  font-size: 30px;
`;

const Button = styled.button`
  cursor: pointer;
  max-width: 300px;
  padding: 20px;
  color: white;
  background: green;
  font-size: 20px;

  &:hover {
    background: yellow;
    color: green;
  }
`;
