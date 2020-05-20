import { loaderConstants } from './loaderConstants';

const initialState = {
  profilePhotoLoader: false,
};

export default function loaderReducer(state = initialState, action) {
  switch (action.type) {
    case loaderConstants.SHOW_LOADER_SUCCESS:
      return {
        [action.payload.type]: action.payload.flag,
      };
    default:
      return state;
  }
}
