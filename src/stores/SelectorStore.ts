import { observable, autorun, action, computed } from 'mobx';
import { IOrangeItem, OrangeArtboard, OrangePosition } from '../classes';

export default class SelectorStore {
  @observable public selecteds: IOrangeItem[] = [];
  @observable public resizing: boolean = false;

  @action
  private setResizing(resizing: boolean) {
    this.resizing = resizing;
  }

  @action
  private resizeItens(corner: number, point: OrangePosition) {
    switch (corner) {
      case 0:
        this.selecteds.forEach((item) => {
          item.setPosition(item.position.x + point.x, item.position.y + point.y);
          item.setSize(item.size.width - point.x, item.size.height - point.y);
        });
        break;
      case 1:
        this.selecteds.forEach((item) => {
          item.setPosition(item.position.x, item.position.y + point.y);
          item.setSize(item.size.width + point.x, item.size.height - point.y);
        });
        break;
      case 2:
        this.selecteds.forEach((item) => {
          item.setSize(item.size.width + point.x, item.size.height + point.y);
        });
        break;
      case 3:
        this.selecteds.forEach((item) => {
          item.setPosition(item.position.x + point.x, item.position.y);
          item.setSize(item.size.width - point.x, item.size.height + point.y);
        });
        break;
    }
  }

  @computed get selectedArtboards() {
    return this.selecteds.filter((item) => item instanceof OrangeArtboard);
  }

  @action
  public select(value: IOrangeItem, keep: boolean = false) {
    if (value &&  this.selecteds.indexOf(value) === -1) {
      if (!keep) {
        this.selecteds.length = 0;
      }
      this.selecteds.push(value);
    }
  }

  @action
  public remove(value: IOrangeItem) {
    if (value) {
      this.selecteds = this.selecteds.filter((selected) => selected !== value);
    }
  }

  @action
  public clear() {
    this.selecteds.length = 0;
  }
}
