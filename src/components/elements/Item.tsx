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

interface ItemProps {
  select: (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => void;
  item: IOrangeItem;
}

abstract class Item<P extends ItemProps> extends React.Component<P> {

  public itemBackground(item: IOrangeItem) {
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

  public itemToCSS(item: IOrangeItem) {
    return {
      background: this.itemBackground(item),
      color: item instanceof OrangeText ? item.style.fillColor : undefined,
      height: item.size.height,
      left: item.position.x,
      top: item.position.y,
      width: item.size.width,
    };
  }
}

export default Item;
