import { Logger } from '../Logger';
import { mix, Mixin } from 'mixwith';
import { Renderable } from '../mixins/Renderable';
import { CardContainer } from './CardContainer';

export class Stack extends mix(class {}).with(Renderable) {
  constructor(id) {
    super(document.createElement('div'));

    this.el.classList.add('stack');
    this.el.setAttribute('id', id);

    this.cardContainer = new CardContainer();
    this.cardContainer.renderTo(this);
  }
  renderTo(target) {
    super.renderTo(...arguments);

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();

      const cardEl = e.target;
      if (!cardEl.isSameNode(this.cardContainer.el.lastChild)) {
        return;
      }

      const card = cardEl.playingCard;
      // todo: maybe can reveal without checking if hidden
      if (card.hidden) {
        card.reveal();
        Logger.log(`Revealed [${card}]`);
      }
    });
    this.el.addEventListener('dragstart', (e) => {
      // This handler takes care of dragging multiple cards on stacks. The
      // default dragstart handler takes care of dragging single cards on
      // all containers.
      if (!e.target.isSameNode(this.cardContainer.el.lastChild)) {
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
    this.el.addEventListener('drop', (e) => {
      const cardIds = e.dataTransfer.getData('text');
      const dragCards = this.getCardEls(cardIds).map(cardEl => cardEl.playingCard);
      const topCard = this.cardContainer.el.hasChildNodes() ?
        this.cardContainer.el.lastChild.playingCard : null;

      if (target.rules.drop.stack(dragCards[0], topCard)) {
        dragCards.forEach(card => this.cardContainer.el.appendChild(card.el));
        Logger.log(`Dropped [${dragCards.join(', ')}] on ${this.cardContainer.el.id}`);
      }
    });
  }
}
