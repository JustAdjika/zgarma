import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const ADMINS_TAB = sequelize.define('admins', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    key: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    }
});

export default ADMINS_TAB