import IOrangePrimitive from './IOrangePrimitive';
import { observable, action, computed } from 'mobx';

import { OrangeSize, OrangePosition } from './index';

import OrangeLayer from './OrangeLayer';
import IOrangeItem from './IOrangeItem';

export default class OrangeArtboard extends OrangeLayer {
  @observable public background: string;

  @action
  public setBackground(background: string) {
    this.background = background;
  }
}
