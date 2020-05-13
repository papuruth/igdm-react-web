import { timelineConstants } from './timelineConstants';

const initialState = {
  timelines: [],
};

export default function timelineReducer(state = initialState, action) {
  switch (action.type) {
    case timelineConstants.FETCH_TIMELINE_SUCCESS:
      return {
        timelines: [...state.timelines, ...action.payload.timelines],
        hasMore: action.payload.hasMore,
      };
    default:
      return state;
  }
}
