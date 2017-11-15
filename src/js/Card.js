export default class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  [Symbol.toPrimitive](type) {
    if (type === 'number') {
      return this.constructor.ranks.indexOf(this.rank) + 1;
    } else {
      return this.toString();
    }
  }

  static get ranks() {
    return [];
  }
  static get suits() {
    return [];
  }

  get [Symbol.toStringTag]() {
    return 'Card';
  }

  toString() {
    return `${this.rank} of ${this.suit}s`;
  }
}
