import {
  IOrangeItem,
  IOrangePrimitive,
  OrangeArtboard,
  OrangeLayer,
  OrangeStyle,
} from '../../classes/index';

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
interface MyProps {
  element: IOrangeItem;
}

@observer
class DetailsColor extends React.Component<MyProps, object> {

  private updateColor = (element: IOrangeItem, value: any) => {
    if (element) {
      if (element instanceof IOrangePrimitive) {
        element.setStyle('fillColor', value);
      }
    }
  }

  private handleColorPicker = (item: IOrangeItem) => (color: ColorResult) => {
    this.updateColor(item, color.hex);
  }

  private handleElementChange = (item: IOrangeItem) => (event: any) => {
    this.updateColor(item, event.target.value);
  }

  public render() {
    if (this.props.element instanceof IOrangePrimitive) {
      return (
        <div className='row'>
          <span className={`input-field detail-color`}>
            <label>Color</label>
            <span style={{ backgroundColor: this.props.element.style.fillColor }}/>
            <input
              value={this.props.element.style.fillColor}
              onChange={this.handleElementChange(this.props.element)}
            />
            <SketchPicker
              color={this.props.element.style.fillColor}
              onChangeComplete={this.handleColorPicker(this.props.element)}
            />
          </span>
        </div>
      );
    }
  }
}

export default DetailsColor;
