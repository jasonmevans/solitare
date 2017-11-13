import { mix } from 'mixwith';
import { Renderable } from '../mixins/Renderable';

export class CardContainer extends mix(class {}).with(Renderable) {
  constructor() {
    super(document.createElement('div'));
    this.el.classList.add('card-container');
  }
}
