import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const BUG_FIXES_TAB = sequelize.define('bugFixes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.STRING
    }
});

export default BUG_FIXES_TAB