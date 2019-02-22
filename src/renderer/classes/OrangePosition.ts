export default class OrangePosition {
  private _x = 0
  private _y = 0
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public get x(): number {
    return Math.round(this._x)
  }

  public set x(value: number) {
    this._x = value
  }

  public get y(): number {
    return Math.round(this._y)
  }

  public set y(value: number) {
    this._y = value
  }
}
