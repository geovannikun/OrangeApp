import { observable, observe, action, computed } from 'mobx';
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
    observe(this.selecteds, (change) => {
      this.update();
    });
  }

  public create() {
    this._selectionRect = new Path.Rectangle({
      fillColor: 'rgba(0, 0, 0, .1)',
      point: [0, 0],
      size: [100, 100],
      strokeColor: 'red',
    });
    this._selectionRect.visible = false;
  }

  @computed get selectedArtboards() {
    return this.selecteds.filter((item) => item instanceof OrangeArtboard);
  }

  @action
  public select(value: IOrangeItem, keep: boolean = false) {
    if (!keep) {
      this.selecteds.length = 0;
    }
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
      const x1 = Math.min(...this.selecteds.map((value) => value.absolutePosition.x));
      const y1 = Math.min(...this.selecteds.map((value) => value.absolutePosition.y));
      const x2 = Math.max(...this.selecteds.map((value) =>
        value.absolutePosition.x + value.size.width,
      ));
      const y2 = Math.max(...this.selecteds.map((value) =>
        value.absolutePosition.y + value.size.height,
      ));
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
