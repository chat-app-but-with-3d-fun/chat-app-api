import express from 'express';
const router = express.Router();
import { createEmptyRoom, inviteFriend } from '../controller/roomController.js';


//**** Room Controller ****
//create a empty room (done by a user)
router.route('/:id/newroom').post(createEmptyRoom)

//invite other person to a room
router.route('/:id/:roomId').post(inviteFriend)


export default router