import React from 'react'
import {
  OrangeTool,
} from '../classes/index'

interface ToolsProps {
  tools: OrangeTool[]
  selectedTool?: OrangeTool
  onSelect: (tool: OrangeTool) => void
}

class Tools extends React.Component<ToolsProps> {

  private handleChangeTool = (tool: OrangeTool) => () => {
    this.props.onSelect(tool)
  }

  private renderToolsList = (list: OrangeTool[]): JSX.Element[] => {
    return list.map((tool: OrangeTool) => (
      <li
        key={tool.title}
        onClick={this.handleChangeTool(tool)}
        className={(this.props.selectedTool === tool) ? 'selected' : ''}
      >
        {tool.icon}
      </li>
    ))
  }

  public render() {
    return (
      <aside className='tools'>
        <ul>
          {this.renderToolsList(this.props.tools)}
        </ul>
      </aside>
    )
  }
}

export default Tools
