import { observable } from 'mobx'
import { OrangeItemType } from './IOrangeItem'
import IOrangePrimitive from './IOrangePrimitive'

export default class OrangeRect extends IOrangePrimitive {
  @observable public type = OrangeItemType.OrangeRect

}
