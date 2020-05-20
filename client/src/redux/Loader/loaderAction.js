import { loaderConstants } from './loaderConstants';

export const loaderAction = (flag, type) => ({
  type: loaderConstants.SHOW_LOADER_REQUEST,
  payload: {
    type,
    flag,
  },
});
