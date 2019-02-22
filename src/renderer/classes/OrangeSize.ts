export default class OrangeSize {
  private _width = 0
  private _height = 0
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  public get width(): number {
    return Math.round(this._width)
  }

  public set width(value: number) {
    this._width = value
  }

  public get height(): number {
    return Math.round(this._height)
  }

  public set height(value: number) {
    this._height = value
  }
}
