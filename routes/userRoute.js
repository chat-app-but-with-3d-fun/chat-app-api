import express from 'express';
const router = express.Router();

import {userValidationRules, userValidationErrorHandling} from '../middleware/validation.js'
import {addUser, findUser, loginUser, verifyCookie} from '../controller/userController.js'
import auth from '../middleware/authentication.js'

router.route('/signin').post(userValidationRules(), userValidationErrorHandling, addUser)
router.route('/login').post(loginUser)
router.route('/auth').post(auth, verifyCookie)
router.route('/find').post(findUser)

export default router