import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import Document from './stores/document'

import { Provider } from 'mobx-react';

const reactSelection = document.createElement('selection');
document.body.appendChild(reactSelection);

const documentStore = new Document();

// Now we can render our application into it
render(
  <Provider document={documentStore}>
    <App/>
  </Provider>,
  reactSelection
);
