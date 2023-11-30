import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import { getSequalizeIns } from './run-migration-seeders.js';
import { DIRECTORY_PATHS } from '../../config/constants.js';

export default async function () {
    const sequelize = await getSequalizeIns();
    const db = {};

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    // loop through all files in models directory
    let index = 0;
    const allModels = fs.readdirSync(DIRECTORY_PATHS.databaseModelsDir);
    while (index < allModels.length) {
        const modelFile = await import(path.join(DIRECTORY_PATHS.databaseModelsDir, allModels[index]));
        const model = modelFile.default(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        index++;
    }

    Object.keys(db).forEach(function (modelName) {
        // eslint-disable-next-line no-prototype-builtins
        if (db[modelName].options && db[modelName].options.hasOwnProperty('associate')) {
            db[modelName].options.associate(db);
        }
    });
    return db;
}
