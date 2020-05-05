/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import ChatBox from '@/containers/ChatBox';
import {
  fetchChatListAction,
  fileUploadAction,
  getSingleChatAction,
  sendAudioAction,
  sendMessageAction,
  showLoaderAction,
  searchUser,
  getUnfollowersAction,
} from '@/redux/chats/chatsAction';
import { changeGreetingFlagAction, userLogout } from '@/redux/user/userAction';
import Toast from '@/utils/toast';
import { Avatar, Button } from '@material-ui/core';
import {
  CameraAlt,
  Close,
  InsertEmoticon,
  Mic,
  Pause,
  PlayArrow,
  Send,
  Stop,
  AccountCircle,
} from '@material-ui/icons';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import { emojiIndex, Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import React from 'react';
import AudioAnalyser from 'react-audio-analyser';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  isActive,
  markAsRead,
  scrollToChatBottom,
  setActive,
} from './helperFunctions';
import RenderUserList from './renderUserList';
import {
  imageUploadCssLoader,
  renderUserListLoader,
  StyledContainer,
} from './styles';
import RenderSearchResult from './renderSearchResult';
import { renderMessage, renderUnfollowers } from './rendererFunction';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      user: '',
      renderChatFlag: false,
      singleChat: '',
      chatsList: [],
      searchText: '',
      searchUserResult: [],
      status: null,
      recordingStatus: null,
      audioSrc: null,
      messageText: '',
      unfollowers: [],
    };
    const { dispatch } = props;
    dispatch(fetchChatListAction());
    window.loggedInUserId = props.user.pk;
  }

  static getDerivedStateFromProps(props, state) {
    const {
      user,
      authenticated,
      chatsList,
      getSingleChat,
      olderMessages,
      searchUserResult,
      unfollowers,
    } = props;
    if (user !== state.user) {
      return {
        user,
      };
    }

    if (authenticated !== state.authenticated) {
      return {
        authenticated,
      };
    }

    if (chatsList !== state.chatsList) {
      return {
        chatsList,
      };
    }
    if (olderMessages) {
      if (
        Object.keys(state.singleChat).length &&
        state.singleChat.items.length !== olderMessages.items.length
      ) {
        const doc = document.querySelector('.messages');
        doc.scrollBy(0, 200);
        olderMessages.presence = state.singleChat.presence;
        return {
          singleChat: olderMessages,
          renderChatFlag: true,
        };
      }
    }
    if (getSingleChat !== state.singleChat && !olderMessages) {
      return {
        singleChat: getSingleChat,
        renderChatFlag: true,
      };
    }
    if (searchUserResult !== state.searchUserResult) {
      return {
        searchUserResult,
      };
    }
    if (unfollowers !== state.unfollowers) {
      return {
        unfollowers,
      };
    }
    return null;
  }

  componentDidMount() {
    setTimeout(() => {
      const { user, greetingsFlag, dispatch } = this.props;
      if (greetingsFlag) {
        Toast.success(
          `Hello, ${
            user.full_name || user.username
          }! Welcome to IGDM React Web.`,
        );
        dispatch(changeGreetingFlagAction(false));
      }
    }, 0);
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      imageUploadLoader,
      audioUploadLoader,
      dispatch,
      getSingleChat,
      audioSentStatus,
      fileUploadStatus,
      chatLoader,
      searchUserResult,
      searchUserLoader,
      unfollowers,
    } = this.props;
    if (audioSentStatus !== prevProps.audioSentStatus && audioUploadLoader) {
      Toast.success('Recording sent successfully');
      dispatch(showLoaderAction(false, 'audioUploadLoader'));
    }
    if (fileUploadStatus !== prevProps.fileUploadStatus && imageUploadLoader) {
      Toast.success('Photo sent successfully');
      dispatch(showLoaderAction(false, 'imageUploadLoader'));
    }
    if (
      getSingleChat.thread_id !== prevProps.getSingleChat.thread_id ||
      (getSingleChat.pk !== prevProps.getSingleChat.pk && chatLoader)
    ) {
      dispatch(showLoaderAction(false, 'chatLoader'));
    }
    if (searchUserResult !== prevProps.searchUserResult && searchUserLoader) {
      dispatch(showLoaderAction(false, 'searchUserLoader'));
    }
    if(unfollowers !== prevProps.unfollowers) {
      renderUnfollowers(unfollowers, dispatch);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleUserInput = (event) => {
    const { value, name } = event.target;
    this.setState(
      {
        [name]: value,
      },
      () => name === 'searchText' && this.handleUserSearch(value),
    );
  };

  handleUserSearch = (value) => {
    const { dispatch } = this.props;
    if (value.trim() === '' || value.trim().length > 0) {
      dispatch(showLoaderAction(true, 'searchUserLoader'));
      dispatch(searchUser(value.trim()));
      // Toast.info('Searching for user started, please wait!');
    }
  };

  handleKeyPress = (event) => {
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault();
      this.sendMessage();
    }
    if (event.keyCode === 65 && event.ctrlKey) {
      event.preventDefault();
      event.target.select();
    }
  };

  handleClickOutside = (event) => {
    if (
      this.emojiRef.previousSibling !== event.target.parentElement &&
      !this.emojiRef.contains(event.target) &&
      this.emojiToggleBtnRef !== event.target.parentElement
    ) {
      this.emojiRef.classList.add('hide');
    }
  };

  addEmoji = (emojiObj) => {
    const emoji = emojiObj.native;
    this.setState((state) => ({
      messageText: state.messageText + emoji,
    }));
  };

  sendMessage = () => {
    const { dispatch } = this.props;
    const { singleChat, messageText } = this.state;
    const isNewChat = !singleChat.thread_id;
    const chatId = singleChat.thread_id;
    const users = singleChat.pk;
    const messageObj = {
      isNewChat,
      text: messageText,
      timestamp: new Date().getTime(),
      users,
      chatId,
    };

    if (messageObj) {
      dispatch(sendMessageAction(messageObj));
      // Rendering current text
      const div = renderMessage(messageText, 'outward');
      const msgContainer = document.querySelector('.chat .messages');
      msgContainer.appendChild(div);
      scrollToChatBottom();
    }
    this.setState({
      messageText: '',
    });
  };

  renderChat = (chat_) => {
    const { dispatch } = this.props;
    const getSingleChaRequestPayload = {
      isNewChat: !chat_.thread_id,
      chatId: chat_.thread_id || chat_.pk,
      chatData: chat_,
    };
    dispatch(showLoaderAction(true, 'chatLoader'));
    const li = document.getElementById(
      `chatlist-${chat_.thread_id || chat_.pk}`,
    );
    if (isActive(chat_)) setActive(li);
    setActive(li);
    if (chat_.thread_id) {
      markAsRead(chat_.thread_id, li);
      dispatch(getSingleChatAction(getSingleChaRequestPayload));
    } else {
      dispatch(getSingleChatAction(getSingleChaRequestPayload));
    }
    window.currentChatId = chat_.pk || chat_.thread_id;
  };

  closeModalViewer = (event) => {
    event.preventDefault();
    const viewer = document.querySelector('.viewer');
    viewer.classList.remove('active');
  };

  logout = () => {
    const { dispatch, user } = this.props;
    dispatch(userLogout(user.full_name || user.username));
    dispatch(changeGreetingFlagAction(false));
  };

  sendFile = () => {
    this.sendFileRef.click();
  };

  handleImageUpload = (event) => {
    const { dispatch } = this.props;
    const file = event.currentTarget.files[0];
    if (file) {
      const data = new FormData();
      data.append('file', file);
      data.append('recepients', window.currentChatId);
      data.append('isNewChat', !window.currentChatId);
      data.append('chatId', window.currentChatId);
      dispatch(showLoaderAction(true, 'imageUploadLoader'));
      dispatch(fileUploadAction(data));
      Toast.info('Photo is being uploaded!😁');
    }
  };

  resetImageUpload = () => {
    this.sendFileRef.value = '';
  };

  showProfile = () => {
    document.getElementById('profiledropdown').classList =
      'dropdown-menu active';
  };

  showEmojiPane = (event) => {
    event.preventDefault();
    if (this.emojiRef.classList.value === 'emojis hide') {
      this.emojiRef.classList.remove('hide');
    } else {
      this.emojiRef.classList.add('hide');
    }
  };

  hideProfile = () => {
    document.getElementById('profiledropdown').classList = 'dropdown-menu';
  };

  controlAudio = (status) => {
    this.setState(
      {
        status,
      },
      () => {
        if (status === 'inactive') {
          if (this.state.audioRecordEvent) {
            this.state.audioRecordEvent.currentTarget.stream
              .getTracks()[0]
              .stop();
          }
        }
      },
    );
  };

  toggleRecording = (event) => {
    event.preventDefault();
    this.setState((state) => ({
      recordingStatus: !state.recordingStatus,
      recordComplete: false,
      audioSrc: null,
    }));
  };

  sendAudio = (event) => {
    event.preventDefault();
    const { audioSrc, singleChat } = this.state;
    const { dispatch } = this.props;
    if (audioSrc && singleChat) {
      const recepient = singleChat.thread_id;
      const audioObj = new FormData();
      audioObj.append('file', audioSrc);
      audioObj.append('recepient', recepient);
      dispatch(showLoaderAction(true, 'audioUploadLoader'));
      dispatch(sendAudioAction(audioObj));
      Toast.info('Audio is being uploaded!😁');
    } else {
      this.setState({
        status: null,
        recordComplete: false,
        recordingStatus: true,
        audioSrc: null,
      });
    }
  };

  handleNonFollowers = () => {
    const { dispatch } = this.props;
    dispatch(getUnfollowersAction());
    renderUnfollowers('loading');
  };

  render() {
    const {
      renderChatFlag,
      chatsList,
      user,
      singleChat,
      audioSrc,
      status,
      recordingStatus,
      recordComplete,
      searchText,
      messageText,
    } = this.state;
    const {
      dispatch,
      imageUploadLoader,
      audioUploadLoader,
      chatLoader,
      searchUserResult,
      searchUserLoader,
    } = this.props;
    const audioProps = {
      audioType: 'audio/wav', // Temporarily only supported audio/wav, default audio/webm
      status, // Triggering component updates by changing status
      audioSrc,
      startCallback: (e) => {
        this.setState({
          audioRecordEvent: e,
        });
      },
      pauseCallback: (e) => {},
      stopCallback: (e) => {
        this.setState({
          audioSrc: e,
          recordComplete: true,
        });
      },
    };
    const isBlocked =
      Object.keys(singleChat).length && singleChat.users
        ? singleChat.users[0].friendship_status.blocking
        : false;
    if (isBlocked) {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
    return (
      <StyledContainer>
        <div className="container_fluid app">
          <div className="header d-flex p-3">
            <Avatar
              onMouseEnter={this.showProfile}
              className="settings"
              src={user ? user.profile_pic_url : <AccountCircle />}
              alt={user.username}
            />
            <div
              className="dropdown-menu"
              onMouseLeave={this.hideProfile}
              id="profiledropdown"
            >
              <div
                className="dropdown-item"
                id="seen-flagger"
                title="You'd know when recipients read your message, but they won't know when you read theirs"
              >
                Don&apos;t send &apos;Seen&apos; receipts
              </div>
              <div
                className="dropdown-item"
                id="unfollowers"
                role="button"
                tabIndex={0}
                onClick={this.handleNonFollowers}
              >
                Users not following back
              </div>
              <div
                className="dropdown-item"
                id="logout"
                onClick={this.logout}
                role="button"
                tabIndex={0}
                onKeyPress={this.logout}
              >
                Log out
              </div>
            </div>
            <div className="search-header col-md-auto">
              <input
                className="form-control"
                type="text"
                onChange={this.handleUserInput}
                value={searchText}
                name="searchText"
                placeholder="Search Instagram users"
              />
            </div>
          </div>
          <div className="appBody">
            <div className="chat-list col-4">
              <div className="listStrapper row">
                <ul>
                  {!searchText && chatsList.length > 0 ? (
                    <RenderUserList
                      dispatch={dispatch}
                      chatList={chatsList}
                      renderChat={this.renderChat}
                    />
                  ) : (
                    !searchUserLoader && (
                      <RenderSearchResult
                        dispatch={dispatch}
                        usersList={searchUserResult}
                        renderChat={this.renderChat}
                      />
                    )
                  )}
                  {(searchText || !chatsList.length) &&
                    (!searchUserResult.length || searchUserLoader) && (
                      <ClipLoader
                        css={renderUserListLoader}
                        size={70}
                        color="#123abc"
                        loading
                      />
                    )}
                </ul>
              </div>
            </div>
            <div className="chat col-8">
              {chatLoader ? (
                <div className="messages row p-3 pt-5">
                  <ClipLoader
                    css={imageUploadCssLoader}
                    size={70}
                    color="#123abc"
                    loading={chatLoader}
                  />
                </div>
              ) : renderChatFlag && Object.keys(singleChat).length > 0 ? (
                <ChatBox
                  chatData={singleChat}
                  key={window.currentChatId}
                  dispatch={dispatch}
                />
              ) : (
                <div className="messages row p-3 pt-5">
                  <div className="center cover">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/icon.png`}
                      width="300px"
                      alt=""
                    />
                    <p className="italic">Search and select a chat to start.</p>
                  </div>
                </div>
              )}
              <ClipLoader
                css={imageUploadCssLoader}
                size={70}
                color="#123abc"
                loading={imageUploadLoader || audioUploadLoader}
              />
              {!isBlocked && (
                <div className="messageBox row p-3">
                  <div className="new-message">
                    <form>
                      {!recordingStatus ? (
                        <ReactTextareaAutocomplete
                          name="messageText"
                          maxLength="1000"
                          id="messageText"
                          ref={(textInput) => {
                            this.textInputRef = textInput;
                          }}
                          disabled={!renderChatFlag}
                          loadingComponent={() => <span>Loading</span>}
                          value={messageText}
                          onChange={this.handleUserInput}
                          onKeyDown={this.handleKeyPress}
                          placeholder="Message..."
                          trigger={{
                            ':': {
                              dataProvider: (token) =>
                                emojiIndex.search(token).map((o) => ({
                                  colons: o.colons,
                                  native: o.native,
                                })),
                              component: ({ entity: { native, colons } }) => (
                                <div>{`${colons} ${native}`}</div>
                              ),
                              output: (item) => `${item.native}`,
                            },
                          }}
                        />
                      ) : recordComplete ? (
                        <div>
                          <audio
                            src={window.URL.createObjectURL(audioSrc)}
                            controls
                          />
                          <button
                            className="send-audio"
                            type="submit"
                            onClick={this.toggleRecording}
                            disabled={!renderChatFlag}
                          >
                            <Send title="Send audio" onClick={this.sendAudio} />
                          </button>
                        </div>
                      ) : (
                        <AudioAnalyser {...audioProps}>
                          <div className="btn-box">
                            {status !== 'recording' && (
                              <PlayArrow
                                className="iconfont icon-start"
                                title="STart Recording"
                                onClick={() => this.controlAudio('recording')}
                              />
                            )}
                            {status === 'recording' && (
                              <Pause
                                className="iconfont icon-pause"
                                title="Pause Recording"
                                onClick={() => this.controlAudio('paused')}
                              />
                            )}
                            <Stop
                              className="iconfont icon-stop"
                              title="Stop Recording"
                              onClick={() => this.controlAudio('inactive')}
                            />
                          </div>
                        </AudioAnalyser>
                      )}
                    </form>
                  </div>
                  {!recordingStatus ? (
                    <button
                      className="record-audio"
                      type="submit"
                      onClick={this.toggleRecording}
                      disabled={!renderChatFlag}
                    >
                      <Mic title="Record" />
                    </button>
                  ) : (
                    <button
                      className="record-audio"
                      type="submit"
                      onClick={this.toggleRecording}
                      disabled={!renderChatFlag}
                    >
                      <Close title="Close Record" />
                    </button>
                  )}
                  <button
                    className="send-attachment"
                    type="submit"
                    onClick={this.sendFile}
                    disabled={!renderChatFlag}
                  >
                    <CameraAlt />
                  </button>
                  <input
                    ref={(file) => {
                      this.sendFileRef = file;
                    }}
                    onChange={this.handleImageUpload}
                    onClick={this.resetImageUpload}
                    className="file-input hide"
                    type="file"
                    accept="image/jpeg,image/jpg"
                  />
                  <button
                    className="open-emoji"
                    type="submit"
                    ref={(emojiToggleBtn) => {
                      this.emojiToggleBtnRef = emojiToggleBtn;
                    }}
                    onClick={this.showEmojiPane}
                    disabled={!renderChatFlag}
                  >
                    <InsertEmoticon />
                  </button>
                  <div
                    className="emojis hide"
                    ref={(emoji) => {
                      this.emojiRef = emoji;
                    }}
                  >
                    <div className="emojis-body">
                      <Picker
                        set="facebook"
                        theme="dark"
                        emojiTooltip
                        title="React IGDM Emojis"
                        onSelect={this.addEmoji}
                      />
                    </div>
                  </div>
                </div>
              )}
              {isBlocked && (
                <div className="blockedWrapper row p-3">
                  <div className="blockedContent">
                    You blocked {singleChat.thread_title}.{' '}
                    <Button color="primary" onClick={this.deleteChat}>
                      Delete Chat.
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="viewer">
          <button
            className="close"
            onKeyPress={this.closeModalViewer}
            onClick={this.closeModalViewer}
            type="submit"
          >
            <img
              width="25px"
              src={`${process.env.PUBLIC_URL}/assets/images/close.png`}
              alt="close icon"
            />
          </button>
          <div className="viewer_content" />
        </div>
      </StyledContainer>
    );
  }
}

export default Home;
