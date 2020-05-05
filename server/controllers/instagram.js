/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
const {
  IgApiClient,
  IgCheckpointError,
  IgLoginTwoFactorRequiredError,
} = require('instagram-private-api');
const { readFile } = require('fs');
const { promisify } = require('util');
const utils = require('../utils/utils');

const readFileAsync = promisify(readFile);

const igClient = new IgApiClient();

function storeLoggedInSession(username) {
  return new Promise((resolve) => {
    igClient.state.serialize().then((cookies) => {
      delete cookies.constants;
      utils.storeCookies(username, cookies);
      resolve();
    });
  });
}

function loadCookieInSession() {
  return new Promise((resolve, reject) => {
    const savedCookie = utils.getStoredCookie();
    if (savedCookie) {
      igClient.state
        .deserialize(savedCookie)
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    } else {
      reject('No session saved');
    }
  });
}

exports.hasActiveSession = function () {
  return new Promise((resolve) => {
    loadCookieInSession()
      .then((isLoaded) => {
        const userId = igClient.state.cookieUserId;
        if (isLoaded && userId) {
          igClient.user.info(userId).then((userInfo) => {
            resolve({ isLoggedIn: true, userInfo });
          });
        }
      })
      .catch(() => {
        resolve({ isLoggedIn: false });
      });
  });
};

exports.login = function (username, password) {
  return new Promise((resolve, reject) => {
    igClient.state.generateDevice(username);
    igClient.simulate.preLoginFlow().then(() => {
      igClient.account
        .login(username, password)
        .then((userData) => {
          storeLoggedInSession(username).then(() => {
            resolve(userData);
          });
        })
        .catch(reject);
    });
  });
};

exports.twoFactorLogin = function (
  username,
  code,
  twoFactorIdentifier,
  trustThisDevice,
  verificationMethod,
) {
  return new Promise((resolve, reject) => {
    igClient.account
      .twoFactorLogin({
        username,
        verificationCode: code,
        twoFactorIdentifier,
        verificationMethod,
        trustThisDevice,
      })
      .then((userData) => {
        storeLoggedInSession(username).then(() => {
          resolve(userData);
        });
      })
      .catch(reject);
  });
};

exports.logout = function () {
  return new Promise((resolve, reject) => {
    igClient.account
      .logout()
      .then((response) => {
        utils.clearCookieFiles();
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.isCheckpointError = (error) => error instanceof IgCheckpointError;

exports.isTwoFactorError = (error) =>
  error instanceof IgLoginTwoFactorRequiredError;

exports.startCheckpoint = () =>
  new Promise((resolve) => {
    igClient.challenge.auto(true).then(() => {
      resolve(igClient.challenge);
    });
  });

exports.getChatList = function () {
  const chatsFeed = igClient.feed.directInbox();
  return new Promise((resolve, reject) => {
    chatsFeed
      .items()
      .then(resolve)
      .catch((error) => {
        console.log(reject);
      });
  });
};

exports.getChat = function (chatId) {
  const thread = igClient.entity.directThread();
  return new Promise((resolve, reject) => {
    const threadF = igClient.feed.directThread(thread);
    threadF.cursor = undefined;
    threadF.id = chatId;
    threadF
      .request()
      .then((response) => resolve(response.thread))
      .catch(reject);
  });
};

let threadFeed;
exports.getOlderMessages = function (thread, chatId) {
  const needsNewThreadFeed = !thread || thread.thread_id !== chatId;
  const getOlderMessages = (thread, resolve) => {
    if (!needsNewThreadFeed && !threadFeed.isMoreAvailable()) {
      // there aren't any older messages
      resolve({ thread, messages: [] });
    } else {
      threadFeed.items().then((messages) => {
        resolve({ thread, messages });
      });
    }
  };

  return new Promise((resolve) => {
    if (needsNewThreadFeed) {
      const feed = igClient.feed.directInbox();
      feed.items().then((directChats) => {
        const thread = directChats.find((chat) => chat.thread_id === chatId);
        threadFeed = igClient.feed.directThread(thread);
        // console.log(threadFeed.isMoreAvailable());
        getOlderMessages(thread, resolve);
      });
    } else {
      getOlderMessages(thread, resolve);
    }
  });
};

exports.deleteChat = function (chatId) {
  return new Promise((resolve, reject) => {
    const thread = igClient.entity.directThread(chatId);
    thread.hide(chatId).then(resolve).catch(reject);
  });
};

exports.sendNewChatMessage = function (message, recipients) {
  return new Promise((resolve, reject) => {
    const directThread = igClient.entity.directThread(recipients);
    directThread.broadcastText(message).then(resolve).catch(reject);
  });
};

exports.sendMessage = function (message, chatId) {
  return new Promise((resolve, reject) => {
    const directThread = igClient.entity.directThread(chatId);
    directThread.broadcastText(message).then(resolve).catch(reject);
  });
};

exports.searchUsers = async function (search) {
  try {
    return await igClient.user.search(search);
  } catch (error) {
    return error;
  }
};

exports.uploadFile = async function (filePath, recipients, type) {
  const directThread = igClient.entity.directThread(recipients);
  const buffer = await readFileAsync(filePath);
  if (buffer) {
    let result;
    switch (type) {
      case 'photo':
        result = await directThread.broadcastPhoto({ file: buffer });
        if (result) {
          return 'Photo sent successfully';
        }
        return 'Error sending photo';
      case 'audio':
        result = await directThread.broadcastVoice({ file: buffer });
        if (result) {
          return 'Audio sent successfully';
        }
        return 'Error sending audio';
      default:
        return `Error sending ${type}`;
    }
  }
  return "Error reading the file, might be file is corrupted or doesn't exist";
};

exports.seen = function (thread) {
  const { thread_id } = thread;
  const { item_id } = thread.items[0];
  const directThread = igClient.entity.directThread(thread_id);
  directThread.markItemSeen(item_id);
};

exports.getUnfollowers = function () {
  return new Promise((resolve, reject) => {
    const followers = [];
    const following = [];

    const compare = () => {
      const hashedFollowers = {};
      followers.forEach((user) => {
        hashedFollowers[user.pk] = true;
        return hashedFollowers;
      });

      const unfollowers = following.filter((user) => !hashedFollowers[user.pk]);
      resolve(unfollowers);
    };

    const getUsers = (newUsers, allUsers, usersGetter, otherUsersGetter) => {
      newUsers.forEach((user) => allUsers.push(user));
      // moreAvailable maybe null. We are dodging that.
      if (
        usersGetter.moreAvailable === false &&
        otherUsersGetter.moreAvailable === false
      ) {
        compare();
      } else if (usersGetter.moreAvailable !== false) {
        usersGetter
          .items()
          .then((users) =>
            getUsers(users, allUsers, usersGetter, otherUsersGetter),
          )
          .catch(reject);
      }
    };

    const followersGetter = igClient.feed.accountFollowers();
    const followingGetter = igClient.feed.accountFollowing();

    getUsers([], followers, followersGetter, followingGetter);
    getUsers([], following, followingGetter, followersGetter);
  });
};

exports.unfollow = function (userId) {
  return new Promise((resolve, reject) => {
    igClient.friendship.destroy(userId).then(resolve).catch(reject);
  });
};

exports.getUser = function (userId) {
  return new Promise((resolve, reject) => {
    igClient.user.info(userId).then(resolve).catch(reject);
  });
};

exports.getPresence = function () {
  return new Promise((resolve, reject) => {
    igClient.direct.getPresence().then(resolve).catch(reject);
  });
};

exports.muteUser = (thread) => {
  const { thread_id, muted } = thread;
  const directThread = igClient.entity.directThread(thread_id);
  return new Promise((resolve, reject) => {
    if (!muted) {
      directThread
        .mute()
        .then(() => resolve({ muted: true }))
        .catch((error) => reject(error));
    } else {
      directThread
        .unmute()
        .then(() => resolve({ muted: false }))
        .catch((error) => reject(error));
    }
  });
};

exports.blockUnblockUser = (userId, action) => {
  return new Promise((resolve, reject) => {
    if (action === 'block') {
      igClient.friendship
        .block(userId)
        .then(() => resolve({ blocked: true }))
        .catch((error) => reject(error));
    } else {
      igClient.friendship
        .unblock(userId)
        .then(() => resolve({ blocked: false }))
        .catch((error) => reject(error));
    }
  });
};

exports.unsend = function (chatId, messageId) {
  return new Promise((resolve, reject) => {
    igClient.directThread
      .deleteItem(chatId, messageId)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

exports.like = function (chatId, messageId) {
  return new Promise((resolve, reject) => {
    igClient.directThread
      .deleteItem(chatId, messageId)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};
