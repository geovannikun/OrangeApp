export default class OrangeSize {
  private _width: number;
  private _height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public get width(): number {
    return Math.round(this._width);
  }

  public set width(value: number) {
    this._width = value;
  }

  public get height(): number {
    return Math.round(this._height);
  }

  public set height(value: number) {
    this._height = value;
  }
}
