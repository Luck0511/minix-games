//import Sequelize
import {Sequelize} from "sequelize";

//configuration import
import {appConfig} from './config.js'

//function to build connection URI from config parameters
const buildURI = ()=>{
    console.log("URI not provided, building from config parameters...");
    //build connection URI from config
    const dialect = appConfig.database.dialect;
    const username = appConfig.database.username;
    const password = appConfig.database.password ? encodeURIComponent(appConfig.database.password) : '';
    const host = appConfig.database.host;
    const port = appConfig.database.port;
    const database = appConfig.database.database;

    return `${dialect}://${username}:${password}@${host}:${port}/${database}`;
}

//Sequelize instance --> initialize connection to database exclusively through URI
export const sequelize = new Sequelize(
    appConfig.database.db_uri || buildURI(),
    {
        host: appConfig.database.host,
        port: appConfig.database.port,
        dialect: appConfig.database.dialect,
        logging: appConfig.database.logging,
        pool: appConfig.database.pool,
        define: appConfig.database.define,
        ...(appConfig.database.dialect === 'postgres' && {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        })
    }
);

export const testConnection = async ()=>{
    try{
        //connect to DB
        await sequelize.authenticate();
        console.log('✅ Connection to Database has been established successfully.');
        //synchronize on connection
        await synchronizeDB();
    }catch(error){
        console.error('❌ Connection to Database failed: ', error);
    }
}

export const synchronizeDB = async () => {
    try{
        //synchronize DB to models
        await sequelize.sync({force: appConfig.app.env === 'development'});//forcing if is in development env
        console.log('✅ Database synchronized successfully.');
    }catch(error){
        console.error('❌ Database synchronization failed: ', error);
    }
}