// import{ express, router, validate, UserController, authenticateToken } from './index.js'
import { Router } from 'express';
const router = Router()
import validate from "../../Middlewares/validate-user-middleware.js";
import UserController from "../../Controllers/user-controllers.js";
import authToken from '../../Middlewares/authenticaiton-middleware.js';
const { authenticateToken } = authToken
// const = _default


router.post('/signUp', validate.signUpValidator, UserController.signUp)

router.post('/login', validate.logInValidator, UserController.logIn)

router.post('/forget-password', validate.forgetPasswordValidator, UserController.forgetPassword)

router.put('/reset-password', validate.resetPasswordValidator, UserController.resetPassword)

router.put('/update-profile', validate.updateInfoValidator, authenticateToken, UserController.updateProfile)


export default router