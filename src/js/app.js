import 'babel-polyfill';

import 'Styles/style.scss';

import { default as Solitare } from './Solitare';

document.addEventListener('DOMContentLoaded', function() {
  const game = new Solitare();
});

// import 'Styles/_responsive.scss'; // responsive overrides
