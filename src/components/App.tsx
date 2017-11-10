import '../assets/css/App.css';
import React, { Component } from 'react';
import paper, { Tool, Point, Rectangle, Size, Path, Group } from 'paper';
import { OrangeRect, OrangePosition, OrangeSize, OrangeStyle, IOrangeItem } from '../classes/index';
import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem';
const {BrowserWindow} = require('electron').remote;

paper.install(window);

class ProtoTool{
  title: string
  icon: string
  tool: Tool
  constructor(title:string, icon:string, tool:Tool){
    this.title = title;
    this.icon = icon;
    this.tool = tool;
  }
}

interface MyState {
  tools: Array<ProtoTool>;
  currentTool?: ProtoTool;
  objects: Array<IOrangeItem>;
  fileName: string;
}

class App extends React.Component<Object, MyState> {
  state = {
    tools: new Array(),
    currentTool: undefined,
    objects: new Array<IOrangeItem>(),
    fileName: 'filename',
  }

  componentDidMount(){
    paper.setup('canvas');
    paper.settings.handleSize = 10;

    var hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 5
    };
    var secondPath = new Path.Circle(new Point(180, 50), 35);
    secondPath.fillColor = 'red';

    const o_rectangle = new OrangeRect('rect', new OrangePosition(800, 300), new OrangeSize(100, 100));
    o_rectangle.selected = true;
    o_rectangle.render(paper);

    var selectionRect:Path.Rectangle = new Path.Rectangle({
      point: [0, 0],
      size: [1, 1],
      strokeColor: 'black',
      fillColor: 'rgba(0, 0, 0, 0.1)',
      dashArray: [10, 12],
    });
    
    var selectionStartPoint:Point | null;
    var selectionItem:paper.Item | null;
    const selection = new Tool();
    selection.onMouseDown = (event) => {
      var hitResult = paper.project.hitTest(event.point, hitOptions);
      if(hitResult){
        selectionItem = hitResult.item;
        const element:IOrangeItem = this.state.objects.find((object:IOrangeItem) => object.element === selectionItem);
        this.updateElement(element, 'select', true);
        selectionStartPoint = null;
      }else{
        this.state.objects.forEach(
          (object:IOrangeItem) => this.updateElement(object, 'select', false)
        );
        selectionStartPoint = event.point;
      }
    }
    selection.onMouseDrag = (event) => {
      if(selectionItem){
        this.state.objects.forEach((object:IOrangeItem) => 
          object.selected && this.updateElement(object, 'position', new OrangePosition(
            object.position.x + event.delta.x,
            object.position.y + event.delta.y, 
          ))
        );
      }else if(selectionStartPoint){
        paper.project.deselectAll();
        if(selectionStartPoint.y < event.point.y && selectionStartPoint.x < event.point.x){
          selectionRect.bounds = new Rectangle(selectionStartPoint, event.point)
        }else if(selectionStartPoint.y > event.point.y && selectionStartPoint.x > event.point.x){
          selectionRect.bounds = new Rectangle(event.point, selectionStartPoint)
        }else if(selectionStartPoint.y > event.point.y && selectionStartPoint.x < event.point.x){
          selectionRect.bounds = new Rectangle(new Point(selectionStartPoint.x, event.point.y), new Point(event.point.x, selectionStartPoint.y))
        }else if(selectionStartPoint.y < event.point.y && selectionStartPoint.x > event.point.x){
          selectionRect.bounds = new Rectangle(new Point(event.point.x, selectionStartPoint.y), new Point(selectionStartPoint.x, event.point.y))
        }
        paper.project.getItems({
          recursive: true,
          inside: selectionRect.bounds
        }).forEach((item:paper.Item) => {
          const element:IOrangeItem = this.state.objects.find((object:IOrangeItem) => object.element === item);
          this.updateElement(element, 'select', true);
        })
        selectionRect.selected = false;
      }
    }

    selection.onMouseUp = function(event) {
      if(selectionItem){
        selectionItem = null;
      }else if(selectionStartPoint){
        selectionStartPoint = null;
        selectionRect.bounds = new Rectangle(new Point(0, 0), new Point(1, 1));
      }
    }

    const rect = new Tool();
    rect.onMouseDown = function(event) {
      console.log('rect');
      // Create a new path every time the mouse is clicked
      path = new Path();
      path.add(event.point);
      path.strokeColor = 'black';
    }
    const text = new Tool();
    const layer = new Tool();

    const tools = new Array<ProtoTool>();

    tools.push(new ProtoTool('selection', '⊹', selection))
    tools.push(new ProtoTool('rect', '◻', rect))
    tools.push(new ProtoTool('text', '℞', text))
    tools.push(new ProtoTool('layer', 'layer', layer))

    this.setState({
      ...this.state,
      objects: [...this.state.objects, o_rectangle],
      tools,
    }, () => this.changeTool(tools[0]));
  }

  changeFileName = (fileName:string) => {
    this.setState({
      ...this.state,
      fileName
    });
  }

  updateElement = (element:IOrangeItem ,prop:string, value:any) => {
    if(element){
      switch (prop) {
        case 'position':
          element.position = value;
          break;
        case 'name':
          element.name = value;
          break;
        case 'select':
          element.selected = value;
          break;
        case 'width':
          element.size = new OrangeSize(parseInt(value), element.size.height);
          break;
        case 'height':
          element.size = new OrangeSize(element.size.width, parseInt(value));
          break;
        case 'fill':
          element.style = { fillColor:  value} as OrangeStyle;
          break;
      }
      this.setState({
        ...this.state,
        objects: this.state.objects.map((item:IOrangeItem) => {
          if(item.id === element.id)
            return element;
          return item;
        }),
      });
    }
  }

  changeTool = (tool:ProtoTool) => {
    tool.tool.activate();
    this.setState({
      ...this.state,
      currentTool: tool
    });
  }

  windowAction = (action:string) => {
    var window = BrowserWindow.getFocusedWindow();
    switch(action){
      case 'close':
        window.close();
        break;
      case 'minimize':
        window.minimize();
        break;
      case 'maximize':
        if(window.isMaximized()){
          window.unmaximize();
        }else{
            window.maximize();
        }
        break;
      default:
        throw new Error('Error');
    }
  }

  getSelectedItems = (items:Array<IOrangeItem>) => {
    return items.filter(item => item.selected);
  }

  renderObjectList = (list:Array<IOrangeItem>):JSX.Element => {
    return (
      <ul className='layer-three'>
        { list.map((item:IOrangeItem) => (
          <li key={item.id} onClick={() => this.updateElement(item, 'select', true)} className={item.selected ? 'selected' : ''}>
            {item.name}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const selectedItems:Array<IOrangeItem> = this.getSelectedItems(this.state.objects);
    return (
      <main>
        <ContextMenu>
          <ContextMenuItem onClick={() => console.log('teste')}>Teste</ContextMenuItem>
        </ContextMenu>
        <header>
          <ul className='actions'>
            <li>≡</li>
            <li>proto<b>editor</b></li>
          </ul>
          <div className='document-name'>
            <input value={this.state.fileName} onChange={(e) => this.changeFileName(e.target.value)}/>
          </div>
          <ul className='win-control'>
            <li onClick={() => this.windowAction('minimize')}>⊖</li>
            <li onClick={() => this.windowAction('maximize')}>⊕</li>
            <li onClick={() => this.windowAction('close')}>⊗</li>
          </ul>
        </header>
        <aside className='tools'>
          <ul>
            { this.state.tools.map((tool:ProtoTool) => (
              <li key={tool.title} onClick={() => this.changeTool(tool)} className={(this.state.currentTool==tool)?'selected':''}>{tool.icon}</li>
            ))}
          </ul>
        </aside>
        <aside className='content'>
          <ul className='pages'>
            <li className='current'>Current page</li>
            <li>page 2</li>
            <li>page 3</li>
            <li>page 4</li>
          </ul>
          {this.renderObjectList(this.state.objects)}
        </aside>
        <canvas id='canvas' resize="true"/>
        <aside className='details'>
          {selectedItems.length == 1 && (
            <section>
              <input value={selectedItems[0].name} onChange={(e) => this.updateElement(selectedItems[0], 'name', e.target.value)}/>
              <div className='row'>
                <span className='input-field unit-px'>
                  <label>Width</label>
                  <input type='number' value={selectedItems[0].size.width} onChange={(e) => this.updateElement(selectedItems[0], 'width', e.target.value)}/>
                </span>
                <span className='input-field unit-px'>
                  <label>Height</label>
                  <input type='number' value={selectedItems[0].size.height} onChange={(e) => this.updateElement(selectedItems[0], 'height', e.target.value)}/>
                </span>
              </div>
              <div className='row'>
                <span className='input-field'>
                  <label>Color</label>
                  <input value={selectedItems[0].style.fillColor} onChange={(e) => this.updateElement(selectedItems[0], 'fill', e.target.value)}/>
                </span>
              </div>
            </section>
          )}
        </aside>
      </main>
    );
  }
}

export default App;
