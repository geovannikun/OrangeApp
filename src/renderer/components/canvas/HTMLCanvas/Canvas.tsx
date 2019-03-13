import { action, computed, observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { CSSProperties } from 'react'
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
export class HTMLCanvas extends React.Component {

  @observable public newItem: CSSProperties = {
    display: 'none',
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  }

  @action
  public startNewItem = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    this.newItem = {
      ...this.newItem,
      display: 'block',
      height: 0,
      left: event.clientX - rect.left,
      top: event.clientY - rect.top,
      width: 0,
    }
    return
  }

  @action
  public updateNewItem = (event: React.MouseEvent<HTMLElement>) => {
    if (this.newItem.display === 'none') {
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    this.newItem = {
      ...this.newItem,
      ...CanvasRenderUtils.RectToCSS({
        x1: this.newItem.left as number,
        x2: (event.clientX - rect.left),
        y1: this.newItem.top as number,
        y2: (event.clientY - rect.top),
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
      <div
        className='canvas'
        onMouseDown={this.startNewItem}
        onMouseMove={this.updateNewItem}
        onMouseUp={this.createNewItem}
        onClick={this.deselect}
      >
        {CanvasRenderUtils.renderItem(selectedPage, this.select)}
        <span className='selector' style={{...this.selectorStyle}}/>
        <span className='new-item' style={{...this.newItem}}/>
      </div>
    ) : (<></>)
  }
}
