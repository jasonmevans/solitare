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

}
