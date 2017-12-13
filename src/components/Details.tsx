import {
  IOrangeItem,
  IOrangePrimitive,
  OrangeArtboard,
  OrangeLayer,
  OrangeGuideline,
  OrangePosition,
  OrangeRect,
  OrangeSize,
  OrangeStyle,
  OrangeText,
} from '../classes/index';

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import paper, {
  Group,
  Path,
  Point,
  Rectangle,
  Size,
  Tool,
} from 'paper';

import SelectorStore from '../stores/SelectorStore';

import DetailsColor from './partials/DetailsColor';

interface InjectedProps {
  selector: SelectorStore;
}
@inject('selector')
@observer
class Details extends React.Component {

  get injected() {
    return this.props as InjectedProps;
  }

  private updateElement = (element: IOrangeItem , prop: string, value: any) => {
    if (element) {
      switch (prop) {
        case 'add':
          if (element instanceof OrangeLayer) {
            element.add(value);
          }
          break;
        case 'position':
          element.position = value;
          break;
        case 'name':
          element.setName(value);
          break;
        case 'width':
          element.setSize(parseInt(value, 10) || 1, element.size.height);
          break;
        case 'height':
          element.setSize(element.size.width, parseInt(value, 10) || 1);
          break;
        case 'fill':
          if (element instanceof IOrangePrimitive) {
            element.setStyle('fillColor', value);
          }
          break;
        case 'text':
          if (element instanceof OrangeText) {
            element.setText(value);
          }
          break;
        case 'fontSize':
          if (element instanceof OrangeText) {
            element.setFontSize(parseInt(value, 10) || 12);
          }
          break;
      }
    }
  }

  private renderElementDetails = (list: IOrangeItem[]): JSX.Element | undefined => {
    if (list.length === 1) {
      const selected = list[0];
      return (
        <section>
          <input value={selected.name} onChange={this.handleElementChange(selected, 'name')}/>
          <div className='row'>
            <span className='input-field unit-px'>
              <label>Width</label>
              <input
                type='number'
                value={selected.size.width}
                onChange={this.handleElementChange(selected, 'width')}
              />
            </span>
            <span className='input-field unit-px'>
              <label>Height</label>
              <input
                type='number'
                value={selected.size.height}
                onChange={this.handleElementChange(selected, 'height')}
              />
            </span>
          </div>
          <DetailsColor element={selected}/>
          {this.renderTextEditor('Text', selected, 'text')}
          {this.renderFontSizeEditor('FontSize', selected, 'fontSize')}
        </section>
      );
    }
    return undefined;
  }

  private renderStyleEditor = (title: string, element: IOrangeItem, propertie: string) => {
    if (element instanceof IOrangePrimitive) {
      return (
        <div className='row'>
          <span className={`input-field detail-${propertie}`}>
            <label>{title}</label>
            <span style={{ backgroundColor: element.style.fillColor }}/>
            <input value={element.style.fillColor} onChange={this.handleElementChange(element, propertie)}/>
            <SketchPicker
              color={element.style.fillColor}
              onChangeComplete={this.handleColorPicker(element, propertie)}
            />
          </span>
        </div>
      );
    }
    return undefined;
  }

  private renderTextEditor = (title: string, element: IOrangeItem, propertie: string) => {
    if (element instanceof OrangeText) {
      return (
        <div className='row'>
          <span className='input-field'>
            <label>{title}</label>
            <textarea value={element.text} onChange={this.handleElementChange(element, propertie)}/>
          </span>
        </div>
      );
    }
    return undefined;
  }

  private renderFontSizeEditor = (title: string, element: IOrangeItem, propertie: string) => {
    if (element instanceof OrangeText) {
      return (
        <div className='row'>
          <span className='input-field'>
            <label>{title}</label>
            <input value={element.fontSize} onChange={this.handleElementChange(element, propertie)}/>
          </span>
        </div>
      );
    }
    return undefined;
  }

  private handleColorPicker = (item: IOrangeItem, propertie: string) => (color: ColorResult) => {
    this.updateElement(item, propertie, color.hex);
  }

  private handleElementChange = (item: IOrangeItem, propertie: string) => (event: any) => {
    this.updateElement(item, propertie, event.target.value);
  }

  public render() {
    return (
      <aside className='details'>
        {this.renderElementDetails(this.injected.selector.selecteds)}
      </aside>
    );
  }
}

export default Details;
