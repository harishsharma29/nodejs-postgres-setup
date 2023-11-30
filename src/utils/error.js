import httpStatus from 'http-status';

/* eslint-disable max-classes-per-file */
/* eslint-disable default-param-last */
export class BaseError extends Error {
    constructor(_message, statusCode = httpStatus.INTERNAL_SERVER_ERROR, code = 'ERR_SYSTEM') {
        super(_message);
        this.statusCode = statusCode;
        this.returnCode = 1025;
        this.code = code;
        this.message = _message?.message || _message || 'Something went wrong, Please try again later';
    }
}

// ============== Default status code errors ============== //
export class BadRequestError extends BaseError {
    constructor(_message) {
        super(_message);
        this.message = _message;
        this.statusCode = httpStatus.BAD_REQUEST;
        this.message = _message || 'Bad Request';
    }
}

export class NotAuthenticatedError extends BaseError {
    constructor(_message) {
        super(_message);
        this.statusCode = httpStatus.UNAUTHORIZED;
        this.message = _message || 'You are not authenticated';
    }
}

export class NotAuthorizedError extends BaseError {
    constructor(_message) {
        super(_message);
        this.statusCode = httpStatus.FORBIDDEN;
        this.message = _message || 'You are not authoirzed';
    }
}

export class NotFoundError extends BaseError {
    constructor(_message) {
        super(_message);
        this.statusCode = httpStatus.NOT_FOUND;
        this.code = 'ERR_RECORD_DOESNOT_EXISTS';
        this.message = _message || 'Record does not exist with our system';
    }
}

export class RecordAlreadyExistsError extends BaseError {
    constructor(_message) {
        super(_message);
        this.statusCode = httpStatus.CONFLICT;
        this.code = 'ERR_RECORD_ALREADY_EXISTS';
        this.message = _message || 'Record already exists with same attributes';
    }
}

export class RequestParamsInvalidError extends BaseError {
    constructor(_message) {
        super(_message);
        this.statusCode = httpStatus.UNPROCESSABLE_ENTITY;
        this.code = 'ERR_REQUEST_PARAMS_INVALID';
        this.message = _message || 'Some request params are invalid';
    }
}

export class PathNotFoundError extends BaseError {
    constructor(_message) {
        super(_message);
        this.statusCode = httpStatus.NOT_FOUND;
        this.code = 'ERR_PATH_NOT_FOUND';
        this.message = _message || 'Path not found';
    }
}
