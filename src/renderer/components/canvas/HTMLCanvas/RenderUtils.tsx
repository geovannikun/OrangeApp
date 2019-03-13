import React, { CSSProperties } from 'react'
import {
  IOrangeItem,
  OrangeArtboard,
  OrangeLayer,
  OrangeRect,
  OrangeText,
} from '../../../classes'
import Artboard from './elements/Artboard'
import Layer from './elements/Layer'
import Rect from './elements/Rect'
import Text from './elements/Text'

export default class RenderUtils {
  public static renderItem(item: IOrangeItem, select: any) {
    if (item instanceof OrangeText) {
      return (<Text item={item} key={item.id} select={select}/>)
    } else if (item instanceof OrangeArtboard) {
      return (<Artboard item={item} key={item.id} select={select}/>)
    } else if (item instanceof OrangeLayer) {
      return (<Layer item={item} key={item.id} select={select}/>)
    } else if (item instanceof OrangeRect) {
      return (<Rect item={item} key={item.id} select={select}/>)
    }
    return
  }
  public static RectToCSS(
    rect: { x1: number; y1: number; x2: number; y2: number; },
  ): CSSProperties {
    const cssStyle = {
      left: Math.min(rect.x1, rect.x2),
      top: Math.min(rect.y1, rect.y2),
    }

    return {
      ...cssStyle,
      height: Math.max(rect.y1, rect.y2) - cssStyle.top,
      width: Math.max(rect.x1, rect.x2) - cssStyle.left,
    }
  }
}
