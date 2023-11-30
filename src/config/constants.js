// require('dotenv').config();
import path from 'path';
import EventEmitter from 'events';

export const EVENT_EMITTER = new EventEmitter();

export const DIRECTORY_PATHS = {
    routesDir: path.resolve('src', 'routes'),
    databaseDir: path.resolve('src', 'database'),
    databaseModelsDir: path.resolve('src', 'database', 'models'),
    seedersCSVDir: path.resolve('src', 'database', 'seeders', 'csv'),
}

const WHITELIST = {
    users: {
        create: ['email', 'username', 'password']
    }
};

const devConfig = {
    JWT_SECRET: process.env.JWT_SECRET_DEV,
    MONGO_URL: process.env.MONGO_URL_DEV
};

const testConfig = {
    JWT_SECRET: 'ewtijwebgiuweg9w98u9283982t!!u1h28h1t1h89u9h@$$',
    MONGO_URL: 'mongodb://localhost/nodejs-api-boilerplate-test'
};

const prodConfig = {
    JWT_SECRET: process.env.JWT_SECRET_PROD,
    MONGO_URL: process.env.MONGO_URL_PROD
};

const defaultConfig = {
    HTTP_PORT: process.env.HTTP_PORT,
    HTTPS_PORT: process.env.HTTPS_PORT,
    APP_NAME: process.env.APP_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_DIALECT: process.env.DB_DIALECT,
    DB_PORT: process.env.DB_PORT,
    NODE_ENV: process.env.NODE_ENV,
    DISABLED_HTTPS_SERVER: process.env.DISABLED_HTTPS_SERVER,
    WHITELIST
};

function envConfig(env) {
    const envs = {
        development: devConfig,
        test: testConfig,
        prodConfig: prodConfig
    };
    return envs[env] || prodConfig;
}

export default {
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV)
};
