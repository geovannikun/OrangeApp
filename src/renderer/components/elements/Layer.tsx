import React from 'react';
import {
  IOrangeItem,
  OrangeLayer,
} from '../../classes/index';

import Item from './Item';
import RenderUtils from '../../utils/RenderUtils';

interface LayerProps {
  item: OrangeLayer;
  select: (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => void;
}

class Layer<P extends LayerProps> extends Item<LayerProps> {
  public renderSubitems(items: IOrangeItem[]): Array<JSX.Element | undefined> {
    return items && items.map((item) => RenderUtils.renderItem(item, this.props.select));
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
