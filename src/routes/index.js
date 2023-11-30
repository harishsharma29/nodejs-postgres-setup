/**
 * API Routes
 */

import express from 'express';
import path from 'path';
import fs from 'fs';

import { NotFoundError } from '../utils/error.js';
import logger from '../utils/logger.js'

const availableVersions = fs.readdirSync(path.resolve('src', 'routes')).filter(x => x !== 'index.js');
const routePaths = availableVersions.map((x) => path.resolve('src', 'routes', x));
const routes = express.Router();

let vIndex = 0;
while (vIndex < routePaths.length) {
    const version = availableVersions[vIndex];
    const routePath = routePaths[vIndex];
    const allFiles = fs.readdirSync(routePath);
    let index = 0;
    while (index < allFiles.length) {
        const route = allFiles[index];
        // exclude index.js file
        const routeFile = await import(path.join(routePath, route));
        routes.use(`/${version}/${route.split('.')[0]}`, routeFile.default);
        index++;
    }
    vIndex++;
}

routes.all('*', (req, res, next) => next(new NotFoundError('Route Not Found!')));

routes.use((error, req, res, next) => {
    logger.error(error);
    res.status(error.status || 500).send({
        error: {
            message: error.message
        }
    });
});

export default routes;
