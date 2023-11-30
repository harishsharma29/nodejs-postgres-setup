import EventEmitter from 'events';
import createDbConnection from './services/sequlize.js';

const dbConnections = {};

class DB extends EventEmitter {
    constructor() {
        super();
        this.db = dbConnections.db || {};
    }

    static createDatabaseConnection = async () => {
        if (!Object.keys(dbConnections).length) {
            dbConnections.db = await createDbConnection();
            console.log('*** PostgresSQL connection successfully created ***');
        }
    };

    getDataBaseConnections() {
        return this.db;
    }
}

export default DB;
