import Konva from 'konva'
import React from 'react'
import { Text } from 'react-konva'
import { IOrangeItem, OrangeText } from '../../../../classes'
import Item from './KCItem'

interface TextProps {
  item: OrangeText
  select: (item: IOrangeItem) => (e: Konva.KonvaEventObject<MouseEvent>) => void
}

class KCText extends Item<TextProps> {
  public render(): JSX.Element {
    const { item } = this.props
    if (item) {
      return(
        <Text
          text={item.text}
          key={item.id}
          onClick={this.props.select(item)}
          {...this.itemToCSS(item)}
        />
      )
    }
    return (<div/>)
  }
}

export default KCText
