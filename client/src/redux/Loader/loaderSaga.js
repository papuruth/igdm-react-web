import { call, put, takeEvery } from 'redux-saga/effects';
import { loaderConstants } from './loaderConstants';

export const success = (type, payload) => ({
  type,
  payload,
});

function* loaderSaga(action) {
  yield put(
    yield call(success, loaderConstants.SHOW_LOADER_SUCCESS, action.payload),
  );
}

export function* loaderWatcherSaga() {
  yield takeEvery(loaderConstants.SHOW_LOADER_REQUEST, loaderSaga);
}
