import React from 'react'

interface IMyProps {
  children: JSX.Element
}

interface IMyState {
  visible: boolean
  x: number
  y: number
}

class ContextMenu extends React.Component<IMyProps, IMyState> {
  public state = {
    visible: false,
    x: 0,
    y: 0,
  }

  public componentDidMount() {
    document.addEventListener('contextmenu', (e) => {
      this.setState({
        visible: true,
        x: e.clientX + 1,
        y: e.clientY + 1,
      })
    })
    document.addEventListener('mousedown', (e) => {
      this.setState({
        visible: false,
        x: e.clientX + 1,
        y: e.clientY + 1,
      })
    })
  }

  public render() {
    return (
      <nav
        id='context-menu'
        className={this.state.visible ? 'show' : 'hide'}
        style={{ left: this.state.x, top: this.state.y }}
      >
        <ul>
          {this.props.children}
        </ul>
      </nav>
    )
  }
}

export default ContextMenu
