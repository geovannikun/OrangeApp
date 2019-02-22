import { remote } from 'electron'

interface IPlugin {
  load: (config: Config) => boolean
}
export class Config {
  private plugins = ['src/plugins/sketch-utils/index']
  private _config: Config

  private getPluginPath(pluginPath: string) {
    return `${remote.app.getAppPath()}/${pluginPath}`
  }

  private loadPlugins() {
    this.plugins.forEach((pluginPath) => {
      try {
        const getPluginPath = this.getPluginPath
        const plugin: IPlugin = eval('require(getPluginPath(pluginPath))')
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
