const express = require('express');
const userController = require('../controllers/user');
const chatController = require('../controllers/chats');
const fileUploadController = require('../controllers/fileUploader');

const router = express.Router();

/* GET home page. */
router.post('/login', userController.authenticate);
router.post('/verifyotp', userController.handleTwoFactor);
router.post('/logout', userController.logout);
router.get('/chatlist', chatController.getChatList);
router.post('/send-message', chatController.sendNewMessage);
router.get('/get-single-chat', chatController.getSingleChat);
router.post('/getoldmessages', chatController.getOlderMessage);
router.post('/uploadfile', fileUploadController.fileUploader);
router.post('/sendaudio', fileUploadController.sendAudio);
router.get('/searchuser', chatController.searchUser);
router.post('/markasread', chatController.markAsRead);
router.post('/muteuser', chatController.muteUser);
router.post('/blockunblockuser', chatController.blockUnblockUser);
router.post('/deletechat', chatController.deleteChat);
router.post('/unsendmessage', chatController.unsendMessage);
router.get('/getunfollowers', chatController.getUnfollowers);
router.post('/unfollow', chatController.unfollowUser);

module.exports = router;
