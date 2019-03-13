import React from 'react'
import { IOrangeItem, OrangeRect } from '../../../../classes'
import Item from './Item'

interface RectProps {
  item: OrangeRect
  select: (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => void
}

class Rect extends Item<RectProps> {
  public render(): JSX.Element {
    const { item } = this.props
    if (item) {
      return(
        <div style={this.itemToCSS(item)} key={item.id} onClick={this.props.select(item)}/>
      )
    }
    return (<div/>)
  }
}

export default Rect
