import React from 'react';
import {
  IOrangeItem,
  OrangeText,
  OrangeLayer,
  OrangeRect,
  OrangeArtboard,
} from '../classes';

import Layer from '../components/elements/Layer';
import Rect from '../components/elements/Rect';
import Artboard from '../components/elements/Artboard';
import Text from '../components/elements/Text';

class RenderUtils {
  public renderItem(item: IOrangeItem, select: any) {
    if (item instanceof OrangeText) {
      return (<Text item={item} key={item.id} select={select}/>);
    } else if (item instanceof OrangeLayer) {
      return (<Layer item={item} key={item.id} select={select}/>);
    } else if (item instanceof OrangeRect) {
      return (<Rect item={item} key={item.id} select={select}/>);
    } else if (item instanceof OrangeArtboard) {
      return (<Artboard item={item} key={item.id} select={select}/>);
    }
    return;
  }
}

export default new RenderUtils();
