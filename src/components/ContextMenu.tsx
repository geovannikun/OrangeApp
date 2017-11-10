import React, { Component } from 'react';
import ContextMenuItem from './ContextMenuItem';

interface MyProps{
  children: JSX.Element;
}

interface MyState{
  visible: boolean;
  x: number;
  y: number;
}

class ContextMenu extends React.Component<MyProps, MyState> {
  state = {
    visible: false,
    x: 0,
    y: 0,
  }
  componentDidMount(){    
    document.addEventListener("contextmenu", (e) => {
      this.setState({
        visible: true,
        x: e.clientX+1,
        y: e.clientY+1,
      });
      console.log(e);
    });
    document.addEventListener("mousedown", (e) => {
      this.setState({
        visible: false,
        x: e.clientX+1,
        y: e.clientY+1,
      });
    });
  }

  render() {
    return (
      <nav
        id='context-menu'
        className={ this.state.visible ? 'show' : 'hide' }
        style={{ left: this.state.x, top: this.state.y }}>
        <ul>
          {this.props.children}
        </ul>
      </nav>
    );
  }
}

export default ContextMenu;
