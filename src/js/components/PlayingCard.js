import './PlayingCard.scss';

import { mix } from 'mixwith';
import Renderable from '../mixins/Renderable';
import Card from '../Card';

const Symbols = {
  red: Symbol('red'),
  black: Symbol('black'),
};

export default class PlayingCard extends mix(Card).with(Renderable) {
  constructor(rank, suit) {
    super(document.createElement('div'), rank, suit);

    const suitEl = document.createElement('span');
    const rankEL = document.createElement('span');

    this.el.classList.add('card');
    suitEl.classList.add('suit');
    rankEL.classList.add('rank');

    this.el.appendChild(suitEl);
    this.el.appendChild(rankEL);

    this.el.playingCard = this;

    this.conceal();
  }

  get color() {
    const suitMod = this.constructor.suits.indexOf(this.suit) % 2;
    return suitMod === 0 ? Symbols.black : Symbols.red;
  }

  get hidden() {
    return this.el.classList.contains('hidden');
  }

  reveal() {
    this.el.classList.remove('hidden');
    this.el.classList.add(this.rank, this.suit);

    this.el.setAttribute('id', `${this.rank}-of-${this.suit}s`);
    this.el.setAttribute('draggable', true);
    return this;
  }
  conceal() {
    [...this.el.classList].forEach((cls) => {
      if (cls !== 'card') {
        this.el.classList.remove(cls);
      }
    });
    this.el.classList.add('hidden');

    this.el.removeAttribute('id');
    this.el.removeAttribute('draggable');
    return this;
  }

  static get [Symbol.species]() {
    return this;
  }
  get [Symbol.toStringTag]() {
    return `PlayingCard: ${this}`;
  }

  static get Symbols() {
    return Symbols;
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
      'King',
    ];
  }
  static get suits() {
    return [
      'Spade',
      'Heart',
      'Club',
      'Diamond',
    ];
  }
}
