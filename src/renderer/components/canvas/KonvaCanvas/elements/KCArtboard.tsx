import Konva from 'konva'
import React from 'react'
import { Group, Rect, Text } from 'react-konva'
import { IOrangeItem, OrangeArtboard } from '../../../../classes'
import RenderUtils from '../RenderUtils'
import Item from './KCItem'

interface ArtboardProps {
  item: OrangeArtboard
}

class KCArtboard extends Item<ArtboardProps> {

  private name: Konva.Text | null = null
  private nameGap = 20
  private nameFontSize = 16

  public renderSubitems(items: IOrangeItem[]): Array<JSX.Element | undefined> {
    return items && items.map((item) => RenderUtils.renderItem(item))
  }

  public componentDidMount() {
    this.name!.cache({})
  }

  public render(): JSX.Element {
    if (this.props.item) {
      const { x, y, color, ...rectStyle } = this.itemToCSS(this.props.item)

      return(
        <Group
          key={this.props.item.id}
          {...{x, y}}
        >
          <Text
            ref={(node) => this.name = node}
            text={this.props.item.name}
            y={-this.nameGap}
            fontSize={this.nameFontSize}
            filters={[Konva.Filters.Invert]}
          />
          <Rect {...rectStyle}/>
          {this.renderSubitems(this.props.item.children)}
        </Group>
      )
    }
    return (<Group/>)
  }
}

export default KCArtboard
