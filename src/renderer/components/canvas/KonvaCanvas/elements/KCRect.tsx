import React from 'react'
import { Rect } from 'react-konva'
import { OrangeRect } from '../../../../classes'
import Item from './KCItem'

interface RectProps {
  item: OrangeRect
}

class KCRect extends Item<RectProps> {
  public render(): JSX.Element {
    const { item } = this.props
    if (item) {
      return(
        <Rect
          key={item.id}
          {...this.itemToCSS(item)}
        />
      )
    }
    return (<div/>)
  }
}

export default KCRect
