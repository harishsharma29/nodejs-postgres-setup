/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

'use strict';

import path from 'path';
import fs from 'fs';
import * as OS from 'os';
import { SequelizeStorage, Umzug } from 'umzug';
import Sequelize from 'sequelize';

const osType = OS.platform();

export const getSequalizeIns = async () => {
    const pool = {
        min: process.env.SEQ_POOL_MAX || 0,
        max: process.env.SEQ_POOL_MAX || 70,
        idle: process.env.SEQ_POOL_IDLE || 10000,
        acquire: process.env.SEQ_POOL_IDLE || 300000
    };

    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
            ssl: false
        },
        port: process.env.DB_PORT,
        pool: pool,
        logging: false
    });
    await sequelize.authenticate();
    return sequelize;
};

export const runMigrationsAndSeeders = async () => {
    try {
        await runMigrations();
        await runSeeders();
    } catch (error) {
        console.log('>genus-wfm | [run-migration-seeders.js] | LINE #40 | error : ', error);
        throw error;
    }
};

export const runMigrations = async function () {
    const migratorConfig = await getMigratInstance();
    await migratorConfig.up();
};

export const runSeeders = async function () {
    const seederConfig = await getMigratInstance('seeders');
    await seederConfig.up();
};

const getMigratInstance = async function (folderName = 'migrations') {
    let time = Date.now();
    const sequelize = await getSequalizeIns();
    const folderPath = path.resolve('src', 'database', folderName);
    const migrationsFolder = fs.readdirSync(folderPath).filter(x => x.includes('.js'));
    let allMigrations = await Promise.all(migrationsFolder.map(async name => {
        const migration = await import(path.join(folderPath, name));
        return [name, migration.default]
    }))
    allMigrations = allMigrations.reduce((pre, [name, migration]) => {
        pre[name] = migration
        return pre
    }, {})
    const migrator = new Umzug({
        migrations: {
            glob: formatPath(path.resolve('src', 'database', folderName, '*.js')),
            resolve: ({ name, path, context }) => {
                const migration = allMigrations[name];
                return {
                    name,
                    up: async () => migration.up(context, Sequelize, name),
                    down: async () => migration.down(context, Sequelize, name)
                }
            }
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize, modelName: folderName === 'migrations' ? 'system_migrations' : 'system_seeders' })
    });
    migrator.on('migrating', ({ name }) => {
        time = Date.now();
        console.log(`== ${name}: ${folderName === 'migrations' ? 'migrating' : 'seeding'} =======`);
    });
    migrator.on('migrated', ({ name }) => {
        console.log(`== ${name}: ${folderName === 'migrations' ? 'migrated' : 'seeded'} (${(Date.now() - time) / 1000}s) \n`);
    });
    return migrator;
};

function formatPath(pathText) {
    if (pathText && osType === 'win32') {
        return pathText.replace(/\\/g, '/');
    }
    return pathText;
}
