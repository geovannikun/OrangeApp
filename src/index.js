import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import DocumentStore from './stores/DocumentStore';
import SelectorStore from './stores/SelectorStore';
import ToolsStore from './stores/ToolsStore';
import AppStore from './stores/AppStore';

import { Provider } from 'mobx-react';
import * as mobx from 'mobx';

mobx.useStrict(true);

const reactSelection = document.createElement('selection');
document.body.appendChild(reactSelection);

const documentStore = new DocumentStore();
const selectorStore = new SelectorStore();
const toolsStore = new ToolsStore();
const appStore = new AppStore();

// Now we can render our application into it
render(
  <Provider app={ appStore } document={ documentStore } selector={ selectorStore } tools={ toolsStore }>
    <App/>
  </Provider>,
  reactSelection
);
