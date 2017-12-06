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
} from '../classes/index';

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import paper, {
  Group,
  Path,
  Point,
  Rectangle,
  Size,
  Tool,
} from 'paper';

import SelectorStore from '../stores/SelectorStore';

interface IMyProps {
  selector: SelectorStore;
}

@observer
class Details extends React.Component<IMyProps, object> {

  constructor(props: IMyProps) {
    super(props);
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
          element.name = value;
          break;
        case 'width':
          element.size = new OrangeSize(parseInt(value, 0), element.size.height);
          break;
        case 'height':
          element.size = new OrangeSize(element.size.width, parseInt(value, 0));
          break;
        case 'fill':
          if (element instanceof IOrangePrimitive) {
            element.style = { fillColor: value };
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
          {this.renderStyleEditor('Color', selected, 'fill')}
        </section>
      );
    }
    return undefined;
  }

  private renderStyleEditor = (title: string, element: IOrangeItem, propertie: string) => {
    if (element instanceof IOrangePrimitive) {
      return (
        <div className='row'>
          <span className='input-field'>
            <label>{title}</label>
            <input value={element.style.fillColor} onChange={this.handleElementChange(element, propertie)}/>
          </span>
        </div>
      );
    }
    return undefined;
  }

  private handleElementChange = (item: IOrangeItem, propertie: string) => (event: any) => {
    this.updateElement(item, propertie, event.target.value);
  }

  public render() {
    return (
      <aside className='details'>
        {this.renderElementDetails(this.props.selector.selecteds)}
      </aside>
    );
  }
}

export default Details;
