import paper from 'paper';
import { observable, action, computed } from 'mobx';

import { OrangePosition, OrangeSize, OrangeLayer } from './index';

abstract class IOrangeItem {
  public id: string;
  @observable public name: string;
  @observable public parent: OrangeLayer;

  @observable public position: OrangePosition;
  @observable public size: OrangeSize;

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    this.id = (new Date().valueOf()).toString();
    this.name = name;
    this.position = position;
    this.size = size;
  }

  @action
  public setName(name: string) {
    this.name = name;
  }

  @computed
  get absolutePosition(): OrangePosition {
    return new OrangePosition(
      this.position.x + (this.parent ? this.parent.absolutePosition.x : 0),
      this.position.y + (this.parent ? this.parent.absolutePosition.y : 0),
     );
  }

  @action
  public setPosition(x: number, y: number) {
    const position = new OrangePosition(x, y);
    position.x = position.x < 0 ? this.position.x : position.x;
    position.y = position.y < 0 ? this.position.y : position.y;
    position.x = position.x + this.size.width > this.parent.size.width ? this.position.x : position.x;
    position.y = position.y + this.size.height > this.parent.size.height ? this.position.y : position.y;
    this.position = position;
  }

  @action
  public setSize(width: number, height: number) {
    width = width <= 0 ? this.size.width : width;
    height = height <= 0 ? this.size.height : height;
    this.size = new OrangeSize(width, height);
  }

  public abstract generate(canvas: paper.PaperScope): void;
  public abstract render_overload(canvas: paper.PaperScope): void;

  public render(canvas: paper.PaperScope) {
    this.generate(canvas);
    this.render_overload(canvas);
  }
}

export default IOrangeItem;
