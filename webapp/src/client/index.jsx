import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import App from './components/App';
import { MainPage } from './components/MainPage';
import appReducer from './reducers/app';
import io from 'socket.io-client';
import * as actionCreators from './action-creators';

import './styles/index.less';

const socket = io();

const remoteActionMiddleware = socket => store => next => action => {
  if (action.meta && action.meta.remote) {
    socket.emit('action', action);
  }
  next(action);
}

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);

const store = createStoreWithMiddleware(appReducer);

socket.on('action', action => {
  console.log('incoming socket action', action);
  switch (action.type) {
    case 'NAVIGATE':
      return browserHistory.push(action.path);
    default:
      return store.dispatch(action);
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={MainPage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
