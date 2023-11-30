'use strict';

import schema from '../../config/database-schema.js';

/**
 * A sample migration to create table and insert data from csv keep this file for future reference
 */
module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(schema.USERS, {
            id: {
                type: Sequelize.UUID,
                field: 'id',
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: Sequelize.STRING,
                field: 'name',
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                field: 'email'
            },
            mobileNumber: {
                type: Sequelize.STRING,
                field: 'mobile_number',
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                field: 'address',
                allowNull: false
            },
            tempToken: {
                type: Sequelize.TEXT,
                field: 'temp_token'
            },
            lastLogin: {
                type: Sequelize.DATE,
                field: 'last_login'
            },
            password: {
                type: Sequelize.STRING,
                field: 'password'
            },
            userSalt: {
                type: Sequelize.STRING,
                field: 'user_salt'
            },
            createdBy: {
                type: Sequelize.UUID,
                field: 'created_by'
            },
            updatedBy: {
                type: Sequelize.UUID,
                field: 'updated_by'
            },
            createdAt: {
                type: Sequelize.DATE,
                field: 'created_at',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                field: 'updated_at',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE,
                field: 'deleted_at'
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(schema.USERS);
    }
};
