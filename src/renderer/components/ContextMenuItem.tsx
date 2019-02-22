import React from 'react'

interface MyProps {
  children: string
  onClick: any
}

class ContextMenu extends React.Component<MyProps, object> {
  public render() {
    return (
      <li onClick={this.props.onClick}>{this.props.children}</li>
    )
  }
}

export default ContextMenu
