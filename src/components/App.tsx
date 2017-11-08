import '../assets/css/App.css';
import React, { Component } from 'react';
import paper, { Tool, Point, Rectangle, Size, Path, Group } from 'paper';
import { OrangeRect, OrangePosition, OrangeSize } from '../classes/index';
const {BrowserWindow} = require('electron').remote;

paper.install(window);

class ProtoElement{
  [key:string]: any
  id: string
  name: string
  element: paper.Item
}

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
  currentElement?: ProtoElement;
  objects: Array<ProtoElement>;
  fileName: string;
}

class App extends React.Component<Object, MyState> {
  state = {
    tools: new Array(),
    currentTool: undefined,
    currentElement: undefined,
    objects: new Array(),
    fileName: 'filename',
  }

  componentDidMount(){
    paper.setup('canvas');

    var hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 5
    };
    var secondPath = new Path.Circle(new Point(180, 50), 35);
    secondPath.fillColor = 'red';
    
    const circleEl = new ProtoElement();
    circleEl.name = 'circle';
    circleEl.id = (new Date().valueOf()).toString();
    circleEl.element = secondPath;

    const o_rectangle = new OrangeRect('rect', new OrangePosition(200, 100), new OrangeSize(200, 100));
    o_rectangle.render(paper);
    o_rectangle.position = new OrangePosition(800, 100);

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
        this.selectObject(hitResult.item);
        selectionStartPoint = null;
      }else{
        paper.project.deselectAll();
        selectionStartPoint = event.point;
      }
    }
    selection.onMouseDrag = (event) => {
      if(selectionItem){
        selectionItem.position.x += event.delta.x;
        selectionItem.position.y += event.delta.y;
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
          this.selectObject(item)
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
      objects: [...this.state.objects, circleEl],
      currentElement: circleEl,
      tools,
    }, () => this.changeTool(tools[0]));
  }

  selectObject(object:paper.Item){
    object.selected = true;
  }

  unselectObject(object:paper.Item){
    object.selected = false;
  }

  changeFileName = (fileName:string) => {
    this.setState({
      ...this.state,
      fileName
    });
  }

  updateCurrent = (prop:string, value:string) => {
    if(this.state.currentElement){
      const element:ProtoElement = this.state.currentElement;
      element[prop] = value;
      this.setState({
        ...this.state,
        currentElement: element,
      });
    }
  }

  changeCurrent = (item:ProtoElement) => {
    // this.canvas.setActiveObject(item);
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

  renderObjectList = (list:Array<ProtoElement>):JSX.Element => {
    return (
      <ul className='layer-three'>
        { list.map((item:ProtoElement) => (
          <li key={item.id} onClick={() => this.changeCurrent(item)} className={this.state.currentElement && this.state.currentElement.id == item.id ? 'selected' : ''}>
            {item.name}
            {item.getObjects && this.renderObjectList(item.getObjects())}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <main>
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
          {this.state.current && (
            <section>
              <input value={this.state.current.name} onChange={(e) => this.updateCurrent('name', e.target.value)}/>
              <div className='row'>
                <span className='input-field unit-px'>
                  <label>Width</label>
                  <input type='number' value={Math.round(this.state.current.width)} onChange={(e) => this.updateCurrent('width', e.target.value)}/>
                </span>
                <span className='input-field unit-px'>
                  <label>Height</label>
                  <input value={Math.round(this.state.current.height)} onChange={(e) => this.updateCurrent('height', e.target.value)}/>
                </span>
              </div>
              <div className='row'>
                <span className='input-field'>
                  <label>Color</label>
                  <input value={this.state.current.fill} onChange={(e) => this.updateCurrent('fill', e.target.value)}/>
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
