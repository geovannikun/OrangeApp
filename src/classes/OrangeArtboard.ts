import paper, { Path, Point, PointText, Size } from 'paper';
import { observable, action, computed } from 'mobx';

import { OrangeSize, OrangePosition } from './index';

import OrangeLayer from './OrangeLayer';

export default class OrangeArtboard extends OrangeLayer {
  public background: paper.Item;
  private titleItem: paper.PointText;

  @action
  public setName(name: string) {
    super.setName(name);
    this.titleItem.content = name;
  }

  @action
  public setPosition(x: number, y: number) {
    super.setPosition(x, y);
    if (this.background) {
      this.background.bounds.topLeft = new paper.Point(this.absolutePosition.x, this.absolutePosition.y);
    }
  }

  @action
  public setSize(width: number, height: number) {
    super.setSize(width, height);
    if (this.background) {
      this.background.bounds = new paper.Rectangle(
        this.background.bounds.topLeft,
        new paper.Point(
          this.absolutePosition.x + this.size.width,
          this.absolutePosition.y + this.size.height,
        ),
      );
    }
  }

  @action
  public render(canvas: paper.PaperScope) {
    super.render(canvas);
    this.titleItem = new PointText({
      content: this.name,
      fillColor: 'white',
      fontFamily: 'Courier New',
      fontSize: 14,
      fontWeight: 'bold',
      point: [this.absolutePosition.x, this.absolutePosition.y - 10],
    });
    this.titleItem.data.primitive = this;
    this.background = new Path.Rectangle(
      new Point(this.absolutePosition.x, this.absolutePosition.y),
      new Size(this.size.width, this.size.height),
    );
    this.background.fillColor = 'white';
  }
}
