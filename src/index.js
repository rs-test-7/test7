import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

import configureStore from './store/configure-store';
import {extendString} from './utils';
import App from './containers/App';

const store = configureStore();

extendString();

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path='/' component={App}/>
        </Router>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();