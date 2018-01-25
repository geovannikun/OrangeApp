import OrangePosition from './OrangePosition';
import { observable, action } from 'mobx';
import { IOrangeItem, OrangeSize } from './index';

import OrangeLayer from './OrangeLayer';

class OrangePage extends OrangeLayer {
  constructor(name: string) {
    super(name, new OrangePosition(0, 0), new OrangeSize(0, 0));
  }
}

export default OrangePage;
