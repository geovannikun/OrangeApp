import Konva from 'konva'
import _ from 'lodash'
import { OrangeTool } from '..'
import { StaticFiles } from '../../../common/Static'

export default class OrangeRectTool extends OrangeTool {
  public title = 'Rect'
  public icon = StaticFiles.groupLayers
  public onSelectAreaCreated = (shape: Konva.ShapeConfig) => _.identity
  public onSelectAreaChange = (shape: Konva.ShapeConfig) => _.identity
  public onSelectAreaDestroyed = (shape: Konva.ShapeConfig) => _.identity
}
