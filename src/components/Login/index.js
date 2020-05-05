/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import { userAuthRequest, userAuthVerifyOtp } from '@/redux/user/userAction';
import React from 'react';
import Toast from '@/utils/toast';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false,
      errorType: '',
      errorPayload: '',
      otp: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.errorType !== state.errorType) {
      return {
        errorType: props.errorType,
        errorPayload: props.errorPayload,
      };
    }
    return null;
  }

  componentDidMount() {
    const { logoutStatus } = this.props;
    if (logoutStatus) {
      Toast.info(`Hello, ${logoutStatus.user}! You have been logged out.`);
      Toast.warning('Session Deleted Successfully!!!');
    }
  }

  handleUserInput = (event) => {
    const { name, value } = event.currentTarget;
    this.setState({
      [name]: value,
    });
  };

  login = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const { dispatch } = this.props;
    if (username && password) {
      dispatch(userAuthRequest(username, password));
      const button = document.querySelector('button[type=submit]');
      button.innerText = 'Logging In...';
      button.classList.add('loggingIn', 'disabled');
      this.setState({
        error: false,
      });
    } else {
      this.setState({
        error: true,
      });
    }
  };

  verifyOtp = (event) => {
    event.preventDefault();
    const { otp, errorPayload } = this.state;
    const otpDetails = { ...errorPayload, otp };
    const { dispatch } = this.props;
    dispatch(userAuthVerifyOtp(otpDetails));
  };

  render() {
    const {
      username,
      password,
      error,
      errorType,
      otp,
      errorPayload,
    } = this.state;
    if (errorType) {
      const button = document.querySelector('button[type=submit]');
      button.innerText = 'Logging In...';
      button.classList.remove('loggingIn', 'disabled');
    }
    return (
      <div className="container">
        {errorType !== 'isTwoFactorError' ? (
          <form className="pageCard mx-auto p-4 p-sm-5" onSubmit={this.login}>
            <div className="clearfix welcomeBox">
              <img
                className="brand d-block float-none mx-auto"
                src="img/icon.png"
                alt=""
                width="64px"
              />
              <h2 className="text-center title">Welcome</h2>
              <span className="d-block text-center">
                Login with your Instagram credentials
              </span>
            </div>
            <div className="input-group loginInputs mt-4">
              <input
                className="form-control username"
                type="text"
                name="username"
                value={username}
                onChange={this.handleUserInput}
                placeholder="Username"
              />
              <input
                className="form-control password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleUserInput}
                placeholder="Password"
              />
            </div>
            <button className="loginButton mt-3 btn btn-primary" type="submit">
              Login to Instagram
            </button>
            {errorType === 'loginError' ? (
              <span className="d-block errorMessage text-center mt-3">
                {errorPayload}
              </span>
            ) : null}
            <div className="disclaimer mt-5 text-center">
              {error && (
                <p style={{ color: 'red' }}>All fields are required.</p>
              )}
              <p>
                This app is not affiliated with Instagram. You can visit the
                open source project
                {' '}
                <a href="#">here.</a>
              </p>
              <p>We don&apos;t store your password.</p>
            </div>
          </form>
        ) : (
          <form
            className="pageCard mx-auto p-4 p-sm-5"
            onSubmit={this.verifyOtp}
          >
            <div className="disclaimer text-center">
              <p>TwoFactor Authentication Enabled</p>
              <p>Please enter OPT received on phone.</p>
            </div>
            <div className="clearfix welcomeBox">
              <img
                className="brand d-block float-none mx-auto"
                src="img/icon.png"
                alt=""
                width="64px"
              />
            </div>
            <div className="input-group loginInputs mt-4">
              <input
                className="form-control otp"
                type="text"
                name="otp"
                value={otp}
                onChange={this.handleUserInput}
                placeholder="OTP"
              />
            </div>
            <button
              className="loginButton mt-3 btn btn-primary"
              type="submit"
              disabled={!otp}
            >
              Submit
            </button>
            <span
              className="d-block errorMessage text-center mt-3"
              id="error"
            />
          </form>
        )}
      </div>
    );
  }
}
