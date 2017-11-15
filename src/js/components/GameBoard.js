import './GameBoard.scss';

import Deal from './Deal';
import Deck from './Deck';
import Pile from './Pile';
import Logger from '../Logger';
import Renderable from '../mixins/Renderable';
import Stack from './Stack';

import { mix } from 'mixwith';

const Symbols = {
  cards: Symbol('cards'),
};

export default class GameBoard extends mix(class {}).with(Renderable) {
  constructor(rules, deck) {
    super(document.createElement('div'));

    this.el.setAttribute('id', 'game-board');

    this.stacks = Array(7).fill(i => new Stack(`stack-${i}`)).map((fn, i) => fn(i));
    this.piles = deck[deck.constructor.Symbols.CardClass].suits.map(suit => new Pile(suit));

    this.deck = new Deck();
    this.deal = new Deal();

    this.rules = rules;

    deck.forEach((card) => {
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
        e.stopPropagation();
      } else if (e.target.classList.contains('card') && !e.target.playingCard.hidden) {
        this.autoPlaceCard(e.target);
      }
    });
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

  autoPlaceCard(cardEl) {
    const dropPile = this.piles.find((pile) => {
      const topCard = pile.cardContainer.el.lastChild ?
        pile.cardContainer.el.lastChild.playingCard : null;
      return this.rules.drop.pile(cardEl.playingCard, topCard);
    });

    if (dropPile) {
      cardEl.playingCard.renderTo(dropPile.cardContainer);
      return;
    }

    const dropStack = this.stacks.find((stack) => {
      const topCard = stack.cardContainer.el.lastChild ?
        stack.cardContainer.el.lastChild.playingCard : null;
      return this.rules.drop.stack(cardEl.playingCard, topCard);
    });

    if (dropStack) {
      cardEl.playingCard.renderTo(dropStack.cardContainer);
    }
  }

  getCardEls(cardIds, delim = '|') {
    const query = cardIds.split(delim).map(id => `#${id}`).join(',');
    return [...this.el.querySelectorAll(query)];
  }

  dealCards(n) {
    const deckEl = this.deck.cardContainer.el;
    const cards = [];
    for (let i = 0; i < n && deckEl.hasChildNodes(); i += 1) {
      cards.push(deckEl.removeChild(deckEl.lastChild));
    }
    Logger.log(`Dealing cards: [${cards.map(card => card.playingCard).join(', ')}]`);
    return cards;
  }

  flip(cards) {
    cards.forEach((card) => {
      card.playingCard.reveal().renderTo(this.deal.cardContainer);
    });
  }

  clear() {
    this[Symbols.cards].forEach(card => card.parentNode.remove(card));
    Logger.log('Cleared the board!');
  }

  static get Symbols() {
    return Symbols;
  }

  get [Symbols.cards]() {
    return this.el.querySelectorAll('.card');
  }
}
