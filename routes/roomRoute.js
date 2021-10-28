import express from 'express';
import {
  createEmptyRoom,
  inviteFriend
} from '../controller/roomController.js';

const router = express.Router();

//**** Room Controller ****

//create a empty room (done by a user)
router.route('/:id/newroom')
  .post(createEmptyRoom)

//invite other person to a room
router.route('/:id/:roomId')
  .post(inviteFriend)

export default router