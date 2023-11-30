/**
 * User Routes
 */

import express from 'express';
import { validate } from 'express-validation';
import * as UserController from '../../controllers/user.js';
import responseHandler from '../../utils/response-handler.js';
import * as UserValidations from '../../validations/user.js';

const routes = express.Router();

routes.post('/signup', validate(UserValidations.create), responseHandler.bind(this, UserController.create));

export default routes;
