import electron from 'electron'
import sourceMapSupport from 'source-map-support'
import { v1 as uuidv1 } from 'uuid'
import IOrangeWindow from '../common/IOrangeWindow'
const { BrowserWindow, app } = electron.remote

const focusedWindow = BrowserWindow.getFocusedWindow();

(window as IOrangeWindow).sourceMapSupport = sourceMapSupport;

(window as IOrangeWindow).orangeCore = {
  appPath: app.getAppPath(),
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
  createNativeImage: (path: string) => {
    return electron.nativeImage.createFromPath(path)
  },
  generateID: () => {
    return uuidv1()
  },
}
