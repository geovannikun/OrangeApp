import { IOrangePlugin } from './IOrangePlugin'

export default interface IOrangeCore {
  appPath: string
  minimize: () => void
  maximize: () => void
  close: () => void
  loadPlugin: (path: string) => IOrangePlugin
  createNativeImage: (path: string) => any
  generateID: () => string
}
