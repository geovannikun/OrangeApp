import paper from 'paper';
import { observable, action, computed } from 'mobx';

import { OrangePosition, OrangeSize, OrangeStyle } from './index';
import IOrangeItem from './IOrangeItem';

abstract class IOrangePrimitive extends IOrangeItem {
  @observable public element: paper.Item;
  @observable public angle: number;
  @observable public style: OrangeStyle;

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    super(name, position, size);
    this.style = { fillColor: 'red' };
  }

  @action
  public setPosition(x: number, y: number) {
    super.setPosition(x, y);
    if (this.element) {
      this.element.bounds.topLeft = new paper.Point(
        this.parent.position.x + this.position.x,
        this.parent.position.y + this.position.y,
      );
    }
  }
  @action
  public setSize(width: number, height: number) {
    super.setSize(width, height);
    if (this.element) {
      this.element.bounds.width = this.size.width;
      this.element.bounds.height = this.size.height;
    }
  }
  @action
  public setAngle(angle: number) {
    this.angle = angle;
    if (this.element) {
      this.element.rotation = this.angle;
    }
  }
  @action
  public setStyle(style: OrangeStyle) {
    this.style = { ...this.style, ...style };
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

  public render_overload(canvas: paper.PaperScope) {
    this.generate(canvas);
    this.applyStyle();
  }
}

export default IOrangePrimitive;
