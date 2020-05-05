import { connect } from 'react-redux';
import Home from '../../components/Home';

const mapStateToProps = (state) => {
  const { user, authenticated } = state.session;
  const { greetingsFlag } = state.userReducer;
  const {
    chatsList,
    chatListError,
    getSingleChat,
    getSingleChatError,
    sentMessageSuccessStatus,
    olderMessages,
    fileUploadStatus,
    audioSentStatus,
    audioSentError,
    showLoader,
    searchUserResult,
    chatLoader,
    imageUploadLoader,
    audioUploadLoader,
    searchUserLoader,
    unfollowers,
  } = state.chatReducer;
  return {
    user,
    authenticated,
    chatsList: chatsList || [],
    chatListError,
    getSingleChat: getSingleChat || {},
    getSingleChatError,
    sentMessageSuccessStatus,
    olderMessages,
    greetingsFlag,
    chatLoader: chatLoader || false,
    searchUserResult: searchUserResult || [],
    fileUploadStatus: fileUploadStatus || false,
    audioSentStatus: audioSentStatus || false,
    showLoader: showLoader || false,
    audioSentError,
    imageUploadLoader: imageUploadLoader || false,
    audioUploadLoader: audioUploadLoader || false,
    searchUserLoader: searchUserLoader || false,
    unfollowers,
  };
};

const connectedHome = connect(mapStateToProps)(Home);

export default connectedHome;
