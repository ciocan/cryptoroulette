
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import flush from 'styled-jsx/server';

const TITLE = 'CryptoRoulette: what is worth of $1,000 bet on cryptocurrencies';
const DESCRIPTION = 'Calculate the net worth of $1,000 invested in 2017 on 6 random coins';

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    const styles = flush();
    return { ...page, styleTags, styles };
  }

  render () {
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{TITLE}</title>
          <meta name="description" content={DESCRIPTION} />
          <meta name="keywords" content="cryptocurrencies, cryptoroulette, blockchain, altocoin, cryptocurrency" />
          <meta name="author" content="Radu Ciocan" />
          <meta property="og:url" content="https://cryptoroulette.info" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={TITLE} />
          <meta property="og:description" content={DESCRIPTION} />
          <meta property="og:image" content="https://cryptoroulette.info/static/screenshot.png" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <style global jsx>{`
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
          }
        `}
        </style>
      </html>
    );
  }
}
