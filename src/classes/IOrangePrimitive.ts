import paper from 'paper';

import { OrangePosition, OrangeSize, OrangeStyle } from './index';
import { debug } from 'util';
import IOrangeItem from './IOrangeItem';

abstract class IOrangePrimitive extends IOrangeItem {
  public id: string;
  public name: string;
  public element: paper.Item;

  private _angle: number;
  private _style: OrangeStyle;

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    super(name, position, size);
    this._style = { fillColor: 'red' };
  }

  public position_overload() {
    if (this.element) {
      this.element.bounds.topLeft = new paper.Point(
        this.parent.position.x + this.position.x,
        this.parent.position.y + this.position.y,
      );
    }
  }
  public size_overload() {
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

  public render_overload(canvas: paper.PaperScope) {
    this.generate(canvas);
    this.applyStyle();
  }
}

export default IOrangePrimitive;
