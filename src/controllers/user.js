/**
 * User controller
 */

import HTTPStatus from 'http-status';

import { filteredBody } from '../utils/filtered-body.js';
import constants from '../config/constants.js';
import Users from '../database/operation/users.js';
import statusMessage from '../config/status-message.js';
import { BadRequestError } from '../utils/error.js';

/**
 * @api {post} /users/signup Create a user
 * @apiDescription Create a user
 * @apiName createUser
 * @apiGroup User
 *
 * @apiParam (Body) {String} email User email.
 * @apiParam (Body) {String} password User password.
 * @apiParam (Body) {String} username User username.
 *
 * @apiSuccess {Number} status Status of the Request.
 * @apiSuccess {String} _id User _id.
 * @apiSuccess {String} token Authentication token.
 *
 * @apiSuccessExample Success-Response:
 *
 * HTTP/1.1 200 OK
 *
 * {
 *  _id: '123',
 *  token: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTBhMWI3ODAzMDI3N2NiNjQxM2JhZGUiLCJpYXQiOjE0OTM4MzQ2MTZ9.RSlMF6RRwAALZQRdfKrOZWnuHBk-mQNnRcCLJsc8zio',
 * }
 *
 * @apiErrorExample {json} Error
 *  HTTP/1.1 400 Bad Request
 *
 *  {
 *    email: 'email is required'
 *  }
 */
export async function create(req, res) {
    const body = filteredBody(req.body, constants.WHITELIST.users.create);
    if (!body) {
        throw new BadRequestError('Message')
    }
    const user = new Users();
    await user.create(body);
    return [HTTPStatus.CREATED, { message: statusMessage.USER_CREATED, data: {} }];
}
