import paper from 'paper';

import OrangePosition from './OrangePosition';
import OrangeSize from './OrangeSize';

abstract class IOrangeItem {
    id: string;
    name: string;
    element: paper.Item;

    private _position: OrangePosition;
    private _size: OrangeSize;
    private _angle: number;

    constructor(name:string, position:OrangePosition, size:OrangeSize){
        this.id = (new Date().valueOf()).toString();
        this.name = name;
        this._position = position;
        this._size = size;
    }

    get position(): OrangePosition {
        return this._position;
    }
    set position(position:OrangePosition) {
        this._position = position;
        if(this.element)
            this.element.position = new paper.Point(this._position.x, this._position.y);
    }
    get size(): OrangeSize {
        return this._size;
    }
    set size(size:OrangeSize) {
        this._size = size;
        if(this.element)
            this.element.set({ size: [this._size.width, this._size.height] });
    }
    get angle(): number {
        return this._angle;
    }
    set angle(angle:number) {
        this._angle = angle;
        if(this.element)
            this.element.rotation = this._angle;
    }
    abstract render(canvas:paper.PaperScope): void;
    
}

export default IOrangeItem;