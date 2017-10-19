import { default as CardDeck } from 'Components/CardDeck';
import { default as GameBoard } from 'Components/GameBoard';

export default class Solitare {
  constructor() {
    this.board = new GameBoard();
    this.deal();
  }

  deal() {
    this.board.clear();

    let deckEl = this.board[GameBoard.Symbols.deck];
    let dealEl = this.board[GameBoard.Symbols.deal];
    let stacks = this.board[GameBoard.Symbols.stacks];

    this.deck = new CardDeck().shuffle();

    this.deck.deal(3).revealAll().forEach(card => dealEl.appendChild(card.el));

    stacks.forEach((stack, index) => {
      this.deck.deal(index+1).forEach((card, i) => {
        if (i === index) {
          card.reveal();
        }
        stack.appendChild(card.el);
      });
    });

    this.deck.deal(CardDeck.Symbols.all).forEach((card, index, cards) => {
      deckEl.appendChild(card.el);
    });

  }

}
