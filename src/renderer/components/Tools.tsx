import { inject, observer } from 'mobx-react'
import React from 'react'

import {
  OrangeTool,
} from '../classes/index'
import AppStore from '../stores/AppStore'
import DocumentStore from '../stores/DocumentStore'
import SelectorStore from '../stores/SelectorStore'
import Toolstore from '../stores/ToolsStore'

interface InjectedProps {
  tools: Toolstore
  selector: SelectorStore
  app: AppStore
  document: DocumentStore
}
@inject('selector', 'tools', 'app', 'document')
@observer
class Tools extends React.Component {

  get injected() {
    return this.props as InjectedProps
  }

  public componentWillReceiveProps(nextProps: InjectedProps) {
    if (!this.injected.tools.all.length) {
      this.injected.tools.add(new OrangeTool('selection', '⊹'))
      this.injected.tools.add(new OrangeTool('rect', '◻'))
      this.injected.tools.add(new OrangeTool('text', '℞'))
      this.injected.tools.add(new OrangeTool('layer', 'layer'))
    }
  }

  private handleChangeTool = (tool: OrangeTool) => () => {
    this.injected.tools.select(tool)
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
    ))
  }

  public render() {
    return (
      <aside className='tools'>
        <ul>
          {this.renderToolsList(this.injected.tools.all)}
        </ul>
      </aside>
    )
  }
}

export default Tools
