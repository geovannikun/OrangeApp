import { action, observable } from 'mobx'

import { OrangeItemType } from './IOrangeItem'
import IOrangePrimitive from './IOrangePrimitive'

export default class OrangeText extends IOrangePrimitive {
  @observable public type = OrangeItemType.OrangeText
  @observable public text: string = ''
  @observable public fontSize: number = 12

  @action
  public setText(text: string) {
    this.text = text
  }

  @action
  public setFontSize(fontSize: number) {
    this.fontSize = fontSize
  }

}
