import { mix, Mixin } from 'mixwith';
import CardContainer from './CardContainer';
import Logger from '../Logger';
import Renderable from '../mixins/Renderable';

export default class Deck extends mix(class {}).with(Renderable) {
  constructor() {
    super(document.createElement('div'));

    this.el.classList.add('deck');

    this.cardContainer = new CardContainer();
    this.cardContainer.renderTo(this);
  }
  renderTo(target) {
    super.renderTo(target);

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();

      const dealEl = target.deal.cardContainer.el;

      if (this.cardContainer.el.hasChildNodes()) {
        target.flip(target.dealCards(3));
      } else {
        // move all cards from #deal to #deck
        [...dealEl.children]
          .reverse() // must reverse the stack of cards as you would flip the deal set over
          .map(node => node.playingCard)
          .forEach((card) => {
            card.conceal();
            card.renderTo(this.cardContainer);
          });
        Logger.log('Turned over the deck...');
      }
    });
  }
}
