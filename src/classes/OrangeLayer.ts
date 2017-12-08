import paper, { Path, Point, PointText, Size } from 'paper';
import { observable, action, computed } from 'mobx';

import { OrangeSize, OrangePosition } from './index';

import IOrangeItem from './IOrangeItem';

export default class OrangeLayer extends IOrangeItem {
  public canvas: paper.PaperScope;

  @observable public children: IOrangeItem[] = new Array<IOrangeItem>();

  @action
  public add(value: IOrangeItem, position?: OrangePosition) {
    value.setParent(this);
    this.children.push(value);
    if (this.canvas && !value.rendered) {
      value.render(this.canvas);
    }
  }

  @action
  public setPosition(x: number, y: number) {
    const posDiff = {
      x: x - this.position.x,
      y: y - this.position.y,
    };
    super.setPosition(x, y);
    this.children.forEach((child) => {
      child.setPosition(
        child.position.x + posDiff.x,
        child.position.y + posDiff.y,
      );
    });
  }

  @action
  public remove(item: IOrangeItem) {
    this.children = this.children.filter((child) => child !== item);
  }

  @action
  public render(canvas: paper.PaperScope) {
    super.render(canvas);
    this.canvas = canvas;
    this.children.forEach((element: IOrangeItem) => {
      element.render(canvas);
    });
  }
}
