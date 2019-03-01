import IOrangeCore from './IOrangeCore'

export default interface IOrangeWindow extends Window {
  sourceMapSupport: any
  orangeCore: IOrangeCore
}
