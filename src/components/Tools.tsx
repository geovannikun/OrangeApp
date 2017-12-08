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

import {
  OrangeTool,
  IOrangeItem,
  OrangePosition,
  OrangeRect,
  OrangeSize,
  OrangeArtboard,
} from '../classes/index';
import Toolstore from '../stores/ToolsStore';
import SelectorStore from '../stores/SelectorStore';
import AppStore from '../stores/AppStore';

interface InjectedProps {
  tools: Toolstore;
  selector: SelectorStore;
  app: AppStore;
}
@inject('selector', 'tools', 'app')
@observer
class Tools extends React.Component {

  get injected() {
    return this.props as InjectedProps;
  }

  private _selectionRect: Path.Rectangle;

  public componentWillReceiveProps(nextProps: InjectedProps) {
    if (nextProps.app.canvas && !this.injected.tools.all.length) {
      this._selectionRect = new Path.Rectangle({
        dashArray: [10, 12],
        fillColor: 'rgba(0, 0, 0, 0.1)',
        point: [0, 0],
        size: [1, 1],
        strokeColor: 'black',
      });
      this._selectionRect.visible = false;

      const text = new Tool();
      const layer = new Tool();
      this.injected.tools.add(new OrangeTool('selection', '⊹', this.createSelectionTool()));
      this.injected.tools.add(new OrangeTool('rect', '◻', this.createRectTool()));
      this.injected.tools.add(new OrangeTool('text', '℞', text));
      this.injected.tools.add(new OrangeTool('layer', 'layer', layer));
    }
  }

  private createSelectionTool() {
    const hitOptions = { fill: true, segments: true, stroke: true, tolerance: 5 };
    const selection = new Tool();
    selection.onMouseDrag = (event: paper.ToolEvent) => {
      if (this.injected.selector.selecteds.length && !this._selectionRect.visible) {
        this.injected.selector.selecteds.forEach((object: IOrangeItem) => {
          object.setPosition(
            object.position.x + event.delta.x,
            object.position.y + event.delta.y,
          );
        });
      } else {
        this.injected.selector.clear();
        if (event.downPoint.y !== event.point.y && event.downPoint.x !== event.point.x) {
          const x = [event.point.x, event.downPoint.x].sort();
          const y = [event.point.y, event.downPoint.y].sort();
          this._selectionRect.bounds = new Rectangle(
            new Point(x[0], y[0]),
            new Point(x[1], y[1]),
          );
          this._selectionRect.visible = true;
        }
        paper.project.getItems({
          inside: this._selectionRect.bounds,
          recursive: true,
        }).forEach((selected: paper.Item) => {
          const object = selected.data.primitive;
          this.injected.selector.select(object);
        });
      }
    };
    selection.onMouseUp = (e: paper.ToolEvent) => {
      if (this._selectionRect.visible) {
        this._selectionRect.visible = false;
        this._selectionRect.bounds = new Rectangle(new Point(0, 0), new Point(1, 1));
      } else {
        if (e.event.which === 1) {
          const hitResult = paper.project.hitTest(e.point, hitOptions);
          if (hitResult) {
            const object = hitResult.item.data.primitive;
            this.injected.selector.select(object, e.event.ctrlKey);
          } else {
            this.injected.selector.clear();
          }
        }
      }
    };
    selection.onKeyDown = (e: paper.KeyEvent) => {
      if (this.injected.selector.selecteds.length) {
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
        this.injected.selector.selecteds.forEach((object: IOrangeItem) => {
          object.setPosition(object.position.x + x, object.position.y + y);
        });
      }
    };
    return selection;
  }

  private createRectTool() {
    const rect = new Tool();
    rect.onMouseDown = (e: paper.ToolEvent) => {
      if (e.event.which === 1) {
        this._selectionRect.visible = true;
      }
    };
    rect.onMouseDrag = (event: paper.ToolEvent) => {
      if (event.downPoint.y !== event.point.y && event.downPoint.x !== event.point.x) {
        const x = [event.point.x, event.downPoint.x].sort();
        const y = [event.point.y, event.downPoint.y].sort();
        this._selectionRect.bounds = new Rectangle(
          new Point(x[0], y[0]),
          new Point(x[1], y[1]),
        );
      }
    };
    rect.onMouseUp = (event: paper.ToolEvent) => {
      this._selectionRect.visible = false;
      this._selectionRect.bounds = new Rectangle(new Point(0, 0), new Point(1, 1));
      if (event.downPoint.y !== event.point.y && event.downPoint.x !== event.point.x) {
        const x = [event.point.x, event.downPoint.x].sort();
        const y = [event.point.y, event.downPoint.y].sort();
        const oRect = new OrangeRect(
          'rect oi',
          new OrangePosition(x[0], y[0]),
          new OrangeSize(x[1] - x[0], y[1] - y[0]),
        );
        this.injected.selector.select(oRect);
        const oArtboard: OrangeArtboard = this.injected.selector.selectedArtboards[0] as OrangeArtboard;
        if (oArtboard) {
          oArtboard.add(oRect);
        }
      }
    };
    return rect;
  }

  private handleChangeTool = (tool: OrangeTool) => (event: any) => {
    this.injected.tools.select(tool);
  }

  private renderToolsList = (list: OrangeTool[]): JSX.Element[] => {
    return list.map((tool: OrangeTool) => (
      <li
        key={tool.title}
        onClick={this.handleChangeTool(tool)}
        className={(this.injected.tools.selected === tool) ? 'selected' : ''}
      >
        {tool.icon}
      </li>
    ));
  }

  public render() {
    return (
      <aside className='tools'>
        <ul>
          {this.renderToolsList(this.injected.tools.all)}
        </ul>
      </aside>
    );
  }
}

export default Tools;
