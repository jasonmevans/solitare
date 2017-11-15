import { Mixin } from 'mixwith';

const Renderable = Mixin(superclass => class extends superclass {
  constructor(el, ...args) {
    super(...args);
    this.el = el;
  }
  renderTo(target) {
    if (this.el) {
      if (target instanceof Renderable) {
        target.el.appendChild(this.el);
      } else {
        target.appendChild(this.el);
      }
    } else {
      throw new Error('this.el is null');
    }
  }
});

export default Renderable;
