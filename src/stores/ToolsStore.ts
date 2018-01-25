import { observable, autorun, action } from 'mobx';
import { OrangeTool } from '../classes';

export default class ToolsStore {
  @observable public all: OrangeTool[] = new Array<OrangeTool>();
  @observable public selected: OrangeTool;

  @action
  public add(value: OrangeTool) {
    if (value &&  this.all.indexOf(value) === -1) {
      this.all.push(value);
      if (!this.selected) {
        this.select(value);
      }
    }
  }

  @action
  public select(value: OrangeTool) {
    if (value && this.all.indexOf(value) > -1) {
      this.selected = value;
    }
  }
}
