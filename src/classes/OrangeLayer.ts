import paper, { Path, Point, PointText, Size } from 'paper';
import { observable, action, computed } from 'mobx';

import { OrangeSize, OrangePosition } from './index';

import IOrangeItem from './IOrangeItem';

export default class OrangeLayer extends IOrangeItem {
  public canvas: paper.PaperScope;

  @observable public children: IOrangeItem[] = new Array<IOrangeItem>();

  @action
  public add(value: IOrangeItem, position?: OrangePosition) {
    value.parent = this;
    value.setPosition(
      position ? position.x : value.absolutePosition.x - this.absolutePosition.x,
      position ? position.y : value.absolutePosition.y - this.absolutePosition.y,
    );
    if (this.canvas && !value.rendered) {
      value.render(this.canvas);
    }
    this.children.push(value);
  }

  @action
  public setPosition(x: number, y: number) {
    super.setPosition(x, y);
    this.children.forEach((child) => {
      child.setPosition(
        child.absolutePosition.x - this.absolutePosition.x,
        child.absolutePosition.y - this.absolutePosition.y,
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
