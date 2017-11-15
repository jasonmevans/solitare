import CardContainer from './CardContainer';
import Renderable from '../mixins/Renderable';

import { mix } from 'mixwith';

export default class Deal extends mix(class {}).with(Renderable) {
  constructor() {
    super(document.createElement('div'));

    this.el.classList.add('deal');

    this.cardContainer = new CardContainer();
    this.cardContainer.renderTo(this);
  }
}
