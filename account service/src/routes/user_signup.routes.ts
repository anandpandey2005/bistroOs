import { user_signup } from '../controller/signup/user_signup.signup.controller.js';
import express, { Router } from 'express';

const signup_router: Router = express.Router();

signup_router.post('/', user_signup);

export default signup_router;
