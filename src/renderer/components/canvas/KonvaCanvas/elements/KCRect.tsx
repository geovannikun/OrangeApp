import Konva from 'konva'
import React from 'react'
import { Rect } from 'react-konva'
import { IOrangeItem, OrangeRect } from '../../../../classes'
import Item from './KCItem'

interface RectProps {
  item: OrangeRect
  select: (item: IOrangeItem) => (e: Konva.KonvaEventObject<MouseEvent>) => void
}

class KCRect extends Item<RectProps> {
  public render(): JSX.Element {
    const { item } = this.props
    if (item) {
      return(
        <Rect
          key={item.id}
          onClick={this.props.select(item)}
          {...this.itemToCSS(item)}
        />
      )
    }
    return (<div/>)
  }
}

export default KCRect
