
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import flush from 'styled-jsx/server';
import { initGA, logPageView } from '../lib/analytics';

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    const styles = flush();
    return { ...page, styleTags, styles };
  }

  componentDidMount () {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }

    logPageView();
  }

  render () {
    return (
      <html lang="en">
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
          <title>CryptoRoulette</title>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <style global jsx>{`
          * {
            font-family: "Roboto, sans-serif";
          }
        `}
        </style>
      </html>
    );
  }
}
