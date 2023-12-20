import User from '../Models/User-Models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const secretKey = 'your-secret-key';
const passwordResetToken = new Map()
import emailService from '../Helper/email-nodemailer.js';
import hbs from 'hbs';
import path from 'path';
import fs from 'fs';
// import templatePath from '../View/index.hbs';







export default { User, bcrypt, jwt, secretKey, passwordResetToken, emailService, hbs, path, fs }
