import App from '@/App';
import $ from 'jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from './store/store';
import GlobalStyled from './styles/global';

window.$ = $;
window.jquery = $;

window.addEventListener('keydown', (event) => {
  if (event.keyCode === 83 && event.ctrlKey) {
    event.preventDefault();
    return false;
  }
  return false;
});

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyled />
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
