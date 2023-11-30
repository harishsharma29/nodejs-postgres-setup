import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import { getSequalizeIns } from './run-migration-seeders.js';

export default async function () {
    const sequelize = await getSequalizeIns();
    const db = {};

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    const modelPath = path.resolve('src', 'database', 'models');

    // loop through all files in models directory
    let index = 0;
    const allModels = fs.readdirSync(modelPath);
    while (index < allModels.length) {
        const modelFile = await import(path.join(modelPath, allModels[index]));
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
