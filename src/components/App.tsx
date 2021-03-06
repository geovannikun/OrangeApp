import AppStore from '../stores/AppStore';
import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem';
import Details from './Details';
import DocumentStore from '../stores/DocumentStore';
import Dropzone from 'react-dropzone';
import electron from 'electron';
import Header from './Header';
import Pages from './Pages';
import paper, {
  Group,
  MouseEvent,
  Path,
  Point,
  Rectangle,
  Size,
  Tool,
  } from 'paper';
import React, { Component } from 'react';
import SelectorStore from '../stores/SelectorStore';
import Tools from './Tools';
import { inject, observer } from 'mobx-react';
import '../assets/css/App.css';
import '../assets/css/DetailsColor.css';

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
  OrangeImage,
  OrangeText,
} from '../classes/index';

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

interface AppState {
  dropZoneActive: boolean;
}

interface InjectedProps {
  document: DocumentStore;
  selector: SelectorStore;
  app: AppStore;
}

@inject('document', 'selector', 'app')
@observer
class App extends React.Component<object, AppState> {
  public state = {
    dropZoneActive: false,
  };

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
    const oText = new OrangeText('text', new OrangePosition(310, 160), new OrangeSize(100, 10));
    oText.setText('Olar');

    page.add(oArtboard);
    page.add(oLayer);
    page.add(oRectangle);
    page.add(oText);
    oRectangle.changeParent(oLayer);
    // debugger;
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
    event = (event as MouseEvent);
    event.stopPropagation();
    this.injected.selector.select(item, event.ctrlKey);
  }

  private handleContextMenu = (event: any) => {
    console.log('oi');
  }

  private handleDrop = (accepted: File[], rejected: File[]) => {
    if (rejected.length) {
      alert('Some files are unsuported');
    }
    accepted.forEach((image) => {
      const img = electron.nativeImage.createFromPath(image.path);
      const oImage = new OrangeImage('image', new OrangePosition(0, 0), img.getSize() as OrangeSize, img.toDataURL());
      this.injected.document.selectedPage.add(oImage);
      oImage.setPosition(100, 100);
    });
    this.setState({ dropZoneActive: false });
  }
  private handleDragEnter = () => {
    this.setState({ dropZoneActive: true });
  }
  private handleDragLeave = () => {
    this.setState({ dropZoneActive: false });
  }

  private dragOverlayRender = (dropZoneActive: boolean) => {
    if (dropZoneActive) {
      return (<div className='drag-overlay'>
        <div className='box'>
          Drop files...
        </div>
      </div>);
    }
  }

  public render() {
    const { selectedPage } = this.injected.document;
    const { dropZoneActive } = this.state;
    return (
      <Dropzone
        disableClick={true}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, right: 0 }}
        accept={this.injected.app.acceptableImageTypes}
        onDrop={this.handleDrop}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
      >
        {this.dragOverlayRender(dropZoneActive)}
        <main>
          <ContextMenu>
            <ContextMenuItem onClick={this.handleContextMenu}>Teste</ContextMenuItem>
          </ContextMenu>
          <Header/>
          <Tools/>
          <aside className='content'>
            <Pages/>
            <ul className='layer-three'>
              {selectedPage && this.renderObjectList(selectedPage.children)}
            </ul>
          </aside>
          <canvas id='canvas' resize='true'/>
          <Details/>
        </main>
      </Dropzone>
    );
  }
}

export default App;
