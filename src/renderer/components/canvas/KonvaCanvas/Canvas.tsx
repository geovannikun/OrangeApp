import Konva from 'konva'
import { action, computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { Layer, Rect, Stage } from 'react-konva'
import {
  IOrangeItem, OrangePage, OrangeTool,
} from '../../../classes/index'
import CanvasRenderUtils from './RenderUtils'

interface KonvaCanvasProps {
  page?: OrangePage
  selecteds: IOrangeItem[]
  selectedTool?: OrangeTool
  onSelect: (item?: IOrangeItem) => (e?: React.MouseEvent<HTMLElement>) => void
  onSelectAreaCreated: (shape: Konva.ShapeConfig) => void
  onSelectAreaChange: (shape: Konva.ShapeConfig) => void
  onSelectAreaDestroyed: (shape: Konva.ShapeConfig) => void
}

@observer
export class KonvaCanvas extends React.Component<KonvaCanvasProps> {

  @observable public selectArea: Konva.ShapeConfig = {
    visible: false,
    height: 0,
    x: 0,
    y: 0,
    width: 0,
  }

  @action
  public createSelectArea = (kevent: Konva.KonvaEventObject<MouseEvent>) => {
    const event = kevent.evt
    this.selectArea = {
      ...this.selectArea,
      visible: true,
      height: 0,
      x: event.offsetX,
      y: event.offsetY,
      width: 0,
    }

    this.props.onSelectAreaCreated(this.selectArea)
  }

  @action
  public changeSelectArea = (kevent: Konva.KonvaEventObject<MouseEvent>) => {
    const event = kevent.evt
    if (!this.selectArea.visible) {
      return
    }
    this.selectArea = {
      ...this.selectArea,
      height: event.offsetY - (this.selectArea.y || 0),
      width: event.offsetX - (this.selectArea.x || 0),
      visible: true,
    }

    this.props.onSelectAreaChange(this.selectArea)
  }

  @action
  public destroySelectArea = () => {
    this.selectArea = {
      ...this.selectArea,
      visible: false,
    }

    this.props.onSelectAreaDestroyed(this.selectArea)
  }

  @computed get selectorStyle(): Konva.ShapeConfig {
    const selecteds = this.props.selecteds
    if (!selecteds.length) {
      return {
        visible: false,
      }
    }
    return {
      height: selecteds[0].size.height,
      x: selecteds[0].absolutePosition.x,
      y: selecteds[0].absolutePosition.y,
      width: selecteds[0].size.width,
    }
  }

  public onSelect = (item?: IOrangeItem) => (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    this.props.onSelect(item)()
  }

  public render() {
    const { page } = this.props

    return page ? (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={this.createSelectArea}
        onMouseMove={this.changeSelectArea}
        onMouseUp={this.destroySelectArea}
        onClick={this.onSelect()}
      >
        <Layer>
          {CanvasRenderUtils.renderItem(page, this.onSelect)}
          <Rect {...this.selectorStyle} listening={false} stroke='black'/>
          <Rect {...this.selectArea} stroke='black'/>
        </Layer>
      </Stage>
    ) : (<></>)
  }
}
