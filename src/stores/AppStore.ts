import { observable, autorun, action } from 'mobx';
import paper, {
  Group,
  Path,
  Point,
  Rectangle,
  Size,
  Tool,
} from 'paper';

export default class AppStore {
  @observable public canvas: paper.PaperScope;
  @observable public acceptableImageTypes: string = 'image/jpeg, image/png';

  @action
  public setCanvas(value: paper.PaperScope) {
    if (value) {
      this.canvas = value;
    }
  }
}
