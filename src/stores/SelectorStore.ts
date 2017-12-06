import { observable, autorun, action, computed } from 'mobx';
import { IOrangeItem, OrangeArtboard } from '../classes';
import paper, {
  Group,
  Path,
  Point,
  Rectangle,
  Size,
  Tool,
} from 'paper';

export default class SelectorStore {
  @observable public selecteds: IOrangeItem[] = [];
  private _selectionRect: Path.Rectangle;

  constructor() {
    autorun(() => {
      this.update();
    });
  }

  public create() {
    this._selectionRect = new Path.Rectangle({
      fillColor: 'rgba(0, 0, 0, .0)',
      point: [-10, -10],
      size: [100, 100],
      strokeColor: 'orange',
    });
    this._selectionRect.visible = true;
  }

  @computed get selectedArtboards() {
    return this.selecteds.filter((item) => item instanceof OrangeArtboard);
  }

  @action
  public add(value: IOrangeItem) {
    if (value &&  this.selecteds.indexOf(value) === -1) {
      this.selecteds.push(value);
    }
  }

  @action
  public remove(value: IOrangeItem) {
    if (value) {
      this.selecteds = this.selecteds.filter((selected) => selected !== value);
    }
  }

  @action
  public clear() {
    this.selecteds.length = 0;
  }

  private update() {
    if (this.selecteds.length) {
      const x1 = Math.min(...this.selecteds.map((value) => value.parent.position.x + value.position.x));
      const y1 = Math.min(...this.selecteds.map((value) => value.parent.position.y + value.position.y));
      const x2 = Math.max(...this.selecteds.map((value) =>
        value.parent.position.x + value.position.x + value.size.width,
      ));
      const y2 = Math.max(...this.selecteds.map((value) =>
        value.parent.position.y + value.position.y + value.size.height,
      ));
      console.log(x1, y1, x2, y2);
      this._selectionRect.bounds = new Rectangle(
        new Point(x1 - 2, y1 - 2),
        new Point(x2 + 2, y2 + 2),
      );
      this._selectionRect.visible = true;
    } else {
      this._selectionRect.visible = false;
    }
  }

}
