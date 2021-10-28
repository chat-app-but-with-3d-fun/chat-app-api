import express from 'express';
import {
  createEmptyRoom,
  inviteFriend
} from '../controller/roomController.js';
import auth from '../middleware/authentication.js'


const router = express.Router();

//**** Room Controller ****

//create a empty room (done by a user)
router.route('/newroom')
  .post(auth,createEmptyRoom)

//invite other person to a room
router.route('/:roomId/adduser/:friendId')
  .get(auth,inviteFriend)

export default router