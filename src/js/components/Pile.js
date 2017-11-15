import { mix, Mixin } from 'mixwith';
import { Renderable } from '../mixins/Renderable';
import { CardContainer } from './CardContainer';

export class Pile extends mix(class {}).with(Renderable) {
  constructor(cls) {
    super(document.createElement('div'));

    this.el.classList.add('pile', cls);

    this.cardContainer = new CardContainer();
    this.cardContainer.renderTo(this);
  }
  renderTo(target) {
    super.renderTo(...arguments);

    this.el.addEventListener('drop', (e) => {
      const cardId = e.dataTransfer.getData('text');
      const dragCard = document.getElementById(cardId).playingCard;
      const topCard = this.cardContainer.el.hasChildNodes() ?
        this.cardContainer.el.lastChild.playingCard : null;

      if (target.rules.drop.pile(dragCard, topCard)) {
        dragCard.renderTo(this.cardContainer);
        Logger.log(`Dropped [${dragCard}] on ${this.el.id}`);
      }
    });
  }
}
