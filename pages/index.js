// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Router } from '../routes';
import Coin from '../components/Coin';
import { getRandomDate, getCoinsFromApi, currency } from '../lib/utils';
import { initGA, logEvent, logPageView } from '../lib/analytics';
import Fonts from '../lib/fonts';
import GithubIcon from '../icons/github.svg';

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
    Fonts();

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

    await this.getCoins(historicalDate);
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
        <TopContainer>
          <Headline>
            What If I Had Invested $1,000 in 6 Random Cryptocurrencies
            on <HistoricalDate>{formattedDate}</HistoricalDate>
          </Headline>
          <WorthContainer>
            <WorthText>I have now worth of</WorthText>
            <TotalWorth>{currency(worth)}</TotalWorth>
          </WorthContainer>
        </TopContainer>
        <Button onClick={this.showMeTheMoney}>Show me the money!</Button>
        {hasError ? (
          <CoinContainer>
            <Error>Oh Nooooo!!! I just broke the blockchain. Please try again.</Error>
          </CoinContainer>
        ) : (
          <CoinContainer>
            {coins.length > 0 ? coins.map((coin: CoinType) => (
              <Coin
                key={coin.symbol}
                {...coin}
                invested={invested}
                onWorthUpdate={this.updateWorth}
              />
            )) : <Loading>Computing the Crypto Bubble...</Loading>}
          </CoinContainer>
        )}
        <Footer>
          <Link href="https://github.com/ciocan/cryptoroulette" target="_blank">Show me the code <GithubIcon /></Link>
        </Footer>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
`;

const TopContainer = styled.div`
  display: flex;
  background-color: black;
  width: 100%;
  margin: 0;
  justify-content: space-between;
  align-items: center;
  padding: 80px 0;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const Headline = styled.h1`
  font-size: 36px;
  color: white;
  margin: 0 80px;
  width: 540px;
  min-width: 540px;

  @media (max-width: 1000px) {
    width: 100%;
    min-width: 100%;
    text-align: center;
  }
`;

const HistoricalDate = styled.span`
  display: inline;
  text-decoration: underline;
`;

const WorthContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-right: 80px;

  @media (max-width: 1000px) {
    margin: 40px 0;
  }
`;

const WorthText = styled.p`
  font-size: 28px;
  text-align: right;
  color: white;
  margin: 0;
  padding: 0;

  @media (max-width: 1000px) {
    text-align: center;
  }
`;

const TotalWorth = styled.h1`
  font-size: 52px;
  text-align: right;
  color: #63A615;
  margin: 0;
  padding: 0;

  @media (max-width: 1000px) {
    text-align: center;
  }
`;

const CoinContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 420px;
  background-color: #63A615;
  padding: 100px 20px;
  margin-top: -28px;
`;

const Error = styled.div`
  color: red;
  font-size: 20px;
  align-items: center;
  display: flex;
  font-size: 32px;
  background: white;
  text-align: center;
  padding: 20px;
`;

const Loading = styled.div`
  font-style: italic;
  font-size: 30px;
  width: 300px;
  height: 300px;
  border-radius: 100%;
  text-align: center;
  background: white;
  display: flex;
  align-items:center;
  padding: 30px;

  animation: grow 1.5s infinite;

  @keyframes grow {
    0% {
     transform: scale(0);
    }

    50% {
      transform: scale(0.5);
    }
    100% {
      transform: scale(1);
    }
  }

`;

const Button = styled.button`
  margin-top: -40px;
  cursor: pointer;
  padding: 10px 20px;
  background: #F54123;
  color: black;
  border: 4px solid black;
  font-size: 28px;
  z-index: 1;
  outline: none;

  &:hover {
    border-color: #63A615;
  }
`;

const Footer = styled.footer`
  background: #F54123;
  padding: 15px 30px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const Link = styled.a`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover {
    color: #000;
    svg { path { fill: #000; }}
  }

  & svg {
    width: 20px;
    height: 20px;
    margin-left: 10px;

    path {
      fill: white;
    }
  }
`;
