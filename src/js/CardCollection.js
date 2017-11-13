import { Card } from './Card';

const Symbols = {
  all: Symbol('all'),
  CardClass: Symbol('CardClass')
};

export class CardCollection extends Array {
  constructor() {
    super(...arguments);

    let CardClass = this[Symbols.CardClass];

    CardClass.suits.forEach(suit => {
      CardClass.ranks.forEach(rank => {
        this.push(new CardClass(rank, suit));
      });
    });
  }

  get [Symbols.CardClass]() {
    return Card;
  }

  static get Symbols() {
    return Symbols;
  }

  static get [Symbol.species]() {
      return this;
  }

  get [Symbol.toStringTag]() {
    return 'CardCollection';
  }

  // *[Symbol.iterator]() {
  //   for (let card in this.cards) {
  //     yield this[card];
  //   }
  // }

  shuffle() {
    this.sort((a, b) => {
      const r = Math.round(Math.random());
      return r || -1;
    });
    return this;
  }

  deal(n) {
    if (n === Symbols.all) {
      return this.splice(0);
    }
    return this.splice(0, n); // deal n cards off the top
  }

  add(cards) {
    super.push(...cards);
    return this;
  }

  dealHands(players = 1, cards = Math.floor(52 / players)) {
    if (players * cards > 52) {
      throw new Error('Too many cards for number of players');
    }

    let playerHands = Array.from(Array(players)).map(hand => []);
    let shuffledCards = this.shuffle();
    let maxDealt = cards * players;
    let remainingCards = shuffledCards.slice(maxDealt);
    let dealtCards = shuffledCards.reduce((hands, card, index) => {
      if (index < maxDealt) {
        hands[index % players].push(card);
      }
      return hands;
    }, playerHands);

    return { hands: playerHands, remainder: remainingCards };
  }

}
