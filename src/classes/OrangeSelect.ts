import IOrangeItem from './IOrangeItem';
import paper, {
  Group,
  Path,
  Point,
  Rectangle,
  Size,
  Tool,
} from 'paper';

export default class OrangeSelect {
  private _selecteds: IOrangeItem[] = [];
  private _selectionRect: Path.Rectangle;

  public create() {
    this._selectionRect = new Path.Rectangle({
      fillColor: 'rgba(0, 0, 0, 1)',
      point: [0, 0],
      size: [1, 1],
      strokeColor: 'black',
    });
    this._selectionRect.visible = false;
  }

  public get selecteds(): IOrangeItem[] {
    return this._selecteds;
  }

  public add(value: IOrangeItem) {
    if (value) {
      this.selecteds.push(value);
      this.update();
    }
  }

  public remove(value: IOrangeItem) {
    if (value) {
      this._selecteds = this.selecteds.filter((selected) => selected !== value);
      this.update();
    }
  }

  public clear() {
    this._selecteds.length = 0;
    this.update();
  }

  private update() {
    if (this._selecteds.length) {
      const x1 = Math.min(...this._selecteds.map((value) => value.position.x));
      const y1 = Math.min(...this._selecteds.map((value) => value.position.y));
      const x2 = Math.max(...this._selecteds.map((value) => value.position.x + value.size.width));
      const y2 = Math.max(...this._selecteds.map((value) => value.position.y + value.size.height));
      console.log(x1, y1, x2, y2);
      this._selectionRect.bounds = new Rectangle(
        new Point(x1 - 1, y1 - 1),
        new Point(x2 + 1, y2 + 1),
      );
      this._selectionRect.visible = true;
    } else {
      this._selectionRect.visible = false;
    }
  }

}
