import schema from '../../config/database-schema.js';

export default function (sequelize, DataTypes) {
    const users = sequelize.define(
        schema.USERS,
        {
            id: {
                type: DataTypes.UUID,
                field: 'id',
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                field: 'name',
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                field: 'email',
                unique: true
            },
            tempToken: {
                type: DataTypes.TEXT,
                field: 'temp_token'
            },
            lastLogin: {
                type: DataTypes.DATE,
                field: 'last_login'
            },
            mobileNumber: {
                type: DataTypes.STRING,
                field: 'mobile_number',
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                field: 'password'
            },
            userSalt: {
                type: DataTypes.STRING,
                field: 'user_salt'
            },
            createdBy: {
                type: DataTypes.UUID,
                field: 'created_by'
            },
            updatedBy: {
                type: DataTypes.UUID,
                field: 'updated_by'
            },
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE,
                field: 'deleted_at'
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                users.hasMany(models[schema.USERS], { foreignKey: 'created_by', as: 'createdByUser' });
                users.hasMany(models[schema.USERS], { foreignKey: 'updated_by', as: 'updatedByUser' });
            }
        }
    );

    return users;
}
