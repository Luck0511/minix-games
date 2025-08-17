//import helper functions
import {getRequiredEnv, getBooleanEnv, getNumericEnv} from '../utils/envHelpers.js'

//application config
const config = {
    app:{
        name: 'MinixGames',
        env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000,
    }
}