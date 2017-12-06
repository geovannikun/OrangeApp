import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';

import electron from 'electron';
const { BrowserWindow } = electron.remote;

import DocumentStore from '../stores/DocumentStore';

interface IMyProps {
  document: DocumentStore;
}

@observer
class Header extends React.Component<IMyProps, object> {

  constructor(props: IMyProps) {
    super(props);
  }

  private windowAction = (action: string) => {
    const window = BrowserWindow.getFocusedWindow();
    switch (action) {
      case 'close':
        window.close();
        break;
      case 'minimize':
        window.minimize();
        break;
      case 'maximize':
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
            window.maximize();
        }
        break;
      default:
        throw new Error('Error');
    }
  }

  private handleFileName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.changeFileName((event.target as HTMLInputElement).value);
  }

  private changeFileName = (fileName: string) => {
    this.props.document.setTitle(fileName);
  }

  private handleWinControl = (action: string) => (event: any) => {
    this.windowAction(action);
  }

  public render() {
    return (
      <header>
        <ul className='actions'>
          <li>≡</li>
          <li>proto<b>editor :)</b></li>
        </ul>
        <div className='document-name'>
          <input value={this.props.document.title} onChange={this.handleFileName}/>
        </div>
        <ul className='win-control'>
          <li onClick={this.handleWinControl('minimize')}>⊖</li>
          <li onClick={this.handleWinControl('maximize')}>⊕</li>
          <li onClick={this.handleWinControl('close')}>⊗</li>
        </ul>
      </header>
    );
  }
}

export default Header;
