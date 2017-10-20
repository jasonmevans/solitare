import './GameBoard.scss';

import { default as Logger } from '../Logger';
const Symbols = {
  board: Symbol('board'),
  deck: Symbol('deck'),
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
  get [Symbols.deck]() {
    return document.querySelector('#deck');
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
