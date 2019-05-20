import { action, observable, observe } from 'mobx'
import { OrangePosition, OrangeSize } from './index'
import IOrangeItem, { OrangeItemType } from './IOrangeItem'

export default class OrangeLayer extends IOrangeItem {
  @observable public type = OrangeItemType.OrangeLayer
  @observable public children: IOrangeItem[] = new Array<IOrangeItem>()

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    super(name, position, size)
    if (Object.getPrototypeOf(this) === OrangeLayer.prototype) {
      observe(this.children, () => {
        this.updateSize()
      })
    }
  }

  @action
  public updateSize() {
    const x2 = Math.max(...this.children.map((value) =>
      value.absolutePosition.x + value.size.width,
    ))
    const y2 = Math.max(...this.children.map((value) =>
      value.absolutePosition.y + value.size.height,
    ))
    this.setSize(
      x2 - this.absolutePosition.x,
      y2 - this.absolutePosition.y,
    )
  }

  @action
  public add(value: IOrangeItem) {
    value.setParent(this)
    this.children.push(value)
  }

  @action
  public setPosition(x: number, y: number) {
    super.setPosition(x, y)
  }

  @action
  public remove(item: IOrangeItem) {
    this.children = this.children.filter((child) => child !== item)
  }
}
