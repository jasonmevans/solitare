import './GameBoard.scss';

import { default as Logger } from '../Logger';
const Symbols = {
  cards: Symbol('cards'),
  board: Symbol('board'),
  deck: Symbol('deck'),
  deal: Symbol('deal'),
  stacks: Symbol('stacks'),
  piles: Symbol('piles')
};

export default class GameBoard {
  constructor(rules, draggable = true) {
    this[Symbols.board].addEventListener('drop', (e) => {
      const dragCard = document.getElementById(e.dataTransfer.getData('text'));
      const dropType = getDropTargetType(e.target);
      const canDrop = rules.drop[dropType](dragCard.playingCard, e.target);

      // console.log(dropType, canDrop, dragCard, e.target);
      Logger.log(`Attempt to drop ${dragCard.id} on ${e.target.id}`);

      if (canDrop) {
        getDropContainer(e.target).appendChild(dragCard);
      }
    });

    function getDropContainer(el) {
      return el.classList.contains('card') ? el.parentNode : el;
    }
    function getDropTargetType(targetEl) {
      if (targetEl.classList.contains('card')) {
        return 'card';
      }
      if (targetEl.classList.contains('stack')) {
        return 'stack';
      }
      if (targetEl.classList.contains('pile')) {
        return 'pile';
      }
      throw new Error(`Cannot resolve drop target type`);
    }

  }

  clear() {
    this[Symbols.cards].forEach(card => card.parentNode.remove(card));
  }

  static get Symbols() {
    return Symbols;
  }

  get [Symbols.cards]() {
    return document.querySelectorAll('.card');
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
}
