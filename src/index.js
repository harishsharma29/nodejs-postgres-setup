/**
 * Server setup
 */
import express from 'express';
import http from 'http';

/**
 * Adding directory paths into global variable to access anywhere
 */

import middlewaresConfig from './middleware/index.js';
import ApiRoutes from './routes/index.js';
import Database from './database/index.js';
import { runMigrationsAndSeeders } from './database/services/run-migration-seeders.js';

const { HTTP_PORT } = process.env;
async function startServer() {
    // Create PostgreSQL database connection
    await runMigrationsAndSeeders();
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