import React from 'react';
import {
  IOrangeItem,
  OrangeText,
  OrangeLayer,
  OrangeRect,
  OrangeArtboard,
} from '../classes';

import ns from 'node-sketch';

class RenderUtils {
  public static async parseSketchFile(file: string) {
    const sketch = await ns.read(file);
    return sketch;
  }
}

export default RenderUtils;
