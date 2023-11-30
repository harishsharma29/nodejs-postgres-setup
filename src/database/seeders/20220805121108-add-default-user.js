'use strict';

/**
 * A sample migration to create table and insert data from csv keep this file for future reference
 */

import path from 'path';
import { seedFromCsv } from '../services/run-seeder.js';
import config from '../../config/database-schema.js';

module.exports = {
    up: function (queryInterface, Sequelize) {
        const file = path.join(__dirname, 'csv', path.basename(__filename).replace('.js', '.csv'));
        const map = function (_data) {
            return {
                id: _data[0],
                name: _data[1],
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