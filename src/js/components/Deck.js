import { mix, Mixin } from 'mixwith';
import { Renderable } from '../mixins/Renderable';
import { CardContainer } from './CardContainer';

export class Deck extends mix(class {}).with(Renderable) {
  constructor() {
    super(document.createElement('div'));

    this.el.classList.add('deck');

    this.cardContainer = new CardContainer();
    this.cardContainer.renderTo(this);
  }

}
