import AppStore from './AppStore'
import DocumentStore from './DocumentStore'
import SelectorStore from './SelectorStore'
import ToolsStore from './ToolsStore'

const documentStore = new DocumentStore()
const selectorStore = new SelectorStore()
const toolsStore = new ToolsStore()
const appStore = new AppStore()

export { documentStore, selectorStore, toolsStore, appStore }
