import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

const reactSelection = document.createElement('selection');
document.body.appendChild(reactSelection);

// Now we can render our application into it
render( <App />, reactSelection );
