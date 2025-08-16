//import Sequelize
import {Sequelize} from "sequelize";

//Sequelize instance
const sequelize = new Sequelize('minixgames_db', process.env.DB_USERNAME, process.env.DB_PASSWORD,{
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true, // adds createdAt and updatedAt
        underscored: true, // use snake_case for automatically added attributes
        freezeTableName: true // don't pluralize table names
    }
});