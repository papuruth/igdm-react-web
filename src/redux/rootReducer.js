import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { sessionReducer } from 'redux-react-session';
import userReducer from './user/userReducer';
import chatReducer from './chats/chatsReducer';

// import { reducer as session } from './session';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    session: sessionReducer,
    userReducer,
    chatReducer,
  });
