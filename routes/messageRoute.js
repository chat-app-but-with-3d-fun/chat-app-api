import express from 'express';
import {
  createMessage,
  getMessages
} from '../controller/messageController.js';
import auth from '../middleware/authentication.js'

const router = express.Router();

router.route('/newmsg')
  .post(auth, createMessage)
router.route('/getmsg/:roomId')
  .get(auth, getMessages)

export default router