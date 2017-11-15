import 'babel-polyfill';

import 'Styles/style.scss';

import CardDeck from 'Components/CardDeck';
import GameBoard from 'Components/GameBoard';

document.addEventListener('DOMContentLoaded', function() {

  const board = document.querySelector('#game-board');

  const deck = new CardDeck().revealAll();

  deck.forEach(card => {
    const cont = document.createElement('div');
    cont.classList.add('card-container');
    cont.appendChild(card.el);
    board.appendChild(cont);
  });

});
