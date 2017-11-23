import paper, { Path, Point, PointText, Size } from 'paper';

import { OrangeSize, OrangePosition } from './index';

import IOrangeItem from './IOrangeItem';

export default class OrangeArtboard extends IOrangeItem {
  public background: paper.Item;
  public canvas: paper.PaperScope;

  private _children: IOrangeItem[] = new Array<IOrangeItem>();

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
    this.background = new Path.Rectangle(
      new Point(this.position.x, this.position.y),
      new Size(this.size.width, this.size.height),
    );
  }

  public render_overload(canvas: paper.PaperScope) {
    this.background.fillColor = 'white';
    this._children.forEach((element: IOrangeItem) => {
      element.render(canvas);
    });
  }
}
