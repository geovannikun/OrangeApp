import { inject, observer } from 'mobx-react'
import React from 'react'

import electron from 'electron'
const { BrowserWindow } = electron.remote

import DocumentStore from '../stores/DocumentStore'

interface InjectedProps {
  document: DocumentStore
}
@inject('document')
@observer
class Header extends React.Component {

  get injected() {
    return this.props as InjectedProps
  }

  private windowAction = (action: string) => {
    const window = BrowserWindow.getFocusedWindow()
    switch (action) {
      case 'close':
        window!.close()
        break
      case 'minimize':
        window!.minimize()
        break
      case 'maximize':
        if (window!.isMaximized()) {
          window!.unmaximize()
        } else {
            window!.maximize()
        }
        break
      default:
        throw new Error('Error')
    }
  }

  private handleFileName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.changeFileName((event.target as HTMLInputElement).value)
  }

  private changeFileName = (fileName: string) => {
    this.injected.document.setTitle(fileName)
  }

  private handleWinControl = (action: string) => (event: any) => {
    this.windowAction(action)
  }

  public render() {
    return (
      <header>
        <ul className='actions'>
          <li>≡</li>
          <li>proto<b>editor :)</b></li>
        </ul>
        <div className='document-name'>
          <input value={this.injected.document.title} onChange={this.handleFileName}/>
        </div>
        <ul className='win-control'>
          <li className={'minimize-action'} onClick={this.handleWinControl('minimize')}/>
          <li className={'maximize-action'} onClick={this.handleWinControl('maximize')}/>
          <li className={'close-action'} onClick={this.handleWinControl('close')}/>
        </ul>
      </header>
    )
  }
}

export default Header
