import { userConstants } from './userConstants';

export function userAuthRequest(username, password) {
  return {
    type: userConstants.USER_AUTH_REQUEST,
    payload: {
      username,
      password,
    },
  };
}

export function userAuthVerifyOtp(otpDetails) {
  return {
    type: userConstants.USER_AUTH_OTP_VERIFY_REQUEST,
    payload: otpDetails,
  };
}

export function userLogout(user) {
  return {
    type: userConstants.USER_LOGOUT_REQUEST,
    payload: user,
  };
}

export function changeGreetingFlagAction(flag) {
  return {
    type: userConstants.GREETINGS_FLAG_REQUEST,
    payload: flag,
  };
}
