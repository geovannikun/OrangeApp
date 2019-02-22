import { OrangeSize } from './index'
import OrangePosition from './OrangePosition'

import OrangeLayer from './OrangeLayer'

class OrangePage extends OrangeLayer {
  constructor(name: string) {
    super(name, new OrangePosition(0, 0), new OrangeSize(0, 0))
  }
}

export default OrangePage
