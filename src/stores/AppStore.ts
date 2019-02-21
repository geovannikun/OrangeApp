import { observable, autorun, action, computed } from 'mobx';
import { OrangePlugin, OrangeMimeType } from '../classes';

export default class AppStore {
  @observable public plugins: OrangePlugin[] = [];
  @observable public mimeTypes: {[mimeType: string]: OrangeMimeType} = {};

  @action public importFile(mimeType: string, file: File): boolean {
    if (this.mimeTypes[mimeType] && this.mimeTypes[mimeType].parseFile) {
      const page = this.mimeTypes[mimeType].parseFile(file);
      return !!page;
    }
    return false;
  }

  @action public addPlugin(...plugins: OrangePlugin[]) {
    this.plugins = [...this.plugins, ...plugins];
  }
}
