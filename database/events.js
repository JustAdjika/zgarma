import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const EVENTS_TAB = sequelize.define('events', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    status: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.STRING
    },
    time: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING
    },
    metar: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    team1: {
        type: DataTypes.STRING
    },
    team2: {
        type: DataTypes.STRING
    },
    imgPath: {
        type: DataTypes.STRING
    },
    modsPath: {
        type: DataTypes.STRING
    },
    slotsTeam1: {
        type: DataTypes.JSON
    },
    slotsTeam2: {
        type: DataTypes.JSON
    },
    vehTeam1: {
        type: DataTypes.JSON
    },
    vehTeam2: {
        type: DataTypes.JSON
    },
    devBranch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default EVENTS_TAB