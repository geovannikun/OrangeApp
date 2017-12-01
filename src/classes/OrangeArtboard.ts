import paper, { Path, Point, PointText, Size } from 'paper';

import { OrangeSize, OrangePosition } from './index';

import OrangeLayer from './OrangeLayer';

export default class OrangeArtboard extends OrangeLayer {
  public background: paper.Item;

  public position_overload() {
    if (this.background) {
      this.background.bounds.topLeft = new paper.Point(this.position.x, this.position.y);
    }
  }
  public size_overload() {
    if (this.background) {
      this.background.bounds = new paper.Rectangle(
        this.background.bounds.topLeft,
        new paper.Point(this.position.x + this.size.width, this.position.y + this.size.height),
      );
    }
  }

  public generate(canvas: paper.PaperScope) {
    super.generate(canvas);
    this.background = new Path.Rectangle(
      new Point(this.position.x, this.position.y),
      new Size(this.size.width, this.size.height),
    );
  }

  public render_overload(canvas: paper.PaperScope) {
    this.background.fillColor = 'white';
    super.render_overload(canvas);
  }
}
