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
} from '../../classes/index';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import React, { Component, HTMLAttributes } from 'react';

import DocumentStore from '../../stores/DocumentStore';
import SelectorStore from '../../stores/SelectorStore';

import Item from './Item';

interface LayerProps {
  item: OrangeLayer;
  select: (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => void;
}

class Layer extends Item<LayerProps> {
  public renderSubitems(items: IOrangeItem[]): Array<JSX.Element | undefined> {
    return items && items.map((item) => {
      if (item instanceof OrangeText) {
        return (<p style={this.itemToCSS(item)} key={item.id} onClick={this.props.select(item)}>{item.text}</p>);
      } else if (item instanceof OrangeLayer) {
        return (<Layer item={item} key={item.id} select={this.props.select}/>);
      } else if (item instanceof OrangeRect) {
        return (<div style={this.itemToCSS(item)} key={item.id} onClick={this.props.select(item)}/>);
      } else if (item instanceof OrangeArtboard) {
        return (<div style={this.itemToCSS(item)} key={item.id} onClick={this.props.select(item)}/>);
      }
      return;
    });
  }

  public render(): JSX.Element {
    if (this.props.item) {
      return(
        <div
          style={this.itemToCSS(this.props.item)}
          key={this.props.item.id}
          onClick={this.props.select(this.props.item)}
        >
          {this.renderSubitems(this.props.item.children)}
        </div>
      );
    }
    return (<div/>);
  }
}

export default Layer;
