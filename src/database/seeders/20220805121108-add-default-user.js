'use strict';

/**
 * A sample migration to create table and insert data from csv keep this file for future reference
 */

import path from 'path';
import { seedFromCsv } from '../services/run-seeder.js';
import config from '../../config/database-schema.js';

export default {
    up: function (queryInterface, Sequelize, fileName) {
        const file = path.resolve('src', 'database', 'seeders', 'csv', fileName.replace('.js', '.csv'));
        const map = function (_data) {
            return {
                id: _data[0],
                name: _data[1],
                address: _data[2],
                email: _data[3],
                mobile_number: _data[4],
                password: _data[5],
                user_salt: _data[6],
                updated_at: _data[7],
                created_at: _data[8]
            };
        };
        return seedFromCsv(queryInterface, config.USERS, file, map);
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete(config.USERS, null, {});
    }
};
