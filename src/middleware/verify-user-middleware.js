import { set } from 'express-http-context';
import HTTPStatus from 'http-status';
import statusMessage from '../config/status-message.js';
import Users from '../database/operation/users.js';
import logger from '../logger/logger.js';
import TokenService from '../utils/token.js';

function sendUnauthorizedResponse(_res, code, message) {
    _res.clearCookie('auth_token');
    _res.status(code).send({ message });
}

export default async (_req, _res, _next) => {
    try {
        // Read token from request cookies
        let token = _req.cookies?.auth_token;
        if (!token) {
            return sendUnauthorizedResponse(_res, HTTPStatus.UNAUTHORIZED, statusMessage.NO_AUTHORIZATION_HEADER);
        }

        // Decode the token and check for valid data
        const tokenData = TokenService.verifyToken(token);
        if (!tokenData?.id) {
            return sendUnauthorizedResponse(_res, HTTPStatus.UNAUTHORIZED, statusMessage.SESSION_EXPIRED);
        }

        // Get User information from the
        const users = new Users();

        const userData = await users.findOne({ id: tokenData.userId }, undefined, undefined, undefined, true, false);
        if (!userData?.isActive || !userSession) {
            return sendUnauthorizedResponse(_res, HTTPStatus.UNAUTHORIZED, statusMessage.SESSION_EXPIRED);
        }

        if (!tokenData?.iat) {
            return sendUnauthorizedResponse(_res, HTTPStatus.UNAUTHORIZED, statusMessage.SESSION_EXPIRED);
        }

        const totalSessionActiveTime = new Date().getTime() - new Date(userSession.lastActiveAt).getTime();
        const defaultSessionTimeout = 7200000; // 30 min
        if (totalSessionActiveTime > defaultSessionTimeout) {
            return sendUnauthorizedResponse(_res, HTTPStatus.UNAUTHORIZED, statusMessage.SESSION_EXPIRED);
        }
        // update last active time once in every minutes
        if (totalSessionActiveTime > 60 * 1000) {
            await userSessions.update({ lastActiveAt: Date.now() }, { id: userSession.id });
            _res.cookie('auth_token', `${token}`, { maxAge: defaultSessionTimeout });
        }

        _req.token = token;
        _req.tokenData = tokenData;
        _req.user = {
            id: tokenData.id,
            userId: userData.id,
            email: userData.email
        };
        set('requestUser', _req.user);
        return _next();
    } catch (error) {
        logger.info(error);
        sendUnauthorizedResponse(_res, HTTPStatus.INTERNAL_SERVER_ERROR, statusMessage.INTERNAL_SERVER_ERROR);
    }
};
