import paper from 'paper';

import IOrangeItem from './IOrangeItem';
import OrangePosition from './OrangePosition';
import OrangeSize from './OrangeSize';

export default class OrangeGuideline {
  item: IOrangeItem;
  guidelines: Array<paper.Path.Line> = new Array<paper.Path.Line>();
  guidelinesSize: Array<paper.PointText> = new Array<paper.PointText>();
  constructor(item:IOrangeItem){
    this.item = item;
  }
  itemMoved(){
    this.guidelines.forEach((guideline, index) => {
      if(index == 0){
        guideline.segments[0].point = new paper.Point(this.item.position.x + (this.item.size.width / 2), 0);
        guideline.segments[1].point = new paper.Point(this.item.position.x + (this.item.size.width / 2), this.item.position.y);
        this.guidelinesSize[index].bounds.topLeft = new paper.Point(
          this.item.position.x + (this.item.size.width / 2) + 10,
          this.item.position.y/2,
        );
        this.guidelinesSize[index].content = this.item.position.y + 'px';
      }else if(index == 1){
        guideline.segments[0].point = new paper.Point(0, this.item.position.y + (this.item.size.height / 2));
        guideline.segments[1].point = new paper.Point(this.item.position.x, this.item.position.y + (this.item.size.height / 2));
        this.guidelinesSize[index].bounds.topLeft = new paper.Point(
          this.item.position.x / 2,
          this.item.position.y + (this.item.size.height / 2) - 20,
        );
        this.guidelinesSize[index].content = this.item.position.x + 'px';
      }
    });
  }

  generate(canvas:paper.PaperScope){
    const lineTopSize = new canvas.PointText(new paper.Point(
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
    const lineLeftSize = new canvas.PointText(new paper.Point(
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