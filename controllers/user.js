/* eslint-disable no-shadow */

const { IgPrivateUserError } = require('instagram-private-api');
const fs = require('fs');
const instagram = require('./instagram');
const fileUploader = require('./fileUploader');

exports.authenticate = (req, res) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.send('loginError', 'Please enter all required fields');
  }

  const getErrorMsg = (error) =>
    error.text || error.message || 'An unknown error occurred.';

  instagram
    .login(username, password)
    .then(({ pk }) => {
      res.send({
        type: 'authResponse',
        payload: pk,
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
    .then((user) => {
      console.log('verify-otp res', user);
      res.send({
        type: 'authResponse',
        payload: user.pk,
      });
    })
    .catch((error) => {
      res.send({
        type: 'otpError',
        error,
      });
    });
};

let challenge;
exports.startCheckpoint = async (req, res) => {
  try {
    const response = await instagram.startCheckpoint();
    challenge = response;
    res.status(200).send({
      type: 'authResponse',
      isCheckpoint: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.handleCheckpoint = async (req, res) => {
  const { otp } = req.body;
  try {
    const response = await challenge.sendSecurityCode(otp);
    if (response) {
      res.status(200).send({
        type: 'authResponse',
        payload: response.logged_in_user.pk,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
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

exports.userFeeds = async (req, res) => {
  const { userId, feeds } = req.body;
  try {
    const response = await instagram.userFeeds(userId, feeds);
    if (response) {
      const { feeds, newFeeds } = response;
      res.status(200).send({
        feeds: Object.keys(feeds).length > 0 ? feeds : newFeeds.items[0],
        newFeeds: newFeeds.items,
        hasMore: newFeeds.more_available,
        allFeeds: feeds,
        pk: userId,
      });
    }
  } catch (error) {
    if (error instanceof IgPrivateUserError) {
      res.status(400).send(error.message);
    } else {
      res.status(400).send(error);
    }
  }
};

exports.getFullUserInfo = async (req, res) => {
  const { userId } = req.query;
  try {
    const userInfo = await instagram.getFullUserInfo(userId);
    const friendship = await instagram.getFriendShipInfo(userId);
    const highlights = await instagram.getHighlights(userId);
    const suggestedUser = userInfo.has_chaining
      ? await instagram.getsuggestedUser(userId)
      : [];
    res.status(200).send({
      userInfo,
      friendship,
      highlights,
      suggestedUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.searchExact = async (req, res) => {
  try {
    const { username } = req.query;
    const response = await instagram.searchExact(username);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateUserProfilePhoto = async (req, res) => {
  try {
    const multerResponse = await fileUploader.profilePhotoUpdater(req);
    const { file } = multerResponse;
    const { path } = file;
    const { response } = await instagram.updateUserProfilePhoto(path);
    fs.unlinkSync(path);
    res.status(200).send(response);
  } catch ({ error, filePath }) {
    fs.unlinkSync(filePath);
    res.status(400).send(error.message);
  }
};

exports.removeUserProfilePhoto = async (req, res) => {
  try {
    const response = await instagram.removeUserProfilePhoto();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const response = await instagram.getCurrentUser();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const { formData } = req.body;
    const response = await instagram.saveProfile(formData);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message:
        "You can't change your name right now because you've changed it twice within 14 days",
    });
  }
};

exports.fetchSuggestedUser = async (req, res) => {
  try {
    const response = await instagram.sendSuggestedUser();
    if (response) {
      res.status(200).send(response);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.fetchUserStories = async (req, res) => {
  try {
    const {userId} = req.query;
    const response = await instagram.fetchUserStories(userId);
    if (response) {
      res.status(200).send(response);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
