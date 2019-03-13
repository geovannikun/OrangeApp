import React from 'react'
import { IOrangeItem, OrangeArtboard } from '../../../../classes'
import RenderUtils from '../RenderUtils'
import Item from './Item'

interface ArtboardProps {
  item: OrangeArtboard
  select: (item: IOrangeItem) => (e: React.MouseEvent<HTMLElement>) => void
}

class Artboard extends Item<ArtboardProps> {
  public renderSubitems(items: IOrangeItem[]): Array<JSX.Element | undefined> {
    return items && items.map((item) => RenderUtils.renderItem(item, this.props.select))
  }

  public render(): JSX.Element {
    if (this.props.item) {
      return(
        <div
          style={this.itemToCSS(this.props.item)}
          key={this.props.item.id}
          onClick={this.props.select(this.props.item)}
          className='orange-artboard'
        >
          <p className='orange-artboard-title'>{this.props.item.name}</p>
          {this.renderSubitems(this.props.item.children)}
        </div>
      )
    }
    return (<div/>)
  }
}

export default Artboard
