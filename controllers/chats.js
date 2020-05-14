/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const { IgResponseError } = require('instagram-private-api');
const instagram = require('./instagram');

exports.getChatList = function getChatList(req, res) {
  instagram
    .getChatList()
    .then((chats) => {
      instagram
        .getPresence()
        .then((presenceInfo) => {
          for (const chat in chats) {
            if (
              chats[chat].users.length === 1
              && Object.prototype.hasOwnProperty.call(
                presenceInfo.user_presence,
                chats[chat].users[0].pk,
              )
            ) {
              chats[chat].presence = presenceInfo.user_presence[chats[chat].users[0].pk];
            }
          }
          res.send({
            type: 'chatListResponse',
            payload: chats,
          });
        })
        .catch((error) =>
          res.send({
            type: 'chatListError',
            error,
          }));
    })
    .catch((error) =>
      res.send({
        type: 'chatListError',
        error,
      }));
};

exports.sendNewMessage = (req, res) => {
  const { message } = req.body;
  const {
    isNewChat, text, users, chatId,
  } = message;
  try {
    if (isNewChat) {
      instagram
        .sendNewChatMessage(text, [users])
        .then((chat) => {
          res.status(200).send(chat);
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    } else {
      instagram
        .sendMessage(text, chatId)
        .then(() => {
          res.send({
            type: 'sendNewMessageResponse',
            payload: 'ok',
          });
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getSingleChat = (req, res) => {
  const { chatId } = req.query;
  instagram
    .getChat(chatId)
    .then((chat) => {
      instagram.getPresence().then((presenceInfo) => {
        chat.presence = presenceInfo.user_presence[chat.users[0].pk];
        res.send({
          type: 'getSingleChatResponse',
          payload: chat,
        });
      });
    })
    .catch((error) => {
      res.send({
        type: 'getSingleChatError',
        errorPayload: error || 'Error fetching chat',
      });
    });
};

exports.getOlderMessage = (req, res) => {
  const { chatId, thread } = req.body;
  instagram
    .getOlderMessages(thread, chatId)
    .then((data) => {
      res.send({
        type: 'oldMessageResponse',
        payload: {
          chatId,
          messages: data.messages,
          messagesThread: data.thread,
        },
      });
    })
    .catch((error) => {
      res.send({
        type: 'oldMessageError',
        error,
      });
    });
};

exports.searchUser = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await instagram.searchUsers(query);
    if (response instanceof IgResponseError) {
      res.status(200).send({
        type: 'searchUserResponse',
        payload: [],
      });
    } else {
      res.status(200).send({
        type: 'searchUserResponse',
        payload: response.users,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { thread } = req.body;
    instagram.seen(thread);
    res.status(200).send(true);
  } catch (error) {
    res.status(400).send('Bad request');
  }
};

exports.muteUser = async (req, res) => {
  const { thread } = req.body;
  const chatId = thread.thread_id;
  try {
    if (!thread) {
      throw new Error('Thread is required');
    } else {
      const response = await instagram.muteUser(thread);
      if (response) {
        instagram.getChat(chatId).then((chat) => {
          instagram.getPresence().then((presenceInfo) => {
            chat.presence = presenceInfo.user_presence[chat.users[0].pk];
            res.status(200).send({
              isMuted: response,
              newChatData: chat,
            });
          });
        });
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.blockUnblockUser = async (req, res) => {
  const { userId, action } = req.body;
  try {
    const response = await instagram.blockUnblockUser(userId, action);
    if (response) {
      res.status(200).send({
        isUserBlocked: response,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.body;
  try {
    const response = await instagram.deleteChat(chatId);
    if (response) {
      res.status(200).send({
        isChatDeleted: response,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.unsendMessage = async (req, res) => {
  const { chatId, msgId } = req.body;
  try {
    const response = await instagram.unsend(chatId, msgId);
    if (response) {
      res.status(200).send({
        msgDeleted: response,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getUnfollowers = async (_req, res) => {
  try {
    const response = await instagram.getUnfollowers();
    if (response) {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.unfollowUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const response = await instagram.unfollow(userId);
    if (response) {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.timeline = async (req, res) => {
  try {
    const response = await instagram.timeline();
    const { more_available, feed_items } = response;
    res.status(200).send({
      hasMore: more_available,
      timelines: feed_items,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
