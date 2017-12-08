import paper, { Path, Point, PointText, Size } from 'paper';
import { observable, action, computed, observe } from 'mobx';

import { OrangeSize, OrangePosition } from './index';

import IOrangeItem from './IOrangeItem';

export default class OrangeLayer extends IOrangeItem {
  public canvas: paper.PaperScope;

  @observable public children: IOrangeItem[] = new Array<IOrangeItem>();

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    super(name, position, size);
    if (Object.getPrototypeOf(this) === OrangeLayer.prototype) {
      observe(this.children, (change) => {
        this.updateSize();
      });
    }
  }

  @action
  public updateSize() {
    const x2 = Math.max(...this.children.map((value) =>
      value.absolutePosition.x + value.size.width,
    ));
    const y2 = Math.max(...this.children.map((value) =>
      value.absolutePosition.y + value.size.height,
    ));
    this.setSize(
      x2 - this.absolutePosition.x,
      y2 - this.absolutePosition.y,
    );
  }

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
