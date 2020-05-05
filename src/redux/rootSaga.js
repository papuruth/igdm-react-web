import { all } from 'redux-saga/effects';
import {
  userAuthWatcherSaga,
  userAuthVerifyOtpWatcherSaga,
  userLogoutWatcherSaga,
  changeGreetingFlagWatcher,
} from './user/userSaga';
import {
  chatListFetchWatcher,
  sendNewMessageWatcher,
  getSingleChatWatcher,
  getOlderMessageWatcher,
  fileUploadWatcherSaga,
  sendAudioWatcherSaga,
  showLoaderWatcherSaga,
  searchUserWatcherSaga,
  sendMarkAsReadWatcherSaga,
  muteUserWatcherSaga,
  deleteChatWatcherSaga,
  blockUnblockUserWatcherSaga,
  likeMessageWatcherSaga,
  unsendMessageWatcherSaga,
  getUnfollowersWatcherSaga,
  unfollowUserWatcherSaga,
} from './chats/chatsSaga';

export default function* rootSaga() {
  yield all([
    userAuthWatcherSaga(),
    userAuthVerifyOtpWatcherSaga(),
    changeGreetingFlagWatcher(),
    chatListFetchWatcher(),
    userLogoutWatcherSaga(),
    sendNewMessageWatcher(),
    getSingleChatWatcher(),
    getOlderMessageWatcher(),
    fileUploadWatcherSaga(),
    sendAudioWatcherSaga(),
    showLoaderWatcherSaga(),
    muteUserWatcherSaga(),
    searchUserWatcherSaga(),
    sendMarkAsReadWatcherSaga(),
    deleteChatWatcherSaga(),
    blockUnblockUserWatcherSaga(),
    likeMessageWatcherSaga(),
    unsendMessageWatcherSaga(),
    getUnfollowersWatcherSaga(),
    unfollowUserWatcherSaga(),
  ]);
}
