import DocumentStore from './DocumentStore';
import SelectorStore from './SelectorStore';
import ToolsStore from './ToolsStore';
import AppStore from './AppStore';

const documentStore = new DocumentStore();
const selectorStore = new SelectorStore();
const toolsStore = new ToolsStore();
const appStore = new AppStore();

export { documentStore, selectorStore, toolsStore, appStore };
