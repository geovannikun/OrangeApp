import OrangePosition from './OrangePosition';
import paper from 'paper';
import { observable, action } from 'mobx';
import { IOrangeItem, OrangeSize } from './index';

import OrangeLayer from './OrangeLayer';

class OrangePage extends OrangeLayer {
  constructor(name: string) {
    super(name, new OrangePosition(0, 0), new OrangeSize(0, 0));
  }

  @action
  public render(canvas: paper.PaperScope) {
    canvas.project.clear();
    super.render(canvas);
  }
}

export default OrangePage;
