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
} from '../classes/index'
import OrangeCore from '../classes/OrangeCore'
import AppStore from '../stores/AppStore'
import DocumentStore from '../stores/DocumentStore'
import SelectorStore from '../stores/SelectorStore'
import { HTMLCanvas } from './canvas/HTMLCanvas'
import { KonvaCanvas } from './canvas/KonvaCanvas'
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
    KonvaCanvas,
  }

  public componentDidMount() {
    const { document } = this.injected
    Config.startApplication()
    const sketchPlugin = new OrangePlugin(['application/zip', 'application/x-wine-extension-sketch'])
    sketchPlugin.importFile = (async (file: File) => {
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
      page.add(oLayer)
      page.add(oRectangle)
      page.add(oText)
      oRectangle.changeParent(oLayer)
      // debugger;
      oLayer.changeParent(oArtboard)
    }
  }

  private renderObjectList = (list: IOrangeItem[]): JSX.Element[] => {
    return list.map((item: IOrangeItem) => (
      <li
        key={item.id}
        onClick={this.handleElementSelection(item)}
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

  private handleElementSelection = (item: IOrangeItem) => (event: any) => {
    event = (event as MouseEvent)
    event.stopPropagation()
    this.injected.selector.select(item, event.ctrlKey)
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

  private preventDropzoneClick = (evt: React.MouseEvent<HTMLElement>) =>
    evt.preventDefault()

  private renderCore = (selectedPage: OrangePage, isDragActive: boolean) => (
    <main style={{ position: 'fixed', left: 0, top: 0, bottom: 0, right: 0 }}>
      {this.dragOverlayRender(isDragActive)}
      <ContextMenu>
        <ContextMenuItem onClick={this.handleContextMenu}>Teste</ContextMenuItem>
      </ContextMenu>
      <Header/>
      <div style={{display: 'flex'}}>
        <Tools/>
        <SplitPane split='vertical' defaultSize={'250px'} style={{marginLeft: 50}}>
          <aside className='content'>
            <Pages/>
            <ul className='layer-three'>
              {selectedPage && this.renderObjectList(selectedPage.children)}
            </ul>
          </aside>
          <SplitPane split='vertical' defaultSize={'250px'} primary='second'>
            <this.renderComponents.KonvaCanvas/>
            <Details/>
          </SplitPane>
        </SplitPane>
      </div>
      <ToastContainer />
    </main>
  )

  public render() {
    const { selectedPage } = this.injected.document
    return selectedPage ? (
      <Dropzone
        onClick={this.preventDropzoneClick}
        accept={Object.keys(this.injected.app.mimeTypes).join(', ')}
        onDrop={this.handleDrop}
      >
        {({ isDragActive }: any) => this.renderCore(selectedPage, isDragActive)}
      </Dropzone>
    ) : (<></>)
  }
}

export default App
