//import Sequelize
import {Sequelize} from "sequelize";

//configuration import
import {appConfig} from './config.js'

//Sequelize instance
export const sequelize = new Sequelize(appConfig.database);

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
        await sequelize.sync({alter:true});
        console.log('✅ Database synchronized successfully.');
    }catch(error){
        console.error('❌ Database synchronization failed: ', error);
    }
}