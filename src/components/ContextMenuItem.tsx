import React, { Component } from 'react';

interface MyProps{
  children: string;
  onClick: any;
}

class ContextMenu extends React.Component<MyProps, Object> {
  render() {
    return (
      <li onClick={this.props.onClick}>{this.props.children}</li>
    );
  }
}

export default ContextMenu;
