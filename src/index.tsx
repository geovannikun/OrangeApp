import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import {
  documentStore,
  selectorStore,
  toolsStore,
  appStore,
} from './stores';

import { Provider } from 'mobx-react';
import * as mobx from 'mobx';

mobx.useStrict(true);

const reactSelection = document.createElement('selection');
document.body.appendChild(reactSelection);

// Now we can render our application into it
render(
  <Provider app={appStore} document={documentStore} selector={selectorStore} tools={toolsStore}>
    <App/>
  </Provider>,
  reactSelection,
);
