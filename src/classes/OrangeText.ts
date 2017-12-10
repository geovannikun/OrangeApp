import paper, { Path, Point, PointText, Size } from 'paper';
import { observable, action } from 'mobx';

import IOrangePrimitive from './IOrangePrimitive';

export default class OrangeText extends IOrangePrimitive {
  @observable public text: string;
  @observable public fontSize: number;
  private group: paper.Group;
  private textItem: paper.PointText;

  @action
  public render(canvas: paper.PaperScope) {
    this.fontSize = 12;
    if (!this.textItem) {
      this.element = new Path.Rectangle(
        new Point(this.absolutePosition.x, this.absolutePosition.y),
        new Size(this.size.width, this.size.height),
      );
      this.textItem = new paper.PointText({
        content: this.text,
      });
      this.textItem.bounds.topLeft = new paper.Point(this.absolutePosition.x, this.absolutePosition.y);
      this.textItem.data.primitive = this;
      this.textItem.fontSize = this.fontSize;

      this.group = new paper.Group();
      this.group.addChild(this.element);
      this.group.addChild(this.textItem);
      this.group.clipped = true;
      this.applyStyle(this.textItem);
      super.render(canvas);
    }
  }

  @action
  public setStyle(propertie: string, value: any) {
    super.setStyle(propertie, value);
    if (this.textItem) {
      this.applyStyle(this.textItem);
    }
  }

  @action
  public setPosition(x: number, y: number) {
    super.setPosition(x, y);
    if (this.textItem) {
      this.textItem.bounds.topLeft = new paper.Point(this.absolutePosition.x, this.absolutePosition.y);
    }
  }

  @action
  public setText(text: string) {
    this.text = text;
    if (this.textItem) {
      this.textItem.content = this.text;
    }
  }

  @action
  public setFontSize(fontSize: number) {
    console.log('Changing font size: ', fontSize);
    this.fontSize = fontSize;
    if (this.textItem) {
      this.textItem.fontSize = this.fontSize;
      this.setPosition(this.position.x, this.position.y);
    }
  }

}
