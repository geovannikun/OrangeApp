import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import React from 'react'
import { render } from 'react-dom'

import App from './components/App'
import {
  appStore,
  documentStore,
  selectorStore,
  toolsStore,
} from './stores'

configure({
  enforceActions: 'observed',
})

const app = document.querySelector('#app')

// Now we can render our application into it
render(
  <Provider app={appStore} document={documentStore} selector={selectorStore} tools={toolsStore}>
    <App/>
  </Provider>,
  app,
)
