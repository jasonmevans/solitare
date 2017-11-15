import CardDeck from 'Components/CardDeck';
import GameBoard from 'Components/GameBoard';
import Logger from './Logger';

export default class Solitare {
  constructor() {
    this.deck = new CardDeck().shuffle();
    this.board = new GameBoard(this.rules, this.deck);
    this.board.renderTo(document.body);
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
      },
      win(piles = []) {
        return piles.every(pile => {
          return pile.childNodes.length == 13;
        });
      }
    };
  }

}
