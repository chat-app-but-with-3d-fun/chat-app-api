import express from 'express';
import {
  createEmptyRoom,
  inviteFriend,
  getRoomInfo
} from '../controller/roomController.js';
import auth from '../middleware/authentication.js'


const router = express.Router();

//**** Room Controller ****

router.route('/getroom')
  .post(auth, getRoomInfo)

//create a empty room (done by a user)
router.route('/newroom')
  .post(auth,createEmptyRoom)

//invite other person to a room
router.route('/:roomId/adduser/:friendId')
  .post(auth,inviteFriend)

export default router