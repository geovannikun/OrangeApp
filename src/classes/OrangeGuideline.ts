import paper, { PointText, Path } from 'paper';

import IOrangeItem from './IOrangeItem';
import OrangePosition from './OrangePosition';
import OrangeSize from './OrangeSize';

export default class OrangeGuideline {
  public item: IOrangeItem;
  public guidelines: paper.Path.Line[] = new Array<paper.Path.Line>();
  public guidelinesSize: paper.PointText[] = new Array<paper.PointText>();
  constructor(item: IOrangeItem) {
    this.item = item;
  }
  public itemMoved() {
    const lineTopPosition: number = this.item.parent.position.x + this.item.position.x + (this.item.size.width / 2);
    const lineLeftPosition: number = this.item.parent.position.y + this.item.position.y + (this.item.size.height / 2);
    this.guidelines.forEach((guideline, index) => {
      if (index === 0) {
        guideline.segments[0].point = new paper.Point(lineTopPosition, this.item.parent.position.y);
        guideline.segments[1].point = new paper.Point(
          lineTopPosition,
          this.item.parent.position.y + this.item.position.y,
        );
        this.guidelinesSize[index].bounds.topLeft = new paper.Point(
          lineTopPosition + 10,
          this.item.parent.position.y + (this.item.position.y / 2),
        );
        this.guidelinesSize[index].content = this.item.position.y + 'px';
      } else if (index === 1) {
        guideline.segments[0].point = new paper.Point(this.item.parent.position.x, lineLeftPosition);
        guideline.segments[1].point = new paper.Point(
          this.item.parent.position.x + this.item.position.x,
          lineLeftPosition,
        );
        this.guidelinesSize[index].bounds.topLeft = new paper.Point(
          this.item.parent.position.x + (this.item.position.x / 2),
          lineLeftPosition - 20,
        );
        this.guidelinesSize[index].content = this.item.position.x + 'px';
      }
    });
  }

  public generate(canvas: paper.PaperScope) {
    const lineTopPosition: number = this.item.parent.position.x + this.item.position.x + (this.item.size.width / 2);
    const lineLeftPosition: number = this.item.parent.position.y + this.item.position.y + (this.item.size.height / 2);
    const lineTopSizeText = new PointText(new paper.Point(
      lineTopPosition + 10,
      this.item.parent.position.y + (this.item.position.y / 2),
    ));
    lineTopSizeText.fillColor = 'orange';
    lineTopSizeText.content = this.item.position.y + 'px';
    const lineTop = new Path.Line({
      dashArray: [5, 3],
      from: [lineTopPosition, this.item.parent.position.y],
      strokeColor: 'orange',
      to: [lineTopPosition, this.item.parent.position.y + this.item.position.y],
    });
    const lineLeftSizeText = new PointText(new paper.Point(
      this.item.parent.position.x + (this.item.position.x / 2),
      lineLeftPosition - 20),
    );
    lineLeftSizeText.fillColor = 'orange';
    lineLeftSizeText.content = this.item.position.x + 'px';
    const lineLeft = new Path.Line({
      dashArray: [5, 3],
      from: [this.item.parent.position.x, lineLeftPosition],
      strokeColor: 'orange',
      to: [this.item.parent.position.x + this.item.position.x, lineLeftPosition],
    });
    this.guidelines.push(lineTop);
    this.guidelines.push(lineLeft);
    this.guidelinesSize.push(lineTopSizeText);
    this.guidelinesSize.push(lineLeftSizeText);
  }
}
