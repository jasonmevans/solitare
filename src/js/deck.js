import 'babel-polyfill';

import 'Styles/style.scss';

import { default as GameBoard } from 'Components/GameBoard';
import { default as CardDeck } from 'Components/CardDeck';

document.addEventListener('DOMContentLoaded', function() {

  const board = document.querySelector('#game-board');

  const deck = new CardDeck().shuffle();

  deck.forEach(card => board.appendChild(card.el));

});
