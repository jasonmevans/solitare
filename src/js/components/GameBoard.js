import './GameBoard.scss';

const Symbols = {
  board: Symbol('board'),
  deal: Symbol('deal'),
  stacks: Symbol('stacks'),
  piles: Symbol('piles')
};

export default class GameBoard {
  constructor(draggable = true) {
  }

  static get Symbols() {
    return Symbols;
  }

  get [Symbols.board]() {
    return document.querySelector('#game-board');
  }
  get [Symbols.deal]() {
    return document.querySelector('#deal');
  }
  get [Symbols.stacks]() {
    return document.querySelectorAll('.stack');
  }
  get [Symbols.piles]() {
    return document.querySelectorAll('.pile');
  }

  clear() {

  }
}
