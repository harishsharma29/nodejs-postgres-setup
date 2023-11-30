import httpStatus from 'http-status';

export default async function (...args) {
    const [_actionFn, req, res, next] = args;
    try {
        const [httpCode, data] = await _actionFn(req, res);
        res.status(httpCode || httpStatus.OK).send(data);
    } catch (error) {
        next(error);
    }
}
