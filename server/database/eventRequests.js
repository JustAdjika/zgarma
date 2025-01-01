import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const EVENT_REQUESTS_TAB = sequelize.define('eventRequests', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER
    },
    eventId: {
        type: DataTypes.INTEGER
    },
    team: {
        type: DataTypes.STRING
    },
    squad: {
        type: DataTypes.INTEGER
    },
    slot: {
        type: DataTypes.INTEGER
    },
    maybeTL: {
        type: DataTypes.BOOLEAN
    },
    maybeSL: {
        type: DataTypes.BOOLEAN
    },
    date: {
        type: DataTypes.STRING
    },
});

export default EVENT_REQUESTS_TAB