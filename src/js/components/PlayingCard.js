import './PlayingCard.scss';

import { default as Card } from '../Card';

export default class PlayingCard extends Card {
  constructor() {
    super(...arguments);

    const cardEl = document.createElement('div');
    cardEl.classList.add('card', this.rank, this.suit);

    const suitEl = document.createElement('span');
    suitEl.classList.add('suit');
    cardEl.appendChild(suitEl);

    const rankEL = document.createElement('span');
    rankEL.classList.add('rank');
    cardEl.appendChild(rankEL);

    cardEl.playingCard = this;
    this.el = cardEl;
  }

  get [Symbol.toStringTag]() {
    return 'PlayingCard: ' + this;
  }

  static get ranks() {
    return [
      'Ace',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Jack',
      'Queen',
      'King'
    ];
  }
  static get suits() {
    return [
      'Heart',
      'Spade',
      'Club',
      'Diamond'
    ];
  }

}
