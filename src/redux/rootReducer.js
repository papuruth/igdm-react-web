import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { sessionReducer } from 'redux-react-session';
import { userReducer, userFeedReducer } from './user/userReducer';
import chatReducer from './chats/chatsReducer';
import timelineReducer from './timeline/timelineReducer';

// export default (history) =>
//   combineReducers({
//     router: connectRouter(history),
//     session: sessionReducer,
//     userReducer,
//     chatReducer,
//   });

export const rootReducer = (history) => {
  const appReducer = combineReducers({
    router: connectRouter(history),
    session: sessionReducer,
    userReducer,
    chatReducer,
    userFeedReducer,
    timelineReducer,
  });
  return (state, action) => appReducer(state, action);
};
