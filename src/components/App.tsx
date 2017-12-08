import '../assets/css/App.css';

import {
  IOrangeItem,
  IOrangePrimitive,
  OrangeArtboard,
  OrangeLayer,
  OrangeGuideline,
  OrangePage,
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
import Pages from './Pages';

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import paper, { Group, MouseEvent, Path, Point, Rectangle, Size, Tool } from 'paper';

import DocumentStore from '../stores/DocumentStore';
import SelectorStore from '../stores/SelectorStore';
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

interface InjectedProps {
  document: DocumentStore;
  selector: SelectorStore;
  app: AppStore;
}

@inject('document', 'selector', 'app')
@observer
class App extends React.Component {

  get injected() {
    return this.props as InjectedProps;
  }

  constructor(props: object) {
    super(props);
    paper.install(window);
  }

  public componentDidMount() {
    paper.setup('canvas');
    const paperZoom = new ViewZoom(paper.project);
    this.injected.app.setCanvas(paper);

    this.injected.document.addPage(new OrangePage('page1'));
    const page = this.injected.document.selectedPage;

    const oArtboard = new OrangeArtboard('oArtboard', new OrangePosition(250, 100), new OrangeSize(400, 800));
    const oLayer = new OrangeLayer('layer', new OrangePosition(250, 150), new OrangeSize(100, 100));
    const oRectangle = new OrangeRect('rect', new OrangePosition(300, 150), new OrangeSize(100, 100));

    page.add(oArtboard);
    page.add(oRectangle);
    page.add(oLayer);
    oRectangle.changeParent(oLayer);
    oLayer.changeParent(oArtboard);

    this.injected.selector.create();
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
        className={this.injected.selector.selecteds.find((selected) => selected === item) ? 'selected' : ''}
      >
        {item.name} - {JSON.stringify(item.position)}- {JSON.stringify(item.absolutePosition)}
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
    (event as MouseEvent).stopPropagation();
    this.injected.selector.add(item);
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
        <Header/>
        <Tools/>
        <aside className='content'>
          <Pages/>
          <ul className='layer-three'>
            {this.injected.document.selectedPage && this.renderObjectList(this.injected.document.selectedPage.children)}
          </ul>
        </aside>
        <canvas id='canvas' resize='true'/>
        <Details/>
      </main>
    );
  }
}

export default App;
