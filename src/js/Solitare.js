import { default as Logger } from './Logger';
import { default as CardDeck } from 'Components/CardDeck';
import { default as GameBoard } from 'Components/GameBoard';

export default class Solitare {
  constructor() {
    this.deck = new CardDeck().shuffle();
    this.board = new GameBoard(this.rules, this.deck);
    this.board.init();
  }

  get rules() {
    return {
      drag: {
        stack: (card, topCard) => {
          return card === topCard;
        },
        pile: (card, topCard) => {
          return card === topCard;
        },
        deal: (card, topCard) => {
          return card === topCard;
        }
      },
      drop: {
        stack: (dragCard, topCard) => {
          if (topCard) {
            return +dragCard === +topCard - 1 && dragCard.color !== topCard.color;
          }
          return +dragCard === 13; // must be a king
        },
        pile: (dragCard, topCard) => {
          if (topCard) {
            return +dragCard === +topCard + 1 && dragCard.suit === topCard.suit;
          }
          return +dragCard === 1; // must be an ace
        }
      }
    };
  }

}
