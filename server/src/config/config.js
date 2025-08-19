//import helper functions
import {getRequiredEnv, getBooleanEnv, getNumericEnv} from '../utils/envHelpers.js'

//dotenv loader import
import dotenv from 'dotenv';
dotenv.config();

//application config
export const appConfig = {
    //Application config options
    app:{
        name: 'MinixGames',
        env: getRequiredEnv('NODE_ENV'),
        port: getNumericEnv('PORT', 3000),
        host: process.env.HOST || 'localhost',
        url: process.env.APP_URL || `http://localhost:${getNumericEnv('PORT', 3000)}`,
    },

    //Database config options
    database:{
        database: getRequiredEnv('DB_DATABASE'),
        dialect: 'mysql',
        host: getRequiredEnv('DB_HOST'),
        port: getNumericEnv('DB_PORT', 3306),
        username: getRequiredEnv('DB_USERNAME', 'root'),
        password: getRequiredEnv('DB_PASSWORD'),
        logging: getBooleanEnv('DB_LOGGING', false),
        pool: {
            max: getNumericEnv('DB_POOL_MAX', 10),
            min: getNumericEnv('DB_POOL_MIN', 0),
            acquire: getNumericEnv('DB_POOL_ACQUIRE', 30000),
            idle: getNumericEnv('DB_POOL_IDLE', 10000)
        },
        define: {
            timestamps: true, // adds createdAt and updatedAt
            underscored: true, // use snake_case for automatically added attributes
            freezeTableName: true // don't pluralize table names
        }
    },

    //Authentication and security
    auth:{
        jwtSecret: getRequiredEnv('JWT_SECRET'),
        jwtExpires: getRequiredEnv('JWT_EXPIRES_IN'),
        bcryptRounds: getNumericEnv('BCRYPT_ROUNDS', 12)
    }
}

/**
 * #### Validates app configuration for production environment
 **/
export const validateConfig = ()=>{
    //minimum required keys with existing value
    const requiredInProd = [
        'JWT_SECRET',
        'DB_NAME',
        'DB_USERNAME',
        'DB_PASSWORD',
    ]
    //check if key value exist
    if(appConfig.app.env === 'production'){
        for(const key of requiredInProd){
            if(!process.env[key]){
                throw new Error(`${key} is required in production environment`)
            }
        }
        //additional checks
    }
    console.log('✅ Configuration validation passed');
};