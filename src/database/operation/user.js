import schema from '../../config/database-schema.js';
import Base from './base.js';

/**
 * Represents a database tables object with various properties and functionalities.
 *
 * This class provides the methods for database create, update, delete, get count and others for users table
 *
 * created by               version                         date
 * Tarun                    1.0.0                           05 June 2023
 *
 * updated by               version                         date
 * Mohammed Sameer          1.0.0                        22 June 2023
 *
 * @class Roles
 */
class Users extends Base {
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = schema.USERS;
        this.initialiseModel();

        this.blacklistedFields = ["password", "salt"]
        this.fieldsList = ['id','name','username','email','mobileNumber','lastLogin','password','salt','countryCode','createdBy','updatedBy','createdAt','updatedAt','deletedAt']

        this.relations = [
            {
                model: this.db[schema.USERS],
                attributes: ['id', 'name'],
                foreignKey: 'created_by',
                as: 'createdByUser'
            },
            {
                model: this.db[schema.USERS],
                attributes: ['id', 'name'],
                foreignKey: 'updated_by',
                as: 'updatedByUser'
            }
        ];
    }
}

export default Users;
