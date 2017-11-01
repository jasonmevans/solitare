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
  constructor(rules, deck, draggable = true) {
    if (!draggable) return;

    this.rules = rules;
    this.el = document.querySelector('#game-board');

    deck.forEach(card => {
      this[Symbols.deck].appendChild(card.el);
    });

    this[Symbols.deck].addEventListener('click', (e) => {
      e.stopPropagation();

      const deckEl = this[Symbols.deck];
      const dealEl = this[Symbols.deal];

      if (deckEl.hasChildNodes()) {
        this.flip(this.deal(3));
      } else {
        // move all cards from #deal to #deck
        Array.from(dealEl.childNodes)
        .reverse() // must reverse the stack of cards as you would flip the deal set over
        .forEach(node => {
          node.playingCard.conceal();
          dealEl.removeChild(node);
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
        try {
          const cardIds = e.dataTransfer.getData('text');
          const dragCards = this.getCardEls(cardIds).map(cardEl => cardEl.playingCard);
          const topCard = stackEl.hasChildNodes() ? stackEl.lastChild.playingCard : null;

          if (rules.drop.stack(dragCards[0], topCard)) {
            dragCards.forEach(card => stackEl.appendChild(card.el));
            Logger.log(`Dropped [${dragCards.join(', ')}] on ${stackEl.id}`);
          }

        } catch (err) {
          Logger.error(err, e.target);
        }
      });
    });

    this[Symbols.piles].forEach(pileEl => {
      pileEl.addEventListener('drop', (e) => {
        try {
          const cardId = e.dataTransfer.getData('text');
          const dragCard = document.getElementById(cardId).playingCard;
          const topCard = pileEl.hasChildNodes() ? pileEl.lastChild.playingCard : null;

          if (rules.drop.pile(dragCard, topCard)) {
            pileEl.appendChild(dragCard.el);
            Logger.log(`Dropped [${dragCard}] on ${pileEl.id}`);
          }

        } catch (err) {
          Logger.error(err, e.target);
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
      if (document.elementFromPoint(e.x, e.y).parentNode.isSameNode(this[Symbols.deck])) {
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
      this.deal(index + 1).forEach((card, i) => {
        if (i === index) {
          card.playingCard.reveal();
        }
        stack.appendChild(card);
      });
    });

    Logger.log('--------------------------------------------');

    this.flip(this.deal(3));
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

  static get Symbols() {
    return Symbols;
  }

  get [Symbols.cards]() {
    return this.el.querySelectorAll('.card');
  }
  get [Symbols.deck]() {
    return this.el.querySelector('#deck');
  }
  get [Symbols.deal]() {
    return this.el.querySelector('#deal');
  }
  get [Symbols.stacks]() {
    return this.el.querySelectorAll('.stack');
  }
  get [Symbols.piles]() {
    return this.el.querySelectorAll('.pile');
  }
}
