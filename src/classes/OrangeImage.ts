import paper, { Path, Size, Point } from 'paper';
import { observable, action } from 'mobx';

import IOrangePrimitive from './IOrangePrimitive';
import OrangePosition from './OrangePosition';
import OrangeSize from './OrangeSize';

export default class OrangeImage extends IOrangePrimitive {

  @observable public src: string;

  constructor(name: string, position: OrangePosition, size: OrangeSize, src: string) {
    super(name, position, size);
    this.src = src;
  }

  @action
  public setSize(width: number, height: number) {
    super.setSize(width, height);
    this.setPosition(this.position.x, this.position.y);
  }

  @action
  public render(canvas: paper.PaperScope) {
    if (!this.element) {
      this.element = new paper.Raster(this.src);
      this.element.data.primitive = this;
      this.element.on('load', () => {
        this.setPosition(0, 0);
      });
      super.render(canvas);
    }
  }
}
