import { default as CardDeck } from 'Components/CardDeck';
import { default as GameBoard } from 'Components/GameBoard';

export default class Solitare {
  constructor() {
    this.board = new GameBoard();
    this.deal();
  }

  deal() {
    let dealEl = this.board[GameBoard.Symbols.deal];
    let stacks = this.board[GameBoard.Symbols.stacks];

    this.deck = new CardDeck().shuffle().map(card => {
      card.el.setAttribute('draggable', true);
      return card;
    });

    this.deck.deal(3).forEach(card => dealEl.appendChild(card.el));

    stacks.forEach((stack, index) => {
      this.deck.deal(index+1).forEach(card => stack.appendChild(card.el));
    });

  }

}
