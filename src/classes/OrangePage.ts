import paper from 'paper';
import { observable, action } from 'mobx';
import { IOrangeItem } from './index';
import { debug } from 'util';

class OrangePage {
  @observable public id: string;
  @observable public name: string;
  @observable public items: IOrangeItem[];

  constructor(name: string) {
    this.id = (new Date().valueOf()).toString();
    this.name = name;
    this.items = new Array<IOrangeItem>();
  }

  @action
  public addItem(value: IOrangeItem) {
    if (value && this.items.indexOf(value) === -1) {
      this.items.push(value);
    }
  }

  public render(canvas: paper.PaperScope) {
    canvas.project.clear();
    this.items.forEach((item) => item.render(canvas));
  }
}

export default OrangePage;
