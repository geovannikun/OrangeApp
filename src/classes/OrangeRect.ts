import paper, { Path, Size, Point } from 'paper';

import IOrangePrimitive from './IOrangePrimitive';

export default class OrangeRect extends IOrangePrimitive {
  public generate(canvas: paper.PaperScope) {
    this.element = new Path.Rectangle(
      new Point(
        this.parent.position.x + this.position.x,
        this.parent.position.y + this.position.y,
      ),
      new Size(this.size.width, this.size.height),
    );
  }
}
