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

import Layer from './elements/Layer';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import React, { Component, HTMLAttributes } from 'react';

import DocumentStore from '../stores/DocumentStore';
import SelectorStore from '../stores/SelectorStore';
import RenderUtils from '../utils/RenderUtils';

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

  public render() {
    const { selectedPage } = this.injected.document;
    return (
      <div className='canvas' style={{ left: this.state.canvasX, top: this.state.canvasY }}>
        {RenderUtils.renderItem(selectedPage, this.select)}
        <span className='selector' style={this.selectorStyle}/>
      </div>
    );
  }
}

export default Canvas;
