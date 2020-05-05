/* eslint-disable require-yield */
import history from '@/routes/history';
import api from '@/services/api';
import { sessionService } from 'redux-react-session';
import { call, put, takeEvery } from 'redux-saga/effects';
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
      await sessionService.saveSession(response.data.payload);
      await sessionService.saveUser(response.data.payload);
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
      await sessionService.saveSession(response.data.payload);
      await sessionService.saveUser(response.data.payload);
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
    localStorage.removeItem('persist:root');
    data.user = action.payload;
    yield put(yield call(success, userConstants.USER_LOGOUT_SUCCESS, data));
    history.push('/login');
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
