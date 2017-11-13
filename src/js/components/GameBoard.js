import './GameBoard.scss';

import { mix } from 'mixwith';
import { Renderable } from '../mixins/Renderable';
import { Logger } from '../Logger';
import { Stack } from './Stack';
import { Pile } from './Pile';
import { Deal } from './Deal';
import { Deck } from './Deck';

const Symbols = {
  cards: Symbol('cards'),
  board: Symbol('board'),
  deck: Symbol('deck'),
  deal: Symbol('deal'),
  stacks: Symbol('stacks'),
  piles: Symbol('piles')
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
    this.piles.forEach(pile => pile.renderTo(this.el));
    this.deal.renderTo(this.el);
    this.deck.renderTo(this.el);
    this.stacks.forEach(stack => stack.renderTo(this.el));
    super.renderTo(target);
  }

  setupEvents() {
    this[Symbols.deck].addEventListener('click', (e) => {
      e.stopPropagation();

      const deckEl = this[Symbols.deck];
      const dealEl = this[Symbols.deal];

      if (deckEl.hasChildNodes()) {
        this.flip(this.dealCards(3));
      } else {
        // move all cards from #deal to #deck
        Array.from(dealEl.childNodes)
        .reverse() // must reverse the stack of cards as you would flip the deal set over
        .forEach(node => {
          node.playingCard.conceal();
          deckEl.appendChild(node);
        });
        Logger.log('Turned over the deck...');
      }
    });

    this[Symbols.stacks].forEach(stackEl => {
      stackEl.addEventListener('click', (e) => {
        e.stopPropagation();

        const cardEl = e.target;
        if (!cardEl.isSameNode(stackEl.lastChild)) {
          return;
        }

        const card = cardEl.playingCard;
        // todo: maybe can reveal without checking if hidden
        if (card.hidden) {
          card.reveal();
          Logger.log(`Revealed [${card}]`);
        }
      });
      stackEl.addEventListener('dragstart', (e) => {
        // This handler takes care of dragging multiple cards on stacks. The
        // default dragstart handler takes care of dragging single cards on
        // all containers.
        if (!e.target.isSameNode(stackEl.lastChild)) {
          e.stopPropagation();

          let cardEls = [e.target];

          let cardEl = e.target;
          while (cardEl.nextSibling) {
            cardEls.push(cardEl.nextSibling);
            cardEl = cardEls[cardEls.length-1];
          }

          e.dataTransfer.setData('text', cardEls.map(cardEl => cardEl.id).join('|'));
          Logger.log(`Dragging multiple cards [${cardEls.map(cardEl => cardEl.playingCard).join(', ')}]`);
        }
      });
      stackEl.addEventListener('drop', (e) => {
        const cardIds = e.dataTransfer.getData('text');
        const dragCards = this.getCardEls(cardIds).map(cardEl => cardEl.playingCard);
        const topCard = stackEl.hasChildNodes() ? stackEl.lastChild.playingCard : null;

        if (rules.drop.stack(dragCards[0], topCard)) {
          dragCards.forEach(card => stackEl.appendChild(card.el));
          Logger.log(`Dropped [${dragCards.join(', ')}] on ${stackEl.id}`);
        }
      });

    });

    this[Symbols.piles].forEach(pileEl => {
      pileEl.addEventListener('drop', (e) => {
        const cardId = e.dataTransfer.getData('text');
        const dragCard = document.getElementById(cardId).playingCard;
        const topCard = pileEl.hasChildNodes() ? pileEl.lastChild.playingCard : null;

        if (rules.drop.pile(dragCard, topCard)) {
          pileEl.appendChild(dragCard.el);
          Logger.log(`Dropped [${dragCard}] on ${pileEl.id}`);
        }
      });
    });

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
      if (dblClickContainer.isSameNode(this[Symbols.deck])) {
        return false;
      }
      if (e.target.classList.contains('card') && !e.target.playingCard.hidden) {
        this.autoPlaceCard(e.target);
      }
    });
  }

  autoPlaceCard(cardEl) {
    let cardPiles = Array.from(this[Symbols.piles]);
    let dropPile = cardPiles.find(pile => {
      let topCard = pile.lastChild ? pile.lastChild.playingCard : null;
      return this.rules.drop.pile(cardEl.playingCard, topCard);
    });

    if (dropPile) {
      dropPile.appendChild(cardEl);
      return;
    }

    let cardStacks = Array.from(this[Symbols.stacks]);
    let dropStack = cardStacks.find(stack => {
      let topCard = stack.lastChild ? stack.lastChild.playingCard : null;
      return this.rules.drop.stack(cardEl.playingCard, topCard);
    });

    if (dropStack) {
      dropStack.appendChild(cardEl);
      return;
    }
  }

  init() {
    this[Symbols.stacks].forEach((stack, index) => {
      this.dealCards(index + 1).forEach((card, i) => {
        if (i === index) {
          card.playingCard.reveal();
        }
        stack.appendChild(card);
      });
    });

    Logger.log('--------------------------------------------');

    this.flip(this.dealCards(3));
  }

  getCardEls(cardIds, delim = '|') {
    const query = cardIds.split(delim).map(id => '#'+id).join(',');
    return Array.from(this.el.querySelectorAll(query));
  }

  deal(n) {
    const deckEl = this[Symbols.deck];
    const cards = [];
    for (let i = 0; i < n && deckEl.hasChildNodes(); i++ ) {
      cards.push(deckEl.removeChild(deckEl.lastChild));
    }
    Logger.log(`Dealing cards: [${cards.map(card => card.playingCard).join(', ')}]`);
    return cards;
  }

  flip(cards) {
    const dealEl = this[Symbols.deal];
    cards.forEach(card => {
      dealEl.appendChild(card.playingCard.reveal().el);
    });
  }

  clear() {
    this[Symbols.cards].forEach(card => card.parentNode.remove(card));
    Logger.log(`Cleared the board!`);
  }

  setupDOM() {
    const board = document.createElement('div');
    board.setAttribute('id', 'game-board');
    document.body.appendChild(board);

    function appendNode(parent, type, cls) {
      const node = document.createElement('div');
      if (type) {
        node.classList.add(type);
      }
      node.classList.add(cls);
      parent.appendChild(node);
      const container = document.createElement('div');
      container.classList.add('card-container');
      node.appendChild(container);
    }

    ['Spade', 'Heart', 'Club', 'Diamond']
      .forEach(appendNode.bind(null, board, 'pile'));

    ['deal', 'deck']
      .forEach(appendNode.bind(null, board, null));

    ['stack-1', 'stack-2', 'stack-3', 'stack-4', 'stack-5', 'stack-6', 'stack-7']
      .forEach(appendNode.bind(null, board, 'stack'));

  }

  static get Symbols() {
    return Symbols;
  }

  get [Symbols.cards]() {
    return this.el.querySelectorAll('.card');
  }
  get [Symbols.deck]() {
    return this.el.querySelector('.deck .card-container');
  }
  get [Symbols.deal]() {
    return this.el.querySelector('.deal .card-container');
  }
  get [Symbols.stacks]() {
    return this.el.querySelectorAll('.stack .card-container');
  }
  get [Symbols.piles]() {
    return this.el.querySelectorAll('.pile .card-container');
  }
}
