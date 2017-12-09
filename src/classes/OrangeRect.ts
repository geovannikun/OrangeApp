import paper, { Path, Size, Point } from 'paper';
import { observable, action } from 'mobx';

import IOrangePrimitive from './IOrangePrimitive';

export default class OrangeRect extends IOrangePrimitive {

  @action
  public render(canvas: paper.PaperScope) {
    if (!this.element) {
      this.element = new Path.Rectangle(
        new Point(
          this.absolutePosition.x,
          this.absolutePosition.y,
        ),
        new Size(this.size.width, this.size.height),
      );
      this.element.data.primitive = this;
      super.render(canvas);
    }
  }
}
