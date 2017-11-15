import 'babel-polyfill';

import 'Styles/style.scss';

import Solitare from './Solitare';

const game = new Solitare();

document.addEventListener('DOMContentLoaded', () => game.init());

// import 'Styles/_responsive.scss'; // responsive overrides
