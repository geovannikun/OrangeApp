import '../assets/css/App.css';

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
  OrangeTool,
  ViewZoom,
} from '../classes/index';

import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem';
import Details from './Details';
import Header from './Header';
import Tools from './Tools';

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

import DocumentStore from '../stores/DocumentStore';
import SelectorStore from '../stores/SelectorStore';
import Toolstore from '../stores/ToolsStore';
import AppStore from '../stores/AppStore';

declare module 'react' {
  interface CanvasHTMLAttributes<T> extends DOMAttributes<T> {
    resize: any;
  }
}

declare module 'paper' {
  interface ToolEvent {
    event: NativeMouseEvent;
  }
  interface KeyEvent {
    event: NativeMouseEvent;
  }
}

interface IMyState {
  objects: OrangeLayer[];
}

interface IMyProps {
  document: DocumentStore;
  selector: SelectorStore;
  tools: Toolstore;
  app: AppStore;
}

@inject('document', 'selector', 'tools', 'app')
@observer
class App extends React.Component<IMyProps, IMyState> {

  constructor(props: IMyProps) {
    super(props);
    paper.install(window);
    this.state = {
      objects: [],
    };
  }

  public componentDidMount() {
    paper.setup('canvas');

    this.props.app.setCanvas(paper);

    const paperZoom = new ViewZoom(paper.project);

    const oArtboard = new OrangeArtboard('oArtboard', new OrangePosition(250, 100), new OrangeSize(400, 800));
    oArtboard.render(paper);

    const oRectangle = new OrangeRect('rect', new OrangePosition(50, 50), new OrangeSize(100, 100));

    oArtboard.add(oRectangle);

    this.props.selector.create();

    this.setState({
      ...this.state,
      objects: [...this.state.objects, oArtboard],
    });
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
      this.setState({
        ...this.state,
        objects: this.state.objects.map((artboard: OrangeLayer) => {
          return this.updateOrangeItem(element, artboard);
        }),
      });
    }
  }

  private updateOrangeItem = (item: IOrangeItem, artboard: OrangeLayer): OrangeLayer => {
    if (item instanceof IOrangeItem) {
      artboard.children = artboard.children.map((subItem: IOrangeItem) => {
        if (item === subItem) {
          return item;
        }
        return subItem;
      });
      return artboard;
    } else {
      if (item === artboard) {
        return item;
      }
      return artboard;
    }
  }

  private renderObjectList = (list: IOrangeItem[]): JSX.Element[] => {
    return list.map((item: IOrangeItem) => (
      <li
        key={item.id}
        onClick={this.handleElementSelection(item, 'select')}
        className={this.props.selector.selecteds.find((selected) => selected === item) ? 'selected' : ''}
      >
        {item.name}
        {item instanceof OrangeLayer && this.renderSubList(item.children)}
      </li>
    ));
  }

  private renderSubList = (list: IOrangeItem[]): JSX.Element => {
    return(
      <ul>
        {this.renderObjectList(list)}
      </ul>
    );
  }

  private handleElementSelection = (item: IOrangeItem, propertie: string) => (event: any) => {
    this.updateElement(item, propertie, true);
  }

  private handleContextMenu = (event: any) => {
    console.log('oi');
  }

  public render() {
    return (
      <main>
        <ContextMenu>
          <ContextMenuItem onClick={this.handleContextMenu}>Teste</ContextMenuItem>
        </ContextMenu>
        <Header document={this.props.document}/>
        <Tools app={this.props.app} tools={this.props.tools} selector={this.props.selector}/>
        <aside className='content'>
          <ul className='pages'>
            <li className='current'>Current page</li>
            <li>page 2</li>
            <li>page 3</li>
            <li>page 4</li>
          </ul>

          <ul className='layer-three'>
            {this.renderObjectList(this.state.objects)}
          </ul>
        </aside>
        <canvas id='canvas' resize='true'/>
        <Details selector={this.props.selector}/>
      </main>
    );
  }
}

export default App;
