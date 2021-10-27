import express from 'express';
const router = express.Router();

import {addUser, findUserById, findUserKeyValue, loginUser, logout, verifyCookie, addFriend} from '../controller/userController.js'
import { createEmptyRoom, inviteFriend } from '../controller/roomController.js';

import {userValidationRules, userValidationErrorHandling} from '../middleware/validation.js'
import auth from '../middleware/authentication.js'
import {isEmail, prepareInput} from '../middleware/searchInput.js';

router.route('/signin').post(userValidationRules(), userValidationErrorHandling, addUser)
router.route('/login').post(loginUser)
router.route('/auth').post(auth, verifyCookie)
router.route('/find').post(findUserById)
router.route('/logout').get(logout)

//Add friend to friends array, works in both directions
router.route('/:id/addfriend').post(addFriend)

//Perform a search for a user with an open input field can be email or username
router.route('/:id/findfriend').post(auth, isEmail(), prepareInput, findUserKeyValue)


//**** Room Controller ****
//create a empty room (done by a user)
router.route('/:id/newroom').post(createEmptyRoom)

//invite other person to a room
router.route('/:id/:roomId').post(inviteFriend)


//***Message Controller */

export default router