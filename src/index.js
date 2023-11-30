/**
 * Server setup
 */
import express from 'express';
import http from 'http';
import path from 'path';
import EventEmitter from 'events';

import middlewaresConfig from './middleware/index.js';
import ApiRoutes from './routes/index.js';
import Database from './database/index.js';

global.myEmitter = new EventEmitter();

const { HTTP_PORT } = process.env;
global.rootDir = path.resolve();
global.exportedFilesDirectory = path.resolve('exportedFiles');

async function startServer() {
    // Create PostgreSQL database connection
    await Database.createDatabaseConnection();
    const app = express();

    // Wrap all the middlewares with the server
    middlewaresConfig(app);

    // Add the apiRoutes stack to the server
    app.use('/api', ApiRoutes);

    const secureServer = http.createServer(app);
    secureServer.listen(HTTP_PORT, '0.0.0.0', function () {
        console.log(`Server is listening on port ${HTTP_PORT}`);
    });
}

startServer();