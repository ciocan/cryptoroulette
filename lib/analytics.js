// @flow
import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize('UA-112022453-1');
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (category: string = '', action: string = '') => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

export const logException = (description: string = '', fatal: boolean = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
