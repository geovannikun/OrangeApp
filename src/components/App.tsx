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
  OrangeSelect,
} from '../classes/index';

import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem';

import electron from 'electron';
import {observer} from 'mobx-react';
import React, { Component } from 'react';
import paper, {
  Group,
  Path,
  Point,
  Rectangle,
  Size,
  Tool,
} from 'paper';

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

const { BrowserWindow } = electron.remote;

interface IMyState {
  tools: OrangeTool[];
  currentTool?: OrangeTool;
  objects: OrangeLayer[];
  selector: OrangeSelect;
}

interface IMyProps {
  document: Document;
}

@observer(['document'])
class App extends React.Component<IMyProps, IMyState> {

  constructor(props: IMyProps) {
    super(props);
    paper.install(window);
    this.state = {
      objects: [],
      selector: new OrangeSelect(),
      tools: [],
    };
  }

  public componentDidMount() {
    paper.setup('canvas');

    const paperZoom = new ViewZoom(paper.project);

    const hitOptions = {
      fill: true,
      segments: true,
      stroke: true,
      tolerance: 5,
    };

    const oArtboard = new OrangeArtboard('oArtboard', new OrangePosition(250, 100), new OrangeSize(400, 800));
    oArtboard.render(paper);

    const oRectangle = new OrangeRect('rect', new OrangePosition(50, 50), new OrangeSize(100, 100));

    oArtboard.add(oRectangle);

    const selectionRect: Path.Rectangle = new Path.Rectangle({
      dashArray: [10, 12],
      fillColor: 'rgba(0, 0, 0, 0.1)',
      point: [0, 0],
      size: [1, 1],
      strokeColor: 'black',
    });
    selectionRect.visible = false;

    this.state.selector.create();

    const selection = new Tool();
    selection.onMouseDrag = (event: paper.ToolEvent) => {
      if (this.state.selector.selecteds.length && !selectionRect.visible) {
        this.state.selector.selecteds.forEach((object: IOrangeItem) => {
          this.updateElement(object, 'position', new OrangePosition(
            object.position.x + event.delta.x,
            object.position.y + event.delta.y,
          ));
        });
      } else {
        this.state.selector.clear();
        if (event.downPoint.y !== event.point.y && event.downPoint.x !== event.point.x) {
          const x = [event.point.x, event.downPoint.x].sort();
          const y = [event.point.y, event.downPoint.y].sort();
          selectionRect.bounds = new Rectangle(
            new Point(x[0], y[0]),
            new Point(x[1], y[1]),
          );
          selectionRect.visible = true;
        }
        paper.project.getItems({
          inside: selectionRect.bounds,
          recursive: true,
        }).forEach((selected: paper.Item) => {
          const object = selected.data.primitive;
          this.state.selector.add(object);
        });
      }
    };
    selection.onMouseUp = (e: paper.ToolEvent) => {
      if (selectionRect.visible) {
        selectionRect.visible = false;
        selectionRect.bounds = new Rectangle(new Point(0, 0), new Point(1, 1));
      } else {
        if (e.event.which === 1) {
          const hitResult = paper.project.hitTest(e.point, hitOptions);
          if (hitResult) {
            if (!e.event.ctrlKey) {
              this.state.selector.clear();
            }
            const object = hitResult.item.data.primitive;
            this.state.selector.add(object);
          } else {
            this.state.selector.clear();
          }
        }
      }
    };
    selection.onKeyDown = (e: paper.KeyEvent) => {
      if (this.state.selector.selecteds.length) {
        let x = 0;
        let y = 0;
        const multiple = e.event.shiftKey ? 10 : 1;
        switch (e.key) {
          case 'right':
            x = 1 * multiple;
            break;
          case 'left':
            x = -1 * multiple;
            break;
          case 'down':
            y = 1 * multiple;
            break;
          case 'up':
            y = -1 * multiple;
            break;
        }
        this.state.selector.selecteds.forEach((object: IOrangeItem) => {
          this.updateElement(object, 'position', new OrangePosition(
            object.position.x + x,
            object.position.y + y,
          ));
        });
      }
    };

    const rect = new Tool();
    rect.onMouseDown = (e: paper.ToolEvent) => {
      if (e.event.which === 1) {
        selectionRect.visible = true;
      }
    };
    rect.onMouseDrag = (event: paper.ToolEvent) => {
      if (event.downPoint.y !== event.point.y && event.downPoint.x !== event.point.x) {
        const x = [event.point.x, event.downPoint.x].sort();
        const y = [event.point.y, event.downPoint.y].sort();
        selectionRect.bounds = new Rectangle(
          new Point(x[0], y[0]),
          new Point(x[1], y[1]),
        );
      }
    };
    rect.onMouseUp = (event: paper.ToolEvent) => {
      selectionRect.visible = false;
      selectionRect.bounds = new Rectangle(new Point(0, 0), new Point(1, 1));
      if (event.downPoint.y !== event.point.y && event.downPoint.x !== event.point.x) {
        const x = [event.point.x, event.downPoint.x].sort();
        const y = [event.point.y, event.downPoint.y].sort();
        const oRect = new OrangeRect(
          'rect oi',
          new OrangePosition(x[0] - oArtboard.position.x, y[0] - oArtboard.position.y),
          new OrangeSize(x[1] - x[0], y[1] - y[0]),
        );
        this.state.selector.add(oRect);
        this.updateElement(oArtboard, 'add', oRect);
      }
    };
    const text = new Tool();
    const layer = new Tool();

    const tools = new Array<OrangeTool>();

    tools.push(new OrangeTool('selection', '⊹', selection));
    tools.push(new OrangeTool('rect', '◻', rect));
    tools.push(new OrangeTool('text', '℞', text));
    tools.push(new OrangeTool('layer', 'layer', layer));

    this.setState({
      ...this.state,
      objects: [...this.state.objects, oArtboard],
      tools,
    }, () => this.changeTool(tools[0]));
  }

  private changeFileName = (fileName: string) => {
    this.props.document.title = fileName;
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

  private changeTool = (tool: OrangeTool) => {
    tool.tool.activate();
    this.setState({
      ...this.state,
      currentTool: tool,
    });
  }

  private windowAction = (action: string) => {
    const window = BrowserWindow.getFocusedWindow();
    switch (action) {
      case 'close':
        window.close();
        break;
      case 'minimize':
        window.minimize();
        break;
      case 'maximize':
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
            window.maximize();
        }
        break;
      default:
        throw new Error('Error');
    }
  }

  private renderObjectList = (list: IOrangeItem[]): JSX.Element[] => {
    return list.map((item: IOrangeItem) => (
      <li
        key={item.id}
        onClick={this.handleElementSelection(item, 'select')}
        className={this.state.selector.selecteds.find((selected) => selected === item) ? 'selected' : ''}
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

  private renderToolsList = (list: OrangeTool[]): JSX.Element[] => {
    return list.map((tool: OrangeTool) => (
      <li
        key={tool.title}
        onClick={this.handleChangeTool(tool)}
        className={(this.state.currentTool === tool) ? 'selected' : ''}
      >
        {tool.icon}
      </li>
    ));
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

  private handleFileName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.changeFileName((event.target as HTMLInputElement).value);
  }

  private handleWinControl = (action: string) => (event: any) => {
    this.windowAction(action);
  }

  private handleElementSelection = (item: IOrangeItem, propertie: string) => (event: any) => {
    this.updateElement(item, propertie, true);
  }

  private handleElementChange = (item: IOrangeItem, propertie: string) => (event: any) => {
    this.updateElement(item, propertie, event.target.value);
  }

  private handleChangeTool = (tool: OrangeTool) => (event: any) => {
    this.changeTool(tool);
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
        <header>
          <ul className='actions'>
            <li>≡</li>
            <li>proto<b>editor :)</b></li>
          </ul>
          <div className='document-name'>
            <input value={this.props.document.title} onChange={this.handleFileName}/>
          </div>
          <ul className='win-control'>
            <li onClick={this.handleWinControl('minimize')}>⊖</li>
            <li onClick={this.handleWinControl('maximize')}>⊕</li>
            <li onClick={this.handleWinControl('close')}>⊗</li>
          </ul>
        </header>
        <aside className='tools'>
          <ul>
            {this.renderToolsList(this.state.tools)}
          </ul>
        </aside>
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
        <aside className='details'>
          {this.renderElementDetails(this.state.selector.selecteds)}
        </aside>
      </main>
    );
  }
}

export default App;
