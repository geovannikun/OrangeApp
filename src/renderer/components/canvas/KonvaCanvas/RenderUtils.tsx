import Konva from 'konva'
import React from 'react'
import {
  IOrangeItem,
  OrangeArtboard,
  OrangeLayer,
  OrangeRect,
  OrangeText,
} from '../../../classes'
import KCArtboard from './elements/KCArtboard'
import KCLayer from './elements/KCLayer'
import KCRect from './elements/KCRect'
import KCText from './elements/KCText'

export default class RenderUtils {
  public static renderItem(item: IOrangeItem, select: any) {
    if (item instanceof OrangeText) {
      return (<KCText item={item} key={item.id} select={select}/>)
    } else if (item instanceof OrangeArtboard) {
      return (<KCArtboard item={item} key={item.id} select={select}/>)
    } else if (item instanceof OrangeLayer) {
      return (<KCLayer item={item} key={item.id} select={select}/>)
    } else if (item instanceof OrangeRect) {
      return (<KCRect item={item} key={item.id} select={select}/>)
    }
    return
  }
  public static RectToCSS(
    rect: { x1: number; y1: number; x2: number; y2: number; },
  ): Konva.ShapeConfig {
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
