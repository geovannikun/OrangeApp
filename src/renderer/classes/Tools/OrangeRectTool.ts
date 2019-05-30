import Konva from 'konva'
import _ from 'lodash'
import { OrangePosition, OrangeRect, OrangeSize, OrangeTool } from '..'
import { StaticFiles } from '../../../common/Static'
import { documentStore, selectorStore } from '../../stores'

export default class OrangeRectTool extends OrangeTool {
  public title = 'Rect'
  public icon = StaticFiles.orangeSquare
  public onSelectAreaCreated = (shape: Konva.ShapeConfig) => _.identity
  public onSelectAreaChange = (shape: Konva.ShapeConfig) => _.identity
  public onSelectAreaDestroyed = (shape: Konva.ShapeConfig) => {
    let newRect: OrangeRect | undefined

    if (
      documentStore.selectedPage
      && shape.width !== 0
      && shape.height !== 0
    ) {
      newRect = new OrangeRect(
        'My Rect',
        new OrangePosition(shape.x || 0, shape.y || 0),
        new OrangeSize(shape.width || 0, shape.height || 0),
      )

      newRect.setStyle('fillColor', '#ccc')

      documentStore.selectedPage.add(newRect)
    }

    selectorStore.select(newRect)
  }
}
