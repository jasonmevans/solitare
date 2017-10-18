import { default as CardCollection } from '../CardCollection';
import { default as PlayingCard } from './PlayingCard';

export default class CardDeck extends CardCollection {
  get [CardCollection.Symbols.CardClass]() {
    return PlayingCard;
  }
}
