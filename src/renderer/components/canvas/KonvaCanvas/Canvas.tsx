import Konva from 'konva'
import { action, computed, observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { CSSProperties } from 'react'
import { Layer, Stage } from 'react-konva'
import {
  IOrangeItem,
} from '../../../classes/index'
import DocumentStore from '../../../stores/DocumentStore'
import SelectorStore from '../../../stores/SelectorStore'
import CanvasRenderUtils from './RenderUtils'

interface InjectedProps {
  document: DocumentStore
  selector: SelectorStore
}
@inject('document', 'selector')
@observer
export class KonvaCanvas extends React.Component {

  @observable public newItem: CSSProperties = {
    display: 'none',
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
      display: 'block',
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
    if (this.newItem.display === 'none') {
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
    }
  }

  @action
  public createNewItem = () => {
    this.newItem = {
      ...this.newItem,
      display: 'none',
    }
  }

  @computed get selectorStyle(): object {
    const selecteds = this.injected.selector.selecteds
    if (!selecteds.length) {
      return {
        display: 'none',
      }
    }
    return {
      height: selecteds[0].size.height,
      left: selecteds[0].absolutePosition.x,
      top: selecteds[0].absolutePosition.y,
      width: selecteds[0].size.width,
    }
  }

  public select = (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    this.injected.selector.select(item)
  }

  get injected() {
    return this.props as InjectedProps
  }

  public deselect = () => {
    this.injected.selector.deselect()
  }

  public render() {
    const { selectedPage } = this.injected.document
    return selectedPage ? (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={this.startNewItem}
        onMouseMove={this.updateNewItem}
        onMouseUp={this.createNewItem}
        onClick={this.deselect}
      >
        <Layer>
          {CanvasRenderUtils.renderItem(selectedPage, this.select)}
  {/*         <span className='selector' style={{...this.selectorStyle}}/>
          <span className='new-item' style={{...this.newItem}}/> */}
        </Layer>
      </Stage>
    ) : (<></>)
  }
}
