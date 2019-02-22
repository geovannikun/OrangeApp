import { action, observable } from 'mobx'
import OrangeLayer from './OrangeLayer'

export default class OrangeArtboard extends OrangeLayer {
  @observable public background: string = '#fff'

  @action
  public setBackground(background: string) {
    this.background = background
  }
}
