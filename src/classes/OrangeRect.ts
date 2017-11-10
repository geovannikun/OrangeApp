import paper from 'paper';

import IOrangeItem from './IOrangeItem';

export default class OrangeRect extends IOrangeItem {
    generate(canvas:paper.PaperScope){
        console.log(this.position.x, this.position.y, this.size.width, this.size.height);
        this.element = new canvas.Path.Rectangle(
            new canvas.Point(this.position.x, this.position.y),
            new canvas.Size(this.size.width, this.size.height)
        );
        this.element.fillColor = 'red';
    }
}