import { action, computed, observable } from 'mobx'
import { OrangeLayer, OrangePage, OrangePosition, OrangeSize } from './index'
import OrangeCore from './OrangeCore'

export enum OrangeItemType {
  OrangeRect = 'orange-rect',
  OrangeArtboard = 'orange-artboard',
  OrangeLayer = 'orange-layer',
  OrangeImage = 'orange-image',
  OrangePage = 'orange-page',
  OrangeText = 'orange-text',
}

abstract class IOrangeItem {
  @observable public id: string
  @observable public name: string
  @observable public parent?: OrangeLayer | OrangePage
  @observable public position: OrangePosition
  @observable public size: OrangeSize
  @observable public abstract type: OrangeItemType
  @observable public rendered: boolean = false

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    this.id = OrangeCore.generateID()
    this.name = name
    this.position = position
    this.size = size
  }

  @action
  public setName(name: string) {
    this.name = name
  }

  @computed
  get absolutePosition(): OrangePosition {
    return new OrangePosition(
      this.position.x + (this.parent ? this.parent.absolutePosition.x : 0),
      this.position.y + (this.parent ? this.parent.absolutePosition.y : 0),
     )
  }

  @action
  public setPosition(x: number, y: number) {
    const position = new OrangePosition(x, y)
    this.position = position
  }

  @action
  public setSize(width: number, height: number) {
    width = width <= 0 ? this.size.width : width
    height = height <= 0 ? this.size.height : height
    this.size = new OrangeSize(width, height)
  }

  @action
  public setParent(parent: OrangeLayer) {
    const newPos = {
      x: this.absolutePosition.x - parent.absolutePosition.x,
      y: this.absolutePosition.y - parent.absolutePosition.y,
    }
    if (this.parent) {
      this.parent.remove(this)
    }
    this.parent = parent
    this.setPosition(newPos.x, newPos.y)
  }

  @action
  public changeParent(parent: OrangeLayer) {
    parent.add(this)
  }

  public hasHit(position: OrangePosition) {
    return (
      position.x > this.absolutePosition.x
      && position.y > this.absolutePosition.y
      && position.x < this.absolutePosition.x + this.size.width
      && position.y < this.absolutePosition.y + this.size.height
    )
  }

  public isInside(position: OrangePosition, size: OrangeSize) {
    return (
      this.absolutePosition.x > position.x
      && this.absolutePosition.y > position.y
      && this.absolutePosition.x + this.size.width < position.x + size.width
      && this.absolutePosition.y + this.size.height < position.y + size.height
    )
  }
}

export default IOrangeItem
