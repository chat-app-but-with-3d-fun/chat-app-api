import express from 'express';
import {
  addUser,
  findUserById,
  findUserKeyValue,
  loginUser,
  logout,
  verifyCookie,
  addFriend
} from '../controller/userController.js'
import {
  createEmptyRoom,
  inviteFriend
} from '../controller/roomController.js';
import {
  userValidationRules,
  userValidationErrorHandling
} from '../middleware/validation.js'
import auth from '../middleware/authentication.js'
import {isEmail, prepareInput} from '../middleware/searchInput.js';

const router = express.Router();

router.route('/signup')
  .post(
    userValidationRules(),
    userValidationErrorHandling,
    addUser
  )

router.route('/login')
  .post(loginUser)

router.route('/auth')
  .post(auth, verifyCookie)

router.route('/find')
  .post(auth, findUserById)

router.route('/logout')
  .get(logout)

//Add friend to friends array, works in both directions
router.route('/:id/addfriend')
  .post(auth, addFriend)

//Perform a search for a user with an open input field can be email or username
router.route('/:id/findfriend')
  .post(
    auth,
    isEmail(),
    prepareInput,
    findUserKeyValue
  )

export default router