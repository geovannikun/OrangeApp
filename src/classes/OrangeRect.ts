import paper, { Path, Size, Point } from 'paper';

import IOrangeItem from './IOrangeItem';

export default class OrangeRect extends IOrangeItem {
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
