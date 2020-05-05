/* eslint-disable no-shadow */
const instagram = require('./instagram');

exports.authenticate = (req, res) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.send('loginError', 'Please enter all required fields');
  }

  function handleCheckpoint() {
    return new Promise((resolve, reject) => {
      instagram.startCheckpoint().then((challenge) => {
        challenge.sendSecurityCode(data.code).then(resolve).catch(reject);
      });
    });
  }

  const getErrorMsg = (error) => {
    return error.text || error.message || 'An unknown error occurred.';
  };

  instagram
    .login(username, password)
    .then((userInfo) => {
      res.send({
        type: 'authResponse',
        payload: userInfo,
      });
    })
    .catch((error) => {
      if (instagram.isCheckpointError(error)) {
        res.send({
          type: 'isCheckpointError',
          error,
        });
      } else if (instagram.isTwoFactorError(error)) {
        res.send({
          type: 'isTwoFactorError',
          error: error.response.body.two_factor_info,
        });
      } else {
        res.send({
          type: 'loginError',
          error: getErrorMsg(error),
        });
      }
    });
};

exports.handleTwoFactor = (req, res) => {
  const {
    username,
    otp,
    totp_two_factor_on,
    two_factor_identifier,
  } = req.body.otpDetails;
  const verificationMethod = totp_two_factor_on ? '0' : '1';
  const trustThisDevice = '1';
  instagram
    .twoFactorLogin(
      username,
      otp,
      two_factor_identifier,
      trustThisDevice,
      verificationMethod,
    )
    .then((userInfo) => {
      res.send({
        type: 'authResponse',
        payload: userInfo,
      });
    })
    .catch((error) => {
      res.send({
        type: 'otpError',
        error,
      });
    });
};

exports.logout = (req, res) => {
  instagram
    .logout()
    .then((response) => {
      res.send({
        type: 'logoutResponse',
        payload: response,
      });
    })
    .catch((error) => {
      res.send({
        type: 'errorResponse',
        payload: error,
      });
    });
};
