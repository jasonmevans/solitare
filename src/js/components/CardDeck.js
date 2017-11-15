import CardCollection from '../CardCollection';
import PlayingCard from './PlayingCard';

export default class CardDeck extends CardCollection {
  revealAll() {
    this.forEach(card => card.reveal());
    return this;
  }
  concealAll() {
    this.forEach(card => card.conceal());
    return this;
  }

  get [CardCollection.Symbols.CardClass]() {
    return PlayingCard;
  }

  static get [Symbol.species]() {
    return this;
  }
  get [Symbol.toStringTag]() {
    return 'CardDeck';
  }
}
