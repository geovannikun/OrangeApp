import Konva from 'konva'
import React from 'react'
import { IOrangeItem, IOrangePrimitive, OrangeArtboard, OrangeText } from '../../../../classes'

interface ItemProps {
  select: (item: IOrangeItem) => (e: Konva.KonvaEventObject<MouseEvent>) => void
  item: IOrangeItem
}

abstract class KCItem<P extends ItemProps> extends React.PureComponent<P> {

  public itemBackground(item: IOrangeItem) {
    if (item instanceof OrangeText) {
      return 'transparent'
    } else if (item instanceof IOrangePrimitive) {
      return item.style.fillColor
    } else if (item instanceof OrangeArtboard) {
      return 'white'
    } else {
      return 'transparent'
    }
  }

  public itemToCSS(item: IOrangeItem) {
    return {
      fill: this.itemBackground(item),
      color: item instanceof OrangeText ? item.style.fillColor : undefined,
      height: item.size.height,
      x: item.position.x,
      y: item.position.y,
      width: item.size.width,
    }
  }
}

export default KCItem
