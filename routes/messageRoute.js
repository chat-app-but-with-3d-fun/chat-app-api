import express from 'express';

import { createMessage, getMessages } from '../controller/messageController.js';
import auth from '../middleware/authentication.js'


const router = express.Router();


router.route('/newmsg').post(createMessage)
router.route('/getmsg').post(getMessages)

export default router