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
}
