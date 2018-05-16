import { observable, autorun, action, computed } from 'mobx';
import { OrangePlugin } from '../classes';

export default class AppStore {
  @observable public plugins: OrangePlugin[] = [];

  @computed public get acceptableTypes(): any {
    return this.plugins.reduce((prev: any, current: OrangePlugin) => {
      current.mimeTypes.forEach((val) => {
        prev[val] = current;
      });
      return prev;
    }, {});
  }

  @action public addPlugin(...plugins: OrangePlugin[]) {
    this.plugins = [...this.plugins, ...plugins];
  }
}
