/**
 * Configuration of the server middlewares.
 */

import compression from 'compression';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

function corsMiddleware(_req, _res, _next) {
    _res.setHeader('Access-Control-Allow-Origin', '*');
    _res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE', 'OPTIONS');
    _res.set('Access-Control-Allow-Credentials', 'true');
    _res.setHeader('Access-Control-Allow-Headers', ',X-XSRF-TOKEN,Content-Type,Authorization,JwtAuth,noMessage,noNavigate');
    _next();
}

export default (app) => {
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(compression());
    app.use(corsMiddleware);
    app.use(
        cors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            exposedHeaders: ['Content-Disposition', 'FileLength']
        })
    );
    app.use(fileUpload());
};
