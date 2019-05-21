import { inject, observer } from 'mobx-react'
import React from 'react'
import {
  OrangeTool,
} from '../classes/index'
import { toolsStore } from '../stores'

interface ToolsProps {
  onSelect: (tool: OrangeTool) => void
}

interface InjectedProps {
  tools: typeof toolsStore
}

@inject('tools')
@observer
class Tools extends React.Component<ToolsProps> {

  get injected() {
    return this.props as any as InjectedProps
  }

  private handleChangeTool = (tool: OrangeTool) => () => {
    this.props.onSelect(tool)
  }

  private renderToolsList = (list: OrangeTool[]): JSX.Element[] => {
    return list.map((tool: OrangeTool) => (
      <li
        key={tool.title}
        onClick={this.handleChangeTool(tool)}
        className={(this.injected.tools.selected === tool) ? 'selected' : ''}
      >
        <img src={tool.icon}/>
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
