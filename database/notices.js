import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const NOTICES_TAB = sequelize.define('notices', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    destination: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.STRING
    }
});

export default NOTICES_TAB