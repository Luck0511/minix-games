//import Sequelize
import {Sequelize} from "sequelize";

//configuration import
import {appConfig} from './config.js'

//Sequelize instance
export const sequelize = new Sequelize(appConfig.database);

export const testConnection = async ()=>{
    try{
        await sequelize.authenticate();
        console.log('✅ Connection to Database has been established successfully.');
        await synchronizeDB();
    }catch(error){
        console.error('❌ Connection to Database failed: ', error);
    }
}

export const synchronizeDB = async () => {
    try{
        await sequelize.sync({alter:true});
        console.log('✅ Database synchronized successfully.');
    }catch(error){
        console.error('❌ Database synchronization failed: ', error);
    }
}