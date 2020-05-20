import { call, put, takeEvery, delay } from 'redux-saga/effects';
import api from '@/services/api';
import { timelineConstants } from './timelineConstants';

export const success = (type, payload) => ({
  type,
  payload,
});

export const failure = (type, error) => ({
  type,
  error,
});

const fetchTimelineService = async () => {
  try {
    const response = await api.get('/timeline');
    return { response: response.data };
  } catch (error) {
    return { error };
  }
};

function* fetchTimelineSaga() {
  const { response, error } = yield call(fetchTimelineService);
  if (response) {
    yield put(
      yield call(success, timelineConstants.FETCH_TIMELINE_SUCCESS, response),
    );
  } else {
    yield put(
      yield call(failure, timelineConstants.FETCH_TIMELINE_FAILURE, error),
    );
    yield delay(3000);
    fetchTimelineSaga();
  }
}

export function* fetchTimelineWatcherSaga() {
  yield takeEvery(timelineConstants.FETCH_TIMELINE_REQUEST, fetchTimelineSaga);
}
