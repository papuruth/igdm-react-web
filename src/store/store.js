import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import { sessionService } from 'redux-react-session';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import history from '@/routes/history';
import rootReducer from '../redux/rootReducer';
import sagas from '../redux/rootSaga';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [
  sagaMiddleware,
  thunkMiddleware,
  routerMiddleware(history),
];

const persistConfig = {
  key: 'root',
  storage,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistConfig, rootReducer(history));

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

const persistor = persistStore(store);

const validateSession = () => true;

const options = {
  refreshOnCheckAuth: true,
  redirectPath: '/home',
  driver: 'COOKIES',
  validateSession,
};

sagaMiddleware.run(sagas);
sessionService
  .initSessionService(store, options)
  .then(() => console.log('Redux React Session is ready and a session was refreshed from your storage'))
  .catch(() => console.log('Redux React Session is ready and there is no session in your storage'));


export {
  store,
  persistor,
};
