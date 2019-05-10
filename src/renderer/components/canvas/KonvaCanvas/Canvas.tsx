import Konva from 'konva'
import { action, computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { Layer, Rect, Stage } from 'react-konva'
import {
  IOrangeItem, OrangePage,
} from '../../../classes/index'
import CanvasRenderUtils from './RenderUtils'

interface KonvaCanvasProps {
  page?: OrangePage
  selecteds: IOrangeItem[]
  onSelect: (item?: IOrangeItem) => (e?: React.MouseEvent<HTMLElement>) => void
}

@observer
export class KonvaCanvas extends React.Component<KonvaCanvasProps> {

  @observable public newItem: Konva.ShapeConfig = {
    visible: false,
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  }

  @action
  public startNewItem = (kevent: Konva.KonvaEventObject<MouseEvent>) => {
    const event = kevent.evt
    this.newItem = {
      ...this.newItem,
      visible: true,
      height: 0,
      left: event.clientX - event.offsetX,
      top: event.clientY - event.offsetY,
      width: 0,
    }
    return
  }

  @action
  public updateNewItem = (kevent: Konva.KonvaEventObject<MouseEvent>) => {
    const event = kevent.evt
    if (!this.newItem.visible) {
      return
    }
    this.newItem = {
      ...this.newItem,
      ...CanvasRenderUtils.RectToCSS({
        x1: this.newItem.left as number,
        x2: (event.clientX - event.offsetX),
        y1: this.newItem.top as number,
        y2: (event.clientY - event.offsetY),
      }),
      visible: true,
    }
  }

  @action
  public createNewItem = () => {
    this.newItem = {
      ...this.newItem,
      visible: false,
    }
  }

  @computed get selectorStyle(): Konva.ShapeConfig {
    const selecteds = this.props.selecteds
    if (!selecteds.length) {
      return {
        display: 'none',
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
        onMouseDown={this.startNewItem}
        onMouseMove={this.updateNewItem}
        onMouseUp={this.createNewItem}
        onClick={this.onSelect()}
      >
        <Layer>
          {CanvasRenderUtils.renderItem(page, this.onSelect)}
          <Rect {...this.selectorStyle} listening={false} stroke='black'/>
          <Rect {...this.newItem} stroke='black'/>
        </Layer>
      </Stage>
    ) : (<></>)
  }
}
