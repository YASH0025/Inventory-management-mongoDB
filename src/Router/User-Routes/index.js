import { Router } from 'express';
const router = Router()
import validate from "../../Middlewares/validate-user-middleware.js";
import UserController from "../../Controllers/user-controllers.js";
import authToken from '../../Middlewares/authenticaiton-middleware.js';
const { authenticateToken } = authToken
// const  = _default;

export default {router, validate, UserController, authenticateToken}