// @flow
// import FontFaceObserver from 'fontfaceobserver';
const FontFaceObserver = require('fontfaceobserver');

const Fonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900';
  link.rel = 'stylesheet';

  //#FlowExpectError
  document.head.appendChild(link);
  
  //#FlowExpectError
  const roboto = new FontFaceObserver('Roboto');

  roboto.load().then(() => {
    //#FlowExpectError
    document.documentElement.classList.add('roboto');
  });
};

export default Fonts;
