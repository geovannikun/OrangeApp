import paper, { Path, Point, PointText, Size } from 'paper';
import { observable, action } from 'mobx';

import IOrangePrimitive from './IOrangePrimitive';

export default class OrangeText extends IOrangePrimitive {
  @observable public text: string;

  @action
  public render(canvas: paper.PaperScope) {
    if (!this.element) {
      this.element = new paper.PointText({
        content: this.text,
        point: [this.absolutePosition.x, this.absolutePosition.y],
      });
      this.element.data.primitive = this;
      super.render(canvas);
    }
  }

  @action
  public setText(text: string) {
    this.text = text;
    if (this.element) {
      (this.element as paper.PointText).content = this.text;
    }
  }

}
