import { observable, observe, action, computed } from 'mobx';

import { OrangePosition, OrangeSize, OrangeStyle } from './index';
import IOrangeItem from './IOrangeItem';

abstract class IOrangePrimitive extends IOrangeItem {
  @observable public angle: number;
  @observable public style: OrangeStyle;

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    super(name, position, size);
    this.style = { fillColor: 'red' };
  }

  @action
  public setAngle(angle: number) {
    this.angle = angle;
  }

  @action
  public setStyle(propertie: string, value: any) {
    const style = { [propertie]: value };
    this.style = { ...this.style, ...style };
  }
}

export default IOrangePrimitive;
