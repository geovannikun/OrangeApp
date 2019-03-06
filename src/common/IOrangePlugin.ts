import { IOrangeConfig } from './IOrangeConfig'

export interface IOrangePlugin {
  load: (config: IOrangeConfig) => boolean
}
