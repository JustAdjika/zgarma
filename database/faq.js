import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const FAQ_TAB = sequelize.define('faqs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.JSON
    },
    devBranch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default FAQ_TAB