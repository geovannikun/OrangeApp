import paper from 'paper';

import { OrangePosition, OrangeSize, OrangeStyle, OrangeGuideline, OrangeArtboard } from './index';
import { debug } from 'util';

abstract class IOrangeItem {
  public id: string;
  public name: string;
  public element: paper.Item;
  public guidelines: OrangeGuideline;
  public parent: OrangeArtboard;

  private _position: OrangePosition;
  private _size: OrangeSize;
  private _angle: number;
  private _selected: boolean;
  private _style: OrangeStyle;

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    this.id = (new Date().valueOf()).toString();
    this.name = name;
    this._position = position;
    this._size = size;
    this._selected = true;
    this._style = { fillColor: 'red' };
    this.guidelines = new OrangeGuideline(this);
  }

  get position(): OrangePosition {
    return this._position;
  }
  set position(position: OrangePosition) {
    position.x = position.x < 0 ? this.position.x : position.x;
    position.y = position.y < 0 ? this.position.y : position.y;
    position.x = position.x + this.size.width > this.parent.size.width ? this.position.x : position.x;
    position.y = position.y + this.size.height > this.parent.size.height ? this.position.y : position.y;
    this._position = position;
    this.guidelines.itemMoved();
    if (this.element) {
      this.element.bounds.topLeft = new paper.Point(
        this.parent.position.x + this.position.x,
        this.parent.position.y + this.position.y,
      );
    }
  }
  get size(): OrangeSize {
    return this._size;
  }
  set size(size: OrangeSize) {
    size.width = size.width <= 0 ? this.size.width : size.width;
    size.height = size.height <= 0 ? this.size.height : size.height;
    this._size = size;
    if (this.element) {
      this.element.bounds.width = this.size.width;
      this.element.bounds.height = this.size.height;
    }
  }
  get angle(): number {
    return this._angle;
  }
  set angle(angle: number) {
    this._angle = angle;
    if (this.element) {
      this.element.rotation = this._angle;
    }
  }
  get selected(): boolean {
    return this._selected;
  }
  set selected(selected: boolean) {
    this._selected = selected;
    if (this.element) {
      this.element.selected = this._selected;
    }
  }
  get style(): OrangeStyle {
    return this._style;
  }
  set style(style: OrangeStyle) {
    this._style = { ...this._style, ...style };
    if (this.element) {
      this.applyStyle(style);
    }
  }

  private applyStyle(style?: OrangeStyle) {
    const styleToAplly = style || this.style;
    if (this.element) {
      for (const property in styleToAplly) {
        switch (property) {
          case 'fillColor':
            this.element.style.fillColor = styleToAplly.fillColor || '';
            break;
        }
      }
    }
  }

  public abstract generate(canvas: paper.PaperScope): void;

  public render(canvas: paper.PaperScope) {
    this.generate(canvas);
    this.applyStyle();
    this.guidelines.generate(canvas);
  }
}

export default IOrangeItem;
