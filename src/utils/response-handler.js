import httpStatus from 'http-status';

export default async function (...args) {
    const [_actionFn, req, res, next] = args;
    try {
        const { httpCode, data } = await _actionFn(req);
        res.status(httpCode || httpStatus.CREATED).send(data);
    } catch (error) {
        next(error);
    }
}
