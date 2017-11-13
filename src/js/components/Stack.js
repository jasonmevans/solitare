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

}
