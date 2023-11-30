/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
import { get } from 'express-http-context';
import DataBaseConnection from '../index.js';

/**
 * Represents a database object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others
 *
 * created by               version                         date
 * Harish                   1.0.0                           26 May 2023
 *
 * @class Base
 */
class Base extends DataBaseConnection {
    constructor(requestQuery) {
        super();
        this.requestQuery = requestQuery;
        this.userData = get('requestUser');
    }

    /**
     * method to add databsae model into class local variable
     * @returns {undefined}
     */
    initialiseModel() {
        this.model = this.db[this.modelName];
        this.queryObject = this.getQueryFromRequest();
    }

    /**
     * Generate Uniform query object for paginations
     * @param {Object} queryObject Optional | object containing the paginations data
     * @returns {Object}
     */
    getQueryFromRequest(queryObject = this.requestQuery || get('qyeryObject')) {
        if (queryObject && Object.prototype.toString.call(queryObject) === '[object Object]' && Object.keys(queryObject).length > 0) {
            const paginations = {};
            if (queryObject.sort?.[0]) {
                paginations.order = [[this.db.sequelize.col(queryObject.sort[0]), queryObject.sort[1] || 'DESC']];
                paginations.sort = queryObject.sort;
            }
            if (+queryObject.pageNumber && +queryObject.pageNumber - 1 && +queryObject.rowPerPage) {
                paginations.offset = (queryObject.pageNumber - 1) * queryObject.rowPerPage;
            }
            if (+queryObject.rowPerPage) {
                paginations.limit = +queryObject.rowPerPage;
            }
            return paginations;
        }
        return {};
    }

    /**
     * Returns a database transaction to use in database operations
     * @param {Object} transaction Optional
     * @param {String} isolationLevel Optional
     * @returns {Promise<Object>}
     */
    getNewTransactionInstance(transaction, isolationLevel) {
        return this.db.sequelize.transaction({
            autocommit: false,
            transaction,
            isolationLevel
        });
    }

    /**
     * return array with only needed fields
     * @param {Array} attributes
     * @returns
     */
    getWhitelistedFields(attributes) {
        const isArray = Object.prototype.toString.call(attributes) === '[object Array]';
        if (isArray) {
            const allFieldsArr = Object.entries(this.fields);
            const filtered = allFieldsArr.filter((x) => (x ? x[1].slice(0, 2) !== '__' : x));
            return attributes.filter((x) => filtered.some((y) => y[0] === x));
        }
        return attributes;
    }

    /**
     * Function to get an filtered object of overriden queries
     * @returns filter object of general overriden querys as per model columns
     */
    getOverRidesQueries() {
        const overRides = Object.entries(this.whereClauseOverRide);
        return Object.fromEntries(overRides.filter((x) => x[0] && this.fields[x[0]]));
    }

    /**
     * Method to find data (paginated data if required) and count all records in a table
     * @param {Object} whereCondition
     * @param {Array} attributes
     * @param {Boolean} isRelated
     * @param {Boolean} distinct
     * @param {Object} paginated
     * @param {Boolean} raw
     * @param {Boolean} paranoid
     * @returns {Promise<Object>}
     */
    async findAndCountAll(...args) {
        const [
            whereCondition,
            attributes = this.fieldsList,
            isRelated = false,
            distinct = false,
            paginated = this.queryObject,
            raw = false,
            respectBlacklist = true,
            paranoid = false
        ] = args;
        const [rows, count] = await Promise.all([
            this.model.findAll({
                attributes: [...(respectBlacklist ? this.getWhitelistedFields(attributes) : attributes)],
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                distinct,
                ...(raw && { raw, nest: true }),
                ...(isRelated && { include: this.relations }),
                ...(paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }),
                ...(this.getOverRidesQueries().isActive !== '1' && { paranoid: paranoid || false })
            }),
            this.model.count({
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                distinct,
                ...(isRelated && { include: this.relations }),
                ...(this.getOverRidesQueries().isActive !== '1' && { paranoid: paranoid || false })
            })
        ]);
        return { rows, count };
    }

    /**
     * Method to fetch records as per given condition from database tables
     * @param {Object} whereCondition
     * @param {Array} attributes
     * @param {Boolean} isRelated
     * @param {Boolean} distinct
     * @param {Object} paginated
     * @param {Boolean} raw
     * @param {Boolean} paranoid
     * @returns {Promise<Array>}
     */
    async findAll(...args) {
        const [
            whereCondition,
            attributes = this.fieldsList,
            isRelated = false,
            distinct = false,
            paginated = this.queryObject,
            raw = false,
            respectBlacklist = true,
            paranoid = false
        ] = args;
        return this.model.findAll({
            attributes: [...(respectBlacklist ? this.getWhitelistedFields(attributes) : attributes)],
            where: { ...this.getOverRidesQueries(), ...whereCondition },
            distinct,
            ...(raw && { raw, nest: true }),
            ...(isRelated && { include: this.relations }),
            ...(this.getOverRidesQueries().isActive !== '1' && { paranoid: paranoid || false }),
            ...(paginated && Object.keys(paginated || {}).length > 0 && { ...paginated })
        });
    }

    /**
     * Method to find the most recent record from database
     * @param {Object} whereCondition
     * @param {Array} attributes
     * @param {Boolean} isRelated
     * @param {Object} paginated
     * @param {Boolean} raw
     * @param {Boolean} paranoid
     * @returns {Promise<Object>}
     */
    async findOne(whereCondition, attributes = this.fieldsList, isRelated = false, paginated = {}, raw = false, respectBlacklist = true, paranoid = false) {
        return this.model.findOne({
            attributes: [...(respectBlacklist ? this.getWhitelistedFields(attributes) : attributes)],
            where: { ...whereCondition },
            ...(raw && { raw, nest: true }),
            ...(isRelated && { include: this.relations }),
            ...(paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }),
            paranoid
        });
    }

    /**
     * Method to create new records in database
     * @param {Object} payLoad
     * @param {Object} transaction
     * @returns {Promise<Object>}
     */
    async create(payLoad, transaction) {
        if (!payLoad.createdBy && this.fields.createdBy && this.userData?.userId) {
            payLoad.createdBy = this.userData.userId;
        }
        if (!payLoad.updatedBy && this.fields.updatedBy && this.userData?.userId) {
            payLoad.updatedBy = this.userData.userId;
        }
        return this.model.create(payLoad, { transaction, individualHooks: true, returning: true });
    }

    /**
     * Method to create multiple records in database
     * @param {Array <Object>} payLoadArray
     * @param {Object} transaction
     * @returns {Promise<Array>}
     */
    async bulkCreate(payLoadArray, transaction) {
        payLoadArray.forEach((payLoad) => {
            if (!payLoad.createdBy && this.fields.createdBy && this.userData?.userId) {
                payLoad.createdBy = this.userData.userId;
            }
            if (!payLoad.updatedBy && this.fields.updatedBy && this.userData?.userId) {
                payLoad.updatedBy = this.userData.userId;
            }
        });
        const result = await this.model.bulkCreate(payLoadArray, {
            ignoreDuplicates: true,
            individualHooks: true,
            transaction
        });
        return result;
    }

    /**
     * Method to update record(s) in database
     * @param {Object} payLoad
     * @param {Object} where
     * @param {Object} transaction
     * @param {Boolean} paranoid
     * @returns {Promise <Object>}
     */
    async update(payLoad, where = {}, transaction = null, paranoid = false) {
        if (this.fields.updatedBy && this.userData?.userId) {
            payLoad.updatedBy = this.userData.userId;
        }
        return this.model.update(payLoad, { where, transaction, individualHooks: true, returning: true, paranoid });
    }

    /**
     * Method to delete any record from database, deleted return number of rows
     * @param {Object} whereClause
     * @param {Object} transaction
     * @returns {Promise<Number>}
     */
    async delete(whereClause, transaction) {
        return this.model.delete(whereClause, transaction);
    }

    /**
     * Method to force delete records from database
     * @param {Object} whereClause
     * @param {Object} transaction
     * @param {Boolean} force
     * @returns {Promise}
     */
    async forceDelete(whereClause, transaction, force = true) {
        return this.model.destroy({
            where: whereClause,
            transaction,
            individualHooks: true,
            returning: true,
            force
        });
    }

    /**
     * Method to truncate a table from database
     * @param {Object} transaction
     * @returns {Promise}
     */
    async truncate(transaction) {
        return this.model.truncate({ transaction, restartIdentity: true });
    }

    /**
     * Method to check whether a record exits in database with given parameters
     * @param {Object} whereCondition
     * @param {Boolean} paranoid
     * @returns {Promise<Boolean>}
     */
    async isAlreadyExists(whereCondition, paranoid = false) {
        const result = await this.model.count({
            where: { ...whereCondition },
            paranoid
        });
        return result > 0;
    }

    /**
     * Method to check whether a record exits in database with given parameters
     * @param {Object} whereCondition
     * @param {Boolean} paranoid
     * @returns {Promise<Boolean>}
     */
    async isNotExists(whereCondition, paranoid = false) {
        const result = await this.model.count({
            where: { ...whereCondition },
            paranoid
        });
        return result === 0;
    }

    /**
     * Method to create a new record in database if records doesn't exists if it exists then update the same
     * @param {Object} where
     * @param {Object} newItem
     * @param {Object} transaction
     * @returns {Peomise<Object>}
     */
    async createOrUpdate(where, newItem, transaction = null) {
        // First try to find the record
        const notFoundItem = await this.isNotExists(where);
        if (notFoundItem) {
            // Item not found, create a new one
            const item = await this.create(newItem, transaction);
            return { item: item, created: true };
        } else {
            // Found an item, update it
            const updated = await this.update(newItem, where, transaction);
            return { item: updated, created: false };
        }
    }

    /**
     * Method to cout the existing records in database
     * @param {Object} whereClause
     * @param {Boolean} paranoid
     * @returns {Promise<Number>}
     */
    async count(where, paranoid = false) {
        return this.model.count({
            where,
            paranoid
        });
    }

    generateRawQuery(conditions = {}) {
        const generateQuery = this.db.sequelize.queryInterface.queryGenerator
            .selectQuery(this.modelName, conditions)
            .slice(0, -1)
            .replace(/null\./gi, `${this.name}.`);
        return generateQuery;
    }
}

export default Base;
