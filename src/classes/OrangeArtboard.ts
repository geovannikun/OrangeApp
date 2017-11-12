import paper, { Path, Point, PointText, Size } from 'paper';

import IOrangeItem from './IOrangeItem';
import { OrangeSize, OrangePosition } from './index';

export default class OrangeArtboard {
  public id: string;
  public name: string;
  public background: paper.Item;
  public canvas: paper.PaperScope;

  private _position: OrangePosition;
  private _size: OrangeSize;
  private _selected: boolean;
  private _children: IOrangeItem[] = new Array<IOrangeItem>();

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    this.id = (new Date().valueOf()).toString();
    this.name = name;
    this._position = position;
    this._size = size;
  }

  get position(): OrangePosition {
    return this._position;
  }
  set position(position: OrangePosition) {
    this._position = position;
    if (this.background) {
      this.background.bounds.topLeft = new paper.Point(this._position.x, this._position.y);
    }
  }
  get size(): OrangeSize {
    return this._size;
  }
  set size(size: OrangeSize) {
    this._size = size;
    if (this.background) {
      this.background.bounds = new paper.Rectangle(
        this.background.bounds.topLeft,
        new paper.Point(this._position.x + size.width, this._position.y + size.height),
      );
    }
  }
  get selected(): boolean {
    return this._selected;
  }
  set selected(selected: boolean) {
    this._selected = selected;
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

  public render(canvas: paper.PaperScope) {
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
    this.background.fillColor = 'white';
    this._children.forEach((element: IOrangeItem) => {
      element.render(canvas);
    });
  }
}
