import paper, { Path, Point, PointText, Size } from 'paper';
import { observable, action, computed } from 'mobx';

import { OrangeSize, OrangePosition } from './index';

import IOrangeItem from './IOrangeItem';

export default class OrangeLayer extends IOrangeItem {
  public canvas: paper.PaperScope;

  @observable public children: IOrangeItem[] = new Array<IOrangeItem>();

  @action
  public add(value: IOrangeItem) {
    value.parent = this;
    if (this.canvas) {
      value.render(this.canvas);
    }
    this.children.push(value);
  }

  public generate(canvas: paper.PaperScope) {
    this.canvas = canvas;
    const name = new PointText({
      content: this.name,
      fillColor: 'white',
      fontFamily: 'Courier New',
      fontSize: 14,
      fontWeight: 'bold',
      point: [this.position.x, this.position.y - 10],
    });
  }

  public render_overload(canvas: paper.PaperScope) {
    this.children.forEach((element: IOrangeItem) => {
      element.render(canvas);
    });
  }
}
