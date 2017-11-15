import './GameBoard.scss';

import { mix } from 'mixwith';
import { Renderable } from '../mixins/Renderable';
import { Logger } from '../Logger';
import { Stack } from './Stack';
import { Pile } from './Pile';
import { Deal } from './Deal';
import { Deck } from './Deck';

const Symbols = {
  cards: Symbol('cards')
};

export class GameBoard extends mix(class {}).with(Renderable) {
  constructor(rules, deck) {
    super(document.createElement('div'));

    this.el.setAttribute('id', 'game-board');

    this.stacks = Array(7).fill((i) => new Stack('stack-'+i)).map((fn, i) => fn(i));
    this.piles = deck[deck.constructor.Symbols.CardClass].suits.map(suit => new Pile(suit));

    this.deck = new Deck();
    this.deal = new Deal();

    this.rules = rules;

    deck.forEach(card => {
      card.renderTo(this.deck.cardContainer);
    });
  }

  renderTo(target) {
    this.piles.forEach(pile => pile.renderTo(this));
    this.deal.renderTo(this);
    this.deck.renderTo(this);
    this.stacks.forEach(stack => stack.renderTo(this));

    super.renderTo(target);

    this.el.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.el.addEventListener('dragstart', (e) => {
      Logger.log(`Dragging card [${e.target.playingCard}]`);
      e.dataTransfer.setData('text', e.target.id);
    });
    this.el.addEventListener('dragend', (e) => {
      e.dataTransfer.clearData();
    });

    this.el.addEventListener('dblclick', (e) => {
      const dblClickContainer = document.elementFromPoint(e.x, e.y).parentNode;
      if (dblClickContainer.isSameNode(this.deck.el)) {
        return false;
      }
      if (e.target.classList.contains('card') && !e.target.playingCard.hidden) {
        this.autoPlaceCard(e.target);
      }
    });
  }

  autoPlaceCard(cardEl) {
    let dropPile = Array.from(this.piles).find(pile => {
      let topCard = pile.cardContainer.el.lastChild ?
        pile.cardContainer.el.lastChild.playingCard : null;
      return this.rules.drop.pile(cardEl.playingCard, topCard);
    });

    if (dropPile) {
      cardEl.playingCard.renderTo(dropPile.cardContainer);
      return;
    }

    let dropStack = Array.from(this.stacks).find(stack => {
      let topCard = stack.cardContainer.el.lastChild ?
        stack.cardContainer.el.lastChild.playingCard : null;
      return this.rules.drop.stack(cardEl.playingCard, topCard);
    });

    if (dropStack) {
      cardEl.playingCard.renderTo(dropStack.cardContainer);
      return;
    }
  }

  init() {
    this.stacks.forEach((stack, index) => {
      this.dealCards(index + 1).forEach((card, i) => {
        if (i === index) {
          card.playingCard.reveal();
        }
        card.playingCard.renderTo(stack.cardContainer);
      });
    });

    Logger.log('--------------------------------------------');

    this.flip(this.dealCards(3));
  }

  getCardEls(cardIds, delim = '|') {
    const query = cardIds.split(delim).map(id => '#'+id).join(',');
    return Array.from(this.el.querySelectorAll(query));
  }

  dealCards(n) {
    const deckEl = this.deck.cardContainer.el;
    const cards = [];
    for (let i = 0; i < n && deckEl.hasChildNodes(); i++ ) {
      cards.push(deckEl.removeChild(deckEl.lastChild));
    }
    Logger.log(`Dealing cards: [${cards.map(card => card.playingCard).join(', ')}]`);
    return cards;
  }

  flip(cards) {
    const dealEl = this.deal.cardContainer.el;
    cards.forEach(card => {
      dealEl.appendChild(card.playingCard.reveal().el);
    });
  }

  clear() {
    this[Symbols.cards].forEach(card => card.parentNode.remove(card));
    Logger.log(`Cleared the board!`);
  }

  // setupDOM() {
  //   const board = document.createElement('div');
  //   board.setAttribute('id', 'game-board');
  //   document.body.appendChild(board);
  //
  //   function appendNode(parent, type, cls) {
  //     const node = document.createElement('div');
  //     if (type) {
  //       node.classList.add(type);
  //     }
  //     node.classList.add(cls);
  //     parent.appendChild(node);
  //     const container = document.createElement('div');
  //     container.classList.add('card-container');
  //     node.appendChild(container);
  //   }
  //
  //   ['Spade', 'Heart', 'Club', 'Diamond']
  //     .forEach(appendNode.bind(null, board, 'pile'));
  //
  //   ['deal', 'deck']
  //     .forEach(appendNode.bind(null, board, null));
  //
  //   ['stack-1', 'stack-2', 'stack-3', 'stack-4', 'stack-5', 'stack-6', 'stack-7']
  //     .forEach(appendNode.bind(null, board, 'stack'));
  //
  // }

  static get Symbols() {
    return Symbols;
  }

  get [Symbols.cards]() {
    return this.el.querySelectorAll('.card');
  }
  // get [Symbols.deck]() {
  //   return this.el.querySelector('.deck .card-container');
  // }
  // get [Symbols.deal]() {
  //   return this.el.querySelector('.deal .card-container');
  // }
  // get [Symbols.stacks]() {
  //   return this.el.querySelectorAll('.stack .card-container');
  // }
  // get [Symbols.piles]() {
  //   return this.el.querySelectorAll('.pile .card-container');
  // }
}
