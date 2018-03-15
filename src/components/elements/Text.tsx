import React from 'react';

import {
  IOrangeItem,
  OrangeText,
} from '../../classes/index';

import Item from './Item';

interface TextProps {
  item: OrangeText;
  select: (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => void;
}

class Text extends Item<TextProps> {
  public render(): JSX.Element {
    const { item } = this.props;
    if (item) {
      return(
        <p style={this.itemToCSS(item)} key={item.id} onClick={this.props.select(item)}>
          {item.text}
        </p>
      );
    }
    return (<div/>);
  }
}

export default Text;
