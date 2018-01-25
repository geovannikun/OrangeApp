import {
  IOrangeItem,
  IOrangePrimitive,
  OrangeArtboard,
  OrangeLayer,
  OrangePosition,
  OrangeRect,
  OrangeSize,
  OrangeStyle,
  OrangeText,
} from '../classes/index';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import React, { Component, HTMLAttributes } from 'react';

import DocumentStore from '../stores/DocumentStore';
import SelectorStore from '../stores/SelectorStore';

interface InjectedProps {
  document: DocumentStore;
  selector: SelectorStore;
}
@inject('document', 'selector')
@observer
class Canvas extends React.Component {

  public state = {
    canvasX: 0,
    canvasY: 0,
  };

  @computed get selectorStyle(): object {
    const selecteds = this.injected.selector.selecteds;
    return {
      height: selecteds.length ? selecteds[0].size.height : 0,
      left: selecteds.length ? selecteds[0].absolutePosition.x : 0,
      top: selecteds.length ? selecteds[0].absolutePosition.y : 0,
      width: selecteds.length ? selecteds[0].size.width : 0,
    };
  }

  public select = (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    this.injected.selector.select(item);
  }

  get injected() {
    return this.props as InjectedProps;
  }

  private itemBackground(item: IOrangeItem) {
    if (item instanceof OrangeText) {
      return 'transparent';
    } else if (item instanceof IOrangePrimitive) {
      return item.style.fillColor;
    } else if (item instanceof OrangeArtboard) {
      return 'white';
    } else {
      return 'transparent';
    }
  }

  private itemToCSS(item: IOrangeItem) {
    return {
      background: this.itemBackground(item),
      color: item instanceof OrangeText ? item.style.fillColor : undefined,
      height: item.size.height,
      left: item.position.x,
      top: item.position.y,
      width: item.size.width,
    };
  }

  private renderItems = (items: IOrangeItem[]): JSX.Element[] => {
    return items && items.map((item) => {
      return (
        <div style={this.itemToCSS(item)} key={item.id} onClick={this.select(item)}>
          {item instanceof OrangeLayer && this.renderItems(item.children)}
          {item instanceof OrangeText && item.text}
        </div>
      );
    });
  }

  public render() {
    const { selectedPage } = this.injected.document;
    return (
      <div className='canvas' style={{ left: this.state.canvasX, top: this.state.canvasY }}>
        {this.renderItems(selectedPage && selectedPage.children)}
        <span className='selector' style={this.selectorStyle}/>
      </div>
    );
  }
}

export default Canvas;
