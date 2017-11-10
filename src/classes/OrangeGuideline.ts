import paper from 'paper';

import IOrangeItem from './IOrangeItem';
import OrangePosition from './OrangePosition';
import OrangeSize from './OrangeSize';

export default class OrangeGuideline {
  item: IOrangeItem;
  guidelines: Array<paper.Path.Line> = new Array<paper.Path.Line>();
  guidelinesSize: Array<paper.Path.Line> = new Array<paper.Path.Line>();
  constructor(item:IOrangeItem){
    this.item = item;
  }
  generate(canvas:paper.PaperScope){
    const lineTopSize = new canvas.PointText(new Point(
      this.item.position.x + (this.item.size.width / 2) + 10,
      this.item.position.y/2)
    );
    lineTopSize.fillColor = 'orange';
    lineTopSize.content = this.item.position.y + 'px';
    const lineTop = new canvas.Path.Line({
      from: [this.item.position.x + (this.item.size.width / 2), 0],
      to: [this.item.position.x + (this.item.size.width / 2), this.item.position.y],
      strokeColor: 'orange',
      dashArray: [5, 3],
    });
    const lineLeftSize = new canvas.PointText(new Point(
      this.item.position.x / 2,
      this.item.position.y + (this.item.size.height / 2) - 10)
    );
    lineLeftSize.fillColor = 'orange';
    lineLeftSize.content = this.item.position.x + 'px';
    const lineLeft = new canvas.Path.Line({
      from: [0, this.item.position.y + (this.item.size.height / 2)],
      to: [this.item.position.x, this.item.position.y + (this.item.size.height / 2)],
      strokeColor: 'orange',
      dashArray: [5, 3],
    });
    this.guidelines.push(lineTop);
    this.guidelines.push(lineLeft);
    this.guidelinesSize.push(lineTopSize);
    this.guidelinesSize.push(lineLeftSize);
  }
}