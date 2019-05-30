import Konva from 'konva'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import React from 'react'
import Dropzone from 'react-dropzone'
import SplitPane from 'react-split-pane'
import { toast, ToastContainer } from 'react-toastify'

import '../assets/css/App.scss'
import '../assets/css/Canvas.scss'
import '../assets/css/DetailsColor.scss'
import '../assets/css/Resizer.scss'

import Config from '../classes/Config'
import {
  IOrangeItem,
  OrangeArtboard,
  OrangeImage,
  OrangeLayer,
  OrangePage,
  OrangePlugin,
  OrangePosition,
  OrangeRect,
  OrangeSize,
  OrangeText,
  OrangeTool,
} from '../classes/index'
import OrangeCore from '../classes/OrangeCore'
import { OrangeRectTool, OrangeSelectionTool } from '../classes/Tools'
import { ContextMenu, ContextMenuItem, Details, DocumentThree, Header, Tools } from '../components'
import { appStore, documentStore, selectorStore, toolsStore } from '../stores'
import { HTMLCanvas } from './canvas/HTMLCanvas'
import { KonvaCanvas } from './canvas/KonvaCanvas'

interface AppState {
  dropZoneActive: boolean
}

interface InjectedProps {
  document: typeof documentStore
  selector: typeof selectorStore
  app: typeof appStore
  tools: typeof toolsStore
}

@inject('document', 'selector', 'app', 'tools')
@observer
class App extends React.Component<object, AppState> {

  get injected() {
    return this.props as InjectedProps
  }

  private renderComponents = {
    HTMLCanvas,
    KonvaCanvas,
  }

  public componentDidMount() {
    const { document } = this.injected
    Config.startApplication()
    const sketchPlugin = new OrangePlugin(['application/zip', 'application/x-wine-extension-sketch'])
    sketchPlugin.importFile = (async () => {
      // const sketchFile = await ParserUtils.parseSketchFile(file.path)
      // console.log(sketchFile)
    })

    const imagePlugin = new OrangePlugin(['image/jpeg', 'image/png'])
    imagePlugin.importFile = (async (file: File) => {
      const img = OrangeCore.createNativeImage(file.path)
      const oImage = new OrangeImage('image', new OrangePosition(0, 0), img.getSize() as OrangeSize, img.toDataURL())
      if (document.selectedPage) {
        document.selectedPage.add(oImage)
      }
      oImage.setPosition(100, 100)
    })

    this.injected.document.addPage(new OrangePage('page1'))
    this.injected.app.addPlugin(sketchPlugin, imagePlugin)

    const page = document.selectedPage

    if (page) {
      const oArtboard = new OrangeArtboard('oArtboard', new OrangePosition(250, 100), new OrangeSize(400, 800))
      const oLayer = new OrangeLayer('layer', new OrangePosition(250, 150), new OrangeSize(100, 100))
      const oRectangle = new OrangeRect('rect', new OrangePosition(300, 150), new OrangeSize(100, 100))
      const oText = new OrangeText('text', new OrangePosition(310, 160), new OrangeSize(100, 10))
      oText.setText('Olar')

      page.add(oArtboard)
      page.add(oLayer, oArtboard)
      page.add(oRectangle, oLayer)
      page.add(oText)
    }

    this.injected.tools.add(new OrangeSelectionTool())
    this.injected.tools.add(new OrangeRectTool())
  }

  private onSelect = (item?: IOrangeItem) => (event?: React.MouseEvent<HTMLElement>) => {
    // tslint:disable-next-line: no-unused-expression
    event && event.stopPropagation()
    const ctrlKey = event ? event.ctrlKey : false
    if (item) {
      this.injected.selector.select(item, ctrlKey)
    } else {
      this.injected.selector.deselect()
    }
  }

  private handleContextMenu = () => {
    // console.log('oi')
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
    return dropZoneActive ? (
      <div className='drag-overlay'>
        <div className='box'>
          Drop files...
        </div>
      </div>
    ) : (<></>)
  }

  private onSelectAreaDestroyed = (shape: Konva.ShapeConfig) => {
    this.injected.tools.selected!.onSelectAreaDestroyed(shape)
  }

  private selectTool = (tool: OrangeTool) =>
    this.injected.tools.select(tool)

  private preventDropzoneClick = (evt: React.MouseEvent<HTMLElement>) =>
    evt.preventDefault()

  private renderCore = (
    selectedPage: OrangePage,
    selecteds: IOrangeItem[],
    isDragActive: boolean,
    tools: OrangeTool[],
    selectedTool?: OrangeTool,
  ) => (
    <main style={{ position: 'fixed', left: 0, top: 0, bottom: 0, right: 0 }}>
      {this.dragOverlayRender(isDragActive)}
      <ContextMenu>
        <ContextMenuItem onClick={this.handleContextMenu}>Teste</ContextMenuItem>
      </ContextMenu>
      <Header/>
      <div style={{display: 'flex'}}>
        <Tools onSelect={this.selectTool}/>
        <SplitPane split='vertical' defaultSize={'250px'} style={{marginLeft: 50}}>
          <DocumentThree onSelect={this.onSelect}/>
          <SplitPane split='vertical' defaultSize={'250px'} primary='second'>
            <this.renderComponents.KonvaCanvas
              page={selectedPage}
              selecteds={selecteds}
              onSelectAreaCreated={_.identity}
              onSelectAreaChange={_.identity}
              onSelectAreaDestroyed={this.onSelectAreaDestroyed}
            />
            <Details/>
          </SplitPane>
        </SplitPane>
      </div>
      <ToastContainer />
    </main>
  )

  public render() {
    const { selectedPage } = this.injected.document
    const { selecteds } = this.injected.selector
    const { all, selected } = this.injected.tools

    return selectedPage ? (
      <Dropzone
        onClick={this.preventDropzoneClick}
        accept={Object.keys(this.injected.app.mimeTypes).join(', ')}
        onDrop={this.handleDrop}
      >
        {({ isDragActive }: any) => this.renderCore(selectedPage, selecteds, isDragActive, all, selected)}
      </Dropzone>
    ) : (<></>)
  }
}

export default App
