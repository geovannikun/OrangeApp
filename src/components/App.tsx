import electron from 'electron'
import { inject, observer } from 'mobx-react'
import { SketchFile } from 'node-sketch'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import PanelGroup from 'react-panelgroup'
import { toast, ToastContainer } from 'react-toastify'

import '../assets/css/App.css'
import '../assets/css/Canvas.css'
import '../assets/css/DetailsColor.css'
import Config from '../classes/Config'
import {
  IOrangeItem,
  IOrangePrimitive,
  OrangeArtboard,
  OrangeImage,
  OrangeLayer,
  OrangePage,
  OrangePlugin,
  OrangePosition,
  OrangeRect,
  OrangeSize,
  OrangeStyle,
  OrangeText,
  OrangeTool,
} from '../classes/index'
import AppStore from '../stores/AppStore'
import DocumentStore from '../stores/DocumentStore'
import SelectorStore from '../stores/SelectorStore'
import ParserUtils from '../utils/ParserUtils'
import HTMLCanvas from './canvas/HTMLCanvas'
import ContextMenu from './ContextMenu'
import ContextMenuItem from './ContextMenuItem'
import Details from './Details'
import Header from './Header'
import Pages from './Pages'
import Tools from './Tools'

interface AppState {
  dropZoneActive: boolean
}

interface InjectedProps {
  document: DocumentStore
  selector: SelectorStore
  app: AppStore
}

@inject('document', 'selector', 'app')
@observer
class App extends React.Component<object, AppState> {

  get injected() {
    return this.props as InjectedProps
  }

  private renderComponents = {
    HTMLCanvas,
  }

  public componentDidMount() {
    Config.startApplication()
    const sketchPlugin = new OrangePlugin(['application/zip', 'application/x-wine-extension-sketch'])
    sketchPlugin.importFile = async (file: File) => {
      const sketchFile = await ParserUtils.parseSketchFile(file.path)
      console.log(sketchFile)
    }

    const imagePlugin = new OrangePlugin(['image/jpeg', 'image/png'])
    imagePlugin.importFile = async (file: File) => {
      const img = electron.nativeImage.createFromPath(file.path)
      const oImage = new OrangeImage('image', new OrangePosition(0, 0), img.getSize() as OrangeSize, img.toDataURL())
      this.injected.document.selectedPage.add(oImage)
      oImage.setPosition(100, 100)
    }

    this.injected.document.addPage(new OrangePage('page1'))
    this.injected.app.addPlugin(sketchPlugin, imagePlugin)
    const page = this.injected.document.selectedPage

    const oArtboard = new OrangeArtboard('oArtboard', new OrangePosition(250, 100), new OrangeSize(400, 800))
    const oLayer = new OrangeLayer('layer', new OrangePosition(250, 150), new OrangeSize(100, 100))
    const oRectangle = new OrangeRect('rect', new OrangePosition(300, 150), new OrangeSize(100, 100))
    const oText = new OrangeText('text', new OrangePosition(310, 160), new OrangeSize(100, 10))
    oText.setText('Olar')

    page.add(oArtboard)
    page.add(oLayer)
    page.add(oRectangle)
    page.add(oText)
    oRectangle.changeParent(oLayer)
    // debugger;
    oLayer.changeParent(oArtboard)
  }

  private updateElement = (element: IOrangeItem , prop: string, value: any) => {
    if (element) {
      switch (prop) {
        case 'add':
          if (element instanceof OrangeLayer) {
            element.add(value)
          }
          break
        case 'position':
          element.position = value
          break
        case 'name':
          element.name = value
          break
        case 'width':
          element.size = new OrangeSize(parseInt(value, 0), element.size.height)
          break
        case 'height':
          element.size = new OrangeSize(element.size.width, parseInt(value, 0))
          break
        case 'fill':
          if (element instanceof IOrangePrimitive) {
            element.style = { fillColor: value }
          }
          break
      }
    }
  }

  private updateOrangeItem = (item: IOrangeItem, artboard: OrangeLayer): OrangeLayer => {
    if (item instanceof IOrangeItem) {
      artboard.children = artboard.children.map((subItem: IOrangeItem) => {
        if (item === subItem) {
          return item
        }
        return subItem
      })
      return artboard
    } else {
      if (item === artboard) {
        return item
      }
      return artboard
    }
  }

  private renderObjectList = (list: IOrangeItem[]): JSX.Element[] => {
    return list.map((item: IOrangeItem) => (
      <li
        key={item.id}
        onClick={this.handleElementSelection(item, 'select')}
        className={this.injected.selector.selecteds.find((selected) => selected === item) ? 'selected' : ''}
      >
        {item.name}
        {item instanceof OrangeLayer && this.renderSubList(item.children)}
      </li>
    ))
  }

  private renderSubList = (list: IOrangeItem[]): JSX.Element => {
    return(
      <ul>
        {this.renderObjectList(list)}
      </ul>
    )
  }

  private handleElementSelection = (item: IOrangeItem, propertie: string) => (event: any) => {
    event = (event as MouseEvent)
    event.stopPropagation()
    this.injected.selector.select(item, event.ctrlKey)
  }

  private handleContextMenu = (event: any) => {
    console.log('oi')
  }

  private handleDrop = (accepted: File[], rejected: File[]) => {
    if (rejected.length) {
      alert('Some files are unsuported')
    }
    accepted.forEach(async (file) => {
      if (!this.injected.app.importFile(file.type, file)) {
        // debugger
        toast.error('Error on import', {
          position: toast.POSITION.TOP_LEFT,
        })
      }
    })
    this.setState({ dropZoneActive: false })
  }

  private dragOverlayRender = (dropZoneActive: boolean) => {
    if (dropZoneActive) {
      return (<div className='drag-overlay'>
        <div className='box'>
          Drop files...
        </div>
      </div>)
    }
  }

  private preventDropzoneClick = (evt: React.MouseEvent<HTMLElement>) =>
    evt.preventDefault()

  private renderCore = (selectedPage: OrangePage, isDragActive: boolean) => (
    <main style={{ position: 'fixed', left: 0, top: 0, bottom: 0, right: 0 }}>
      {this.dragOverlayRender(isDragActive)}
      <ContextMenu>
        <ContextMenuItem onClick={this.handleContextMenu}>Teste</ContextMenuItem>
      </ContextMenu>
      <PanelGroup
        direction='column'
        panelWidths={[{size: 50, resize: 'fixed'}, {minSize: 100, resize: 'dynamic'}]}
      >
        <Header/>
        <PanelGroup
          direction='row'
          panelWidths={[
            {size: 50, resize: 'fixed'},
            {minSize: 200, resize: 'dynamic'},
            {minSize: 250, resize: 'stretch'},
            {minSize: 250, resize: 'dynamic'},
          ]}
        >
          <Tools/>
          <aside className='content'>
            <Pages/>
            <ul className='layer-three'>
              {selectedPage && this.renderObjectList(selectedPage.children)}
            </ul>
          </aside>
          <this.renderComponents.HTMLCanvas/>
          <Details/>
        </PanelGroup>
      </PanelGroup>
      <ToastContainer />
    </main>
  )

  public render() {
    const { selectedPage } = this.injected.document
    return (
      <Dropzone
        onClick={this.preventDropzoneClick}
        accept={Object.keys(this.injected.app.mimeTypes).join(', ')}
        onDrop={this.handleDrop}
      >
        {({ isDragActive }: any) => this.renderCore(selectedPage, isDragActive)}
      </Dropzone>
    )
  }
}

export default App
