import React from 'react'
import { Text } from 'react-konva'
import { OrangeText } from '../../../../classes'
import Item from './KCItem'

interface TextProps {
  item: OrangeText
}

class KCText extends Item<TextProps> {
  public render(): JSX.Element {
    const { item } = this.props
    if (item) {
      return(
        <Text
          text={item.text}
          key={item.id}
          {...this.itemToCSS(item)}
        />
      )
    }
    return (<div/>)
  }
}

export default KCText
