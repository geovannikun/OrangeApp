import paper from 'paper';

import { OrangePosition, OrangeSize, OrangeLayer } from './index';
import { debug } from 'util';

abstract class IOrangeItem {
  public id: string;
  public name: string;
  public parent: OrangeLayer;

  private _position: OrangePosition;
  private _size: OrangeSize;
  private _selected: boolean;

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    this.id = (new Date().valueOf()).toString();
    this.name = name;
    this._position = position;
    this._size = size;
    this._selected = true;
  }

  public abstract position_overload(): void;
  public abstract size_overload(): void;
  public abstract selected_overload(): void;

  get position(): OrangePosition {
    return this._position;
  }
  set position(position: OrangePosition) {
    position.x = position.x < 0 ? this.position.x : position.x;
    position.y = position.y < 0 ? this.position.y : position.y;
    position.x = position.x + this.size.width > this.parent.size.width ? this.position.x : position.x;
    position.y = position.y + this.size.height > this.parent.size.height ? this.position.y : position.y;
    this._position = position;
    this.position_overload();
  }
  get size(): OrangeSize {
    return this._size;
  }
  set size(size: OrangeSize) {
    size.width = size.width <= 0 ? this.size.width : size.width;
    size.height = size.height <= 0 ? this.size.height : size.height;
    this._size = size;
    this.size_overload();
  }
  get selected(): boolean {
    return this._selected;
  }
  set selected(selected: boolean) {
    this._selected = selected;
    this.selected_overload();
  }

  public abstract generate(canvas: paper.PaperScope): void;
  public abstract render_overload(canvas: paper.PaperScope): void;

  public render(canvas: paper.PaperScope) {
    this.generate(canvas);
    this.render_overload(canvas);
  }
}

export default IOrangeItem;
