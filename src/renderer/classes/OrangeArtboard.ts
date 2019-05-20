import { action, observable } from 'mobx'
import { OrangeItemType } from './IOrangeItem'
import OrangeLayer from './OrangeLayer'

export default class OrangeArtboard extends OrangeLayer {
  @observable public type = OrangeItemType.OrangeArtboard
  @observable public background: string = '#fff'

  @action
  public setBackground(background: string) {
    this.background = background
  }
}
