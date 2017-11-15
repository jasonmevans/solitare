import { mix } from 'mixwith';
import Renderable from '../mixins/Renderable';

export default class CardContainer extends mix(class {}).with(Renderable) {
  constructor() {
    super(document.createElement('div'));
    this.el.classList.add('card-container');
  }
}
