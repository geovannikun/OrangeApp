import Konva from 'konva'
import { action, computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { Layer, Rect, Stage } from 'react-konva'
import {
  IOrangeItem, OrangePage, OrangeTool,
} from '../../../classes/index'
import { OrangeItemType } from '../../../classes/IOrangeItem'
import CanvasRenderUtils from './RenderUtils'

interface KonvaCanvasProps {
  page?: OrangePage
  selecteds: IOrangeItem[]
  selectedTool?: OrangeTool
  onSelectAreaCreated: (shape: Konva.ShapeConfig) => void
  onSelectAreaChange: (shape: Konva.ShapeConfig) => void
  onSelectAreaDestroyed: (shape: Konva.ShapeConfig) => void
}

@observer
export class KonvaCanvas extends React.Component<KonvaCanvasProps> {

  @observable public selecting = false

  @observable public selectingStartPoint = {
    x: 0,
    y: 0,
  }

  @observable public selectingEndPoint = {
    x: 0,
    y: 0,
  }

  @computed get selectArea() {
    return {
      visible:
        this.selectingStartPoint.x !== this.selectingEndPoint.x &&
        this.selectingStartPoint.y !== this.selectingEndPoint.y,
      x: this.selectingStartPoint.x,
      y: this.selectingStartPoint.y,
      width: this.selectingEndPoint.x - this.selectingStartPoint.x,
      height: this.selectingEndPoint.y - this.selectingStartPoint.y,
    }
  }

  @action
  public createSelectArea = (kevent: Konva.KonvaEventObject<MouseEvent>) => {
    const event = kevent.evt
    this.selecting = true

    this.selectingStartPoint = {
      x: event.offsetX,
      y: event.offsetY,
    }

    this.selectingEndPoint = {
      x: event.offsetX,
      y: event.offsetY,
    }

    this.props.onSelectAreaCreated(this.selectArea)
  }

  @action
  public changeSelectArea = (kevent: Konva.KonvaEventObject<MouseEvent>) => {
    const event = kevent.evt
    if (!this.selecting) {
      return
    }

    this.selectingEndPoint = {
      x: event.offsetX,
      y: event.offsetY,
    }

    this.props.onSelectAreaChange(this.selectArea)
  }

  @action
  public destroySelectArea = () => {
    this.selecting = false

    this.props.onSelectAreaDestroyed(this.selectArea)

    this.selectingStartPoint = { x: 0, y: 0 }
    this.selectingEndPoint = { x: 0, y: 0 }
  }

  @computed get selectorsStyle(): Konva.ShapeConfig[] {
    const selecteds = this.props.selecteds

    return selecteds.map((selector) => ({
      key: `${selector.id}-selector`,
      height: selector.size.height,
      x: selector.absolutePosition.x,
      y: selector.absolutePosition.y,
      width: selector.size.width,
      dash: (selector.type === OrangeItemType.OrangeLayer) ? [5, 5] : undefined,
    }))
  }

  public renderSelectors = (selectors: Konva.ShapeConfig[]) => (
    selectors.map(((selector) => (
      <Rect {...selector} listening={false} stroke='black'/>
    )))
  )

  public render() {
    const { page } = this.props

    return page ? (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={this.createSelectArea}
        onMouseMove={this.changeSelectArea}
        onMouseUp={this.destroySelectArea}
      >
        <Layer>
          {CanvasRenderUtils.renderItem(page)}
          {this.renderSelectors(this.selectorsStyle)}
          <Rect {...this.selectArea} stroke='black'/>
        </Layer>
      </Stage>
    ) : (<></>)
  }
}
