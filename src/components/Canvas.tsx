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
import React, { Component, HTMLAttributes } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

import DocumentStore from '../stores/DocumentStore';

import DetailsColor from './partials/DetailsColor';

interface InjectedProps {
  document: DocumentStore;
}
@inject('document')
@observer
class Canvas extends React.Component {

  public state = {
    canvasX: 0,
    canvasY: 0,
    selectorX: 0,
    selectorY: 0,
  };

  public componentDidMount() {
    const canvasEl = document.querySelector('.canvas');
    if (canvasEl) {
      /* canvasEl.addEventListener('click', (e) => {
        console.log(e);
      }); */
    }
  }

  public select = (item: IOrangeItem) => () => {
    const selectorEl = document.querySelector('.selector');
    console.log(selectorEl);
    if (selectorEl) {
      this.setState({
        ...this.state,
        selectorX: item.position.x,
        selectorY: item.position.y,
      });
    }
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
        <span className='selector' style={{ left: this.state.selectorX, top: this.state.selectorY }}/>
      </div>
    );
  }
}

export default Canvas;
