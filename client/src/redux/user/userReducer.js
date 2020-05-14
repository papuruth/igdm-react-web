import { userConstants } from './userConstants';

export function userReducer(state = {}, action) {
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
    case userConstants.USER_AUTH_START_CHECKPOINT_SUCCESS:
      return {
        ...state,
        isCheckpoint: action.payload.isCheckpoint,
      };
    case userConstants.USER_AUTH_START_CHECKPOINT_FAILURE:
      return {
        ...state,
        errorPayload: action.error,
      };
    case userConstants.USER_LOGOUT_SUCCESS:
      return {
        ...state,
        logoutStatus: action.payload,
      };
    case userConstants.USER_LOGOUT_FAILURE:
      return {
        logoutError: action.payload,
      };
    default:
      return state;
  }
}

const initialState = {
  userFeeds: [],
  allFeeds: [],
  hasMore: false,
  userFeedError: null,
  userInfo: {},
  friendship: {},
  highlights: {},
  suggestedUser: {},
  searchExactUserInfo: {},
};
export function userFeedReducer(state = initialState, action) {
  switch (action.type) {
    case userConstants.FETCH_USER_FEED_SUCCESS:
      return {
        ...state,
        userFeeds: action.payload.feeds,
        allFeeds:
          state.userInfo.pk !== action.payload.pk
            ? action.payload.newFeeds
            : [...state.allFeeds, ...action.payload.newFeeds],
        hasMore: action.payload.hasMore,
      };
    case userConstants.FETCH_USER_FEED_FAILURE:
      return {
        ...state,
        userFeedError: action.error,
      };
    case userConstants.FETCH_FULL_USER_INFO_SUCCESS:
      return {
        ...state,
        userInfo: action.payload.userInfo,
        friendship: action.payload.friendship,
        highlights: action.payload.highlights,
        suggestedUser: action.payload.suggestedUser,
      };
    case userConstants.FETCH_FULL_USER_INFO_FAILURE:
      return {
        ...state,
      };
    case userConstants.SEARCH_EXACT_USER_SUCCESS:
      return {
        ...state,
        searchExactUserInfo: action.payload,
      };
    case userConstants.SEARCH_EXACT_USER_FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
}
