import IOrangePrimitive from './IOrangePrimitive';
import paper, { Path, Point, PointText, Size, Group } from 'paper';
import { observable, action, computed } from 'mobx';

import { OrangeSize, OrangePosition } from './index';

import OrangeLayer from './OrangeLayer';
import IOrangeItem from './IOrangeItem';

export default class OrangeArtboard extends OrangeLayer {
  public background: paper.Item;
  private backgroundClip: paper.Item;
  private titleItem: paper.PointText;
  private group: paper.Group;

  @action
  public setName(name: string) {
    super.setName(name);
    this.titleItem.content = name;
  }

  @action
  public setPosition(x: number, y: number) {
    super.setPosition(x, y);
    if (this.background) {
      this.titleItem.point = new paper.Point(this.absolutePosition.x, this.absolutePosition.y - 10);
      this.background.bounds.topLeft = new paper.Point(this.absolutePosition.x, this.absolutePosition.y);
      this.backgroundClip.bounds.topLeft = new paper.Point(this.absolutePosition.x, this.absolutePosition.y);
    }
  }

  @action
  public setSize(width: number, height: number) {
    super.setSize(width, height);
    if (this.background) {
      const newBounds = new paper.Rectangle(
        this.background.bounds.topLeft,
        new paper.Point(
          this.absolutePosition.x + this.size.width,
          this.absolutePosition.y + this.size.height,
        ),
      );
      this.background.bounds = newBounds;
      this.backgroundClip.bounds = newBounds;
    }
  }

  @action
  public add(value: IOrangeItem, position?: OrangePosition) {
    super.add(value, position);
    this.addToGroup(value);
    this.group.clipped = true;
  }

  private addToGroup(item: IOrangeItem) {
    if (item instanceof IOrangePrimitive) {
      this.group.addChild(item.element);
    } else if (item instanceof OrangeLayer) {
      item.children.forEach((subItem) => this.addToGroup(subItem));
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
    this.backgroundClip = new Path.Rectangle(
      new Point(this.absolutePosition.x, this.absolutePosition.y),
      new Size(this.size.width, this.size.height),
    );
    this.background = new Path.Rectangle(
      new Point(this.absolutePosition.x, this.absolutePosition.y),
      new Size(this.size.width, this.size.height),
    );
    this.background.fillColor = 'white';
    this.backgroundClip.fillColor = 'white';
    this.group = new Group();
    this.group.clipped = true;
    this.group.addChild(this.backgroundClip);
    this.group.addChild(this.background);
  }
}
