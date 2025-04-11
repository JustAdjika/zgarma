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
        type: DataTypes.STRING(2000)
    },
    date: {
        type: DataTypes.STRING
    },
    devBranch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default BUG_FIXES_TAB