import { userConstants } from './userConstants';

export default function userReducer(state = {}, action) {
  switch (action.type) {
    case userConstants.USER_AUTH_SUCCESS:
      return {
        ...state,
        authStatus: action.payload,
      };
    case userConstants.GREETINGS_FLAG_SUCCESS:
      return {
        ...state,
        greetingsFlag: action.payload,
      };
    case userConstants.USER_AUTH_FAILURE:
      return {
        ...state,
        errorPayload: action.error.error,
        errorType: action.error.type,
      };
    case userConstants.USER_LOGOUT_SUCCESS:
      return {
        logoutStatus: action.payload,
      };
    case userConstants.USER_LOGOUT_FAILURE:
      return {
        logoutError: action.payload,
      };
    default:
      return { ...state };
  }
}
