import Konva from 'konva'
import React from 'react'
import { Group, Text, Rect } from 'react-konva'
import { IOrangeItem, OrangeArtboard } from '../../../../classes'
import RenderUtils from '../RenderUtils'
import Item from './KCItem'

interface ArtboardProps {
  item: OrangeArtboard
  select: (item: IOrangeItem) => (e: Konva.KonvaEventObject<MouseEvent>) => void
}

class KCArtboard extends Item<ArtboardProps> {

  private nameGap = 20
  private nameFontSize = 16
  private nameColor = '#FFF'

  public renderSubitems(items: IOrangeItem[]): Array<JSX.Element | undefined> {
    return items && items.map((item) => RenderUtils.renderItem(item, this.props.select))
  }

  public render(): JSX.Element {
    if (this.props.item) {
      const { x, y, color, ...rectStyle } = this.itemToCSS(this.props.item)

      return(
        <Group
          key={this.props.item.id}
          onClick={this.props.select(this.props.item)}
          {...{x, y}}
        >
          <Text text={this.props.item.name} y={-this.nameGap} fontSize={this.nameFontSize} fontStyle={{}}/>
          <Rect {...rectStyle}/>
          {this.renderSubitems(this.props.item.children)}
        </Group>
      )
    }
    return (<Group/>)
  }
}

export default KCArtboard
