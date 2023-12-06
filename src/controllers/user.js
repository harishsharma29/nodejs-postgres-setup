/**
 * User controller
 */

import HTTPStatus from 'http-status';

import { filteredBody } from '../utils/filtered-body.js';
import constants from '../config/constants.js';
import Users from '../database/operation/user.js';
import statusMessage from '../config/status-message.js';
import { BadRequestError } from '../utils/error.js';
import { hashPassword } from '../services/user.js';
import TokenService from '../utils/token.js';


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
export async function signup(req) {
    const body = filteredBody(req.body, constants.WHITELIST.users.signup);
    if (!body) {
        throw new BadRequestError('Message')
    }
    const user = new Users();
    if (await user.isAlreadyExists({ email: req.body.email })) {
        throw new BadRequestError('Email already exists!!')
    }
    if (await user.isAlreadyExists({ username: req.body.username })) {
        throw new BadRequestError('Username already exists!!')
    }
    const dataObj = {...req.body, ...hashPassword(req.body.password, null)}
    const newUser = await user.create(dataObj)
    return [HTTPStatus.CREATED, { message: statusMessage.USER_CREATED, data: newUser }];
}


export async function checkForUsername(req) {
    const username = req.query ? req.query.text : null;
    if(!username){
        throw new BadRequestError('Query parameter not found!')
    }
    const user = new Users();
    if (await user.isAlreadyExists({ username })) {
        throw new BadRequestError('Username already taken!')
    }
    return [HTTPStatus.OK, { message: statusMessage.USERNAME_AVILABLE }];
} 

export async function login(req, res) {
    const body = filteredBody(req.body, constants.WHITELIST.users.login);
    if (!body) {
        throw new BadRequestError('Message')
    }
    const user = new Users();
    const existingUser = await user.findOne({ email: req.body.email }, ['id', 'salt', 'password'], undefined, undefined, true)
    if(!existingUser){
        return [HTTPStatus.NOT_FOUND, { message: statusMessage.EMAIL_NOT_FOUND}];
    }
    const hashInputPassword = hashPassword(req.body.password, existingUser.salt)
    if(existingUser.password === hashInputPassword.password){
        const userInfo = await user.findOne({ email: req.body.email }, undefined, undefined, undefined, undefined, true);
        const token = TokenService.issueToken(userInfo, {expiresIn: '24h'})
        res.cookie('auth_token', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
          });
        return [HTTPStatus.OK, { message: statusMessage.SUCCESS, data: { ...userInfo, sessionExpiresIn: '24h' }}];
    }
    res.clearCookie('auth_token');
    return [HTTPStatus.UNAUTHORIZED, { message: statusMessage.INVALID_CREDS }];
}

export async function logout(req, res) {
    res.clearCookie('auth_token');
    return [HTTPStatus.OK];
} 