export default interface IOrangeCore {
  appPath: string
  minimize: () => void
  maximize: () => void
  close: () => void
  createNativeImage: (path: string) => any
  generateID: () => string
}
