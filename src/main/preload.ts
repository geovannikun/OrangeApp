import electron from 'electron'
import process from 'process'
import sourceMapSupport from 'source-map-support'
import { v1 as uuidv1 } from 'uuid'
import { NodeVM } from 'vm2'
import { IOrangePlugin } from '../common/IOrangePlugin'
import IOrangeWindow from '../common/IOrangeWindow'
const { BrowserWindow } = electron.remote

const pluginVM = new NodeVM({
  console: 'inherit',
  sandbox: {},
  require: {
    external: true,
    builtin: ['fs', 'path'],
    root: './',
    context: 'sandbox',
  },
})

const focusedWindow = BrowserWindow.getFocusedWindow();

(window as IOrangeWindow).sourceMapSupport = sourceMapSupport;

(window as IOrangeWindow).orangeCore = {
  appPath: process.cwd(),
  minimize: () => {
    window!.close()
  },
  maximize: () => {
    if (focusedWindow!.isMaximized()) {
      focusedWindow!.unmaximize()
    } else {
      focusedWindow!.maximize()
    }
  },
  close: () => {
    focusedWindow!.close()
  },
  loadPlugin: (path: string) => {
    return pluginVM.require(path) as IOrangePlugin
  },
  createNativeImage: (path: string) => {
    return electron.nativeImage.createFromPath(path)
  },
  generateID: () => {
    return uuidv1()
  },
}