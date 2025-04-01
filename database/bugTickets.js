import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const BUG_TICKETS_TAB = sequelize.define('bugTickets', {
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
    },
    status: {
        type: DataTypes.STRING
    },
    author: {
        type: DataTypes.STRING
    },
    isRepeat: {
        type: DataTypes.BOOLEAN,
    },
    devBranch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default BUG_TICKETS_TAB