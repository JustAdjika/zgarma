import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const ACCOUNTS_TAB = sequelize.define('accounts', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    key: {
        type: DataTypes.STRING
    },
    steam: {
        type: DataTypes.JSON
    },
    discord: {
        type: DataTypes.JSON
    },
    date: {
        type: DataTypes.STRING
    }
});

export default ACCOUNTS_TAB