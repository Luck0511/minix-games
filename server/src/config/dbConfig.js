//import Sequelize
import {Sequelize} from "sequelize";

//configuration import
import {appConfig} from './config.js'

//Sequelize instance
export const sequelize = new Sequelize(
    appConfig.database.database,
    appConfig.database.username,
    appConfig.database.password,
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