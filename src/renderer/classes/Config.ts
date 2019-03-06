import { IOrangeConfig } from '../../common/IOrangeConfig'
import OrangeCore from './OrangeCore'

export class Config implements IOrangeConfig {
  private plugins = ['plugins/sketch-utils']

  private getPluginPath(pluginPath: string) {
    return `${OrangeCore.appPath}/${pluginPath}`
  }

  private loadPlugins() {
    this.plugins.forEach((pluginPath) => {
      try {
        const plugin = OrangeCore.loadPlugin(this.getPluginPath(pluginPath))
        plugin.load(this)
      } catch (e) {
        console.error(e)
      }
    })
  }

  public startApplication() {
    this.loadPlugins()
  }

  public static fatory() {
    return new Config()
  }
}

export default Config.fatory()
