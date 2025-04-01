import { DataTypes } from 'sequelize';
import sequelize from './pool.js'

const POSTS_TAB = sequelize.define('posts', {
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
    option1: {
        type: DataTypes.STRING
    },
    option2: {
        type: DataTypes.STRING
    },
    option3: {
        type: DataTypes.STRING
    },
    option4: {
        type: DataTypes.STRING
    },
    votes: {
        type: DataTypes.JSON
    },
    devBranch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default POSTS_TAB