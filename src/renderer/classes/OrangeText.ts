import { action, observable } from 'mobx'

import IOrangePrimitive from './IOrangePrimitive'

export default class OrangeText extends IOrangePrimitive {
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
