import paper, { Path, Point, PointText, Size } from 'paper';

import { OrangeSize, OrangePosition } from './index';

import IOrangeItem from './IOrangeItem';

export default class OrangeLayer extends IOrangeItem {
  public canvas: paper.PaperScope;

  private _children: IOrangeItem[] = new Array<IOrangeItem>();

  public position_overload() {}
  public size_overload() {}
  public selected_overload() {
    this._children.forEach((element: IOrangeItem) => {
      element.selected = false;
    });
  }
  public get children(): IOrangeItem[] {
    return this._children;
  }
  public set children(value: IOrangeItem[]) {
    this._children = value;
  }

  public add(value: IOrangeItem) {
    value.parent = this;
    if (this.canvas) {
      value.render(this.canvas);
    }
    this._children.push(value);
  }

  public selectAll(value: boolean) {
    this._children.forEach((element: IOrangeItem) => {
      element.selected = value;
    });
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
    this._children.forEach((element: IOrangeItem) => {
      element.render(canvas);
    });
  }
}
