/* eslint-disable import/no-cycle */
/* eslint-disable require-yield */
import history from '@/routes/history';
import api from '@/services/api';
import { sessionService } from 'redux-react-session';
import {
  call, put, takeEvery, delay,
} from 'redux-saga/effects';
import { persistor } from '@/store/store';
import { userConstants } from './userConstants';

export const success = (type, payload) => ({
  type,
  payload,
});

export const failure = (type, error) => ({
  type,
  error,
});

export const authenticateUser = async (payload) => {
  try {
    const { username, password } = payload;
    const response = await api.post('/login', { username, password });
    if (response && response.data.type === 'authResponse') {
      const userId = response.data.payload;
      const fullUserInfo = await api.get('/user-info', {
        params: {
          userId,
        },
      });
      await sessionService.saveSession(fullUserInfo.data.userInfo);
      await sessionService.saveUser(fullUserInfo.data.userInfo);
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const verifyOtpLogin = async (otpDetails) => {
  try {
    const response = await api.post('/verifyotp', { otpDetails });
    if (response && response.data.type === 'authResponse') {
      const userId = response.data.payload;
      const fullUserInfo = await api.get('/user-info', {
        params: {
          userId,
        },
      });
      await sessionService.saveSession(fullUserInfo.data.userInfo);
      await sessionService.saveUser(fullUserInfo.data.userInfo);
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

function* userAuthSaga(action) {
  const data = yield call(authenticateUser, action.payload);
  if (data && data.type === 'authResponse') {
    yield put(yield call(success, userConstants.GREETINGS_FLAG_SUCCESS, true));
    yield put(
      yield call(success, userConstants.USER_AUTH_SUCCESS, data.payload),
    );
    persistor.persist();
    history.push('/');
  }
  if (data.type === 'isCheckpointError') {
    yield put(yield call(failure, userConstants.USER_AUTH_FAILURE, data));
  }
  if (data.type === 'isTwoFactorError') {
    yield put(yield call(failure, userConstants.USER_AUTH_FAILURE, data));
  }
  if (data.type === 'loginError') {
    yield put(yield call(failure, userConstants.USER_AUTH_FAILURE, data));
  }
}

function* userAuthVerifyOtp(action) {
  const data = yield call(verifyOtpLogin, action.payload);
  if (data && data.type === 'authResponse') {
    yield put(yield call(success, userConstants.GREETINGS_FLAG_SUCCESS, true));
    yield put(
      yield call(success, userConstants.USER_AUTH_SUCCESS, data.payload),
    );
    persistor.persist();
    history.push('/');
  } else {
    yield put(yield call(failure, userConstants.USER_AUTH_FAILURE, data));
  }
}

function* userLogout(action) {
  const userLogoutService = async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      return error;
    }
  };
  const data = yield call(userLogoutService);
  if (data.payload.status === 'ok') {
    yield sessionService.deleteSession();
    yield sessionService.deleteUser();
    data.user = action.payload;
    yield persistor.pause();
    yield persistor.flush();
    yield persistor.purge();
    localStorage.removeItem('persist:root');
    yield put(yield call(success, userConstants.USER_LOGOUT_SUCCESS, data));
    window.location.reload();
  } else {
    yield put(yield call(failure, userConstants.USER_LOGOUT_FAILURE, data));
  }
}

export function* userAuthWatcherSaga() {
  yield takeEvery(userConstants.USER_AUTH_REQUEST, userAuthSaga);
}

export function* userAuthVerifyOtpWatcherSaga() {
  yield takeEvery(
    userConstants.USER_AUTH_OTP_VERIFY_REQUEST,
    userAuthVerifyOtp,
  );
}

export function* userLogoutWatcherSaga() {
  yield takeEvery(userConstants.USER_LOGOUT_REQUEST, userLogout);
}

function* changeGreetingFlagSaga(action) {
  yield put(
    yield call(success, userConstants.GREETINGS_FLAG_SUCCESS, action.payload),
  );
}

export function* changeGreetingFlagWatcher() {
  yield takeEvery(userConstants.GREETINGS_FLAG_REQUEST, changeGreetingFlagSaga);
}

const userFeedService = async ({ userId, feeds }) => {
  try {
    const response = await api.post('/user-feeds', { userId, feeds });
    return { response: response.data };
  } catch (error) {
    return { error };
  }
};

function* userFeedSaga(action) {
  const { response, error } = yield call(userFeedService, action.payload);
  if (response) {
    yield put(
      yield call(success, userConstants.FETCH_USER_FEED_SUCCESS, response),
    );
  } else {
    yield put(
      yield call(failure, userConstants.FETCH_USER_FEED_FAILURE, error),
    );
    yield delay(3000);
    userFeedSaga(action);
  }
}

export function* userFeedWatcherSaga() {
  yield takeEvery(userConstants.FETCH_USER_FEED_REQUEST, userFeedSaga);
}

const fullUserInfoService = async (userId) => {
  try {
    const response = await api.get('/user-info', { params: { userId } });
    return { response: response.data };
  } catch (error) {
    return { error };
  }
};

function* fullUserInfoSaga(action) {
  const { response, error } = yield call(fullUserInfoService, action.payload);
  if (response) {
    yield put(
      yield call(success, userConstants.FETCH_FULL_USER_INFO_SUCCESS, response),
    );
  } else {
    yield put(
      yield call(failure, userConstants.FETCH_FULL_USER_INFO_FAILURE, error),
    );
  }
}

export function* fullUserInfoWatcherSaga() {
  yield takeEvery(userConstants.FETCH_FULL_USER_INFO_REQUEST, fullUserInfoSaga);
}

const searchExactUserService = async (username) => {
  try {
    const response = await api.get('/search-exact', { params: { username } });
    return { response: response.data };
  } catch (error) {
    return { error };
  }
};

function* searchExactUserSaga(action) {
  const { response, error } = yield call(searchExactUserService, action.payload);
  if (response) {
    yield put(
      yield call(success, userConstants.SEARCH_EXACT_USER_SUCCESS, response),
    );
  } else {
    yield put(
      yield call(failure, userConstants.SEARCH_EXACT_USER_FAILURE, error),
    );
  }
}

export function* searchExactUserWatcherSaga() {
  yield takeEvery(userConstants.SEARCH_EXACT_USER_REQUEST, searchExactUserSaga);
}
