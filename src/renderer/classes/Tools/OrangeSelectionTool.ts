import Konva from 'konva'
import _ from 'lodash'
import { OrangeTool } from '..'
import { StaticFiles } from '../../../common/Static'
import { documentStore, selectorStore } from '../../stores'
import OrangePosition from '../OrangePosition'
import OrangeSize from '../OrangeSize'

export default class OrangeSelectionTool extends OrangeTool {
  public title = 'Selection'
  public icon = StaticFiles.cursor
  public onSelectAreaCreated = (shape: Konva.ShapeConfig) => _.identity
  public onSelectAreaChange = (shape: Konva.ShapeConfig) => _.identity
  public onSelectAreaDestroyed = (shape: Konva.ShapeConfig) => {
    if (!documentStore.selectedPage) {
      return
    }
    documentStore.selectedPage.items.forEach((child) => {
      if (child.isInside(
        new OrangePosition(shape.x || 0, shape.y || 0),
        new OrangeSize(shape.width || 0, shape.height || 0),
      )) {
        selectorStore.selecteds.push(child)
      }
    })
  }
}
