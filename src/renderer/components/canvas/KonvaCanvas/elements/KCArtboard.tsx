import Konva from 'konva'
import React from 'react'
import { Group, Text } from 'react-konva'
import { IOrangeItem, OrangeArtboard } from '../../../../classes'
import RenderUtils from '../RenderUtils'
import Item from './KCItem'

interface ArtboardProps {
  item: OrangeArtboard
  select: (item: IOrangeItem) => (e: Konva.KonvaEventObject<MouseEvent>) => void
}

class KCArtboard extends Item<ArtboardProps> {
  public renderSubitems(items: IOrangeItem[]): Array<JSX.Element | undefined> {
    return items && items.map((item) => RenderUtils.renderItem(item, this.props.select))
  }

  public render(): JSX.Element {
    if (this.props.item) {
      return(
        <Group
          key={this.props.item.id}
          onClick={this.props.select(this.props.item)}
          {...this.itemToCSS(this.props.item)}
        >
          <Text text={this.props.item.name}/>
          {this.renderSubitems(this.props.item.children)}
        </Group>
      )
    }
    return (<Group/>)
  }
}

export default KCArtboard
