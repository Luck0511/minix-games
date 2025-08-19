//utility functions for app configuration
/**
* #### Get required environment variables
* @param {string} key env variable key
* @param {any} defaultValue default returned value if not set
* @returns {string} env variable value
* @throws {Error} if required variable is not set / blocks execution
**/
export const getRequiredEnv = (key, defaultValue=null) => {
    const value = process.env[key] || defaultValue;
    if(value === undefined || value === null || value === '') {
        throw new Error(`Required env variable ${key}: is not set`);
    }
    return value;
}
/**
 * #### Get boolean environment variables
 * @param {string} key env variable key
 * @param {boolean} defaultValue default returned boolean value if not set
 * @returns {boolean} env variable value
**/
export const getBooleanEnv = (key, defaultValue=false) => {
    const value = process.env[key];
    if(value === undefined) return defaultValue;
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
}
/**
 * #### Get parsed numeric environment variables
 * @param {string} key env variable key
 * @param {number|null} defaultValue default returned value if not set
 * @returns {number} env variable value
 * @throws {Error} if value is not a valid number
**/
export const getNumericEnv = (key, defaultValue=null) => {
    const value = process.env[key];
    if(value===undefined) return defaultValue;
    const parsed = Number(value);
    if(isNaN(parsed)) {
        throw new Error(`Numeric env variable ${key} is not a valid number, got: ${parsed}`);
    }
    return parsed;
}
/**
 * #### Get array environment variable (comma-separated)
 * @param {string} key env variable key
 * @param {Array} defaultValue default Array value if not set
 * @returns {Array} parsed array
**/
export const getArrayEnv = (key, defaultValue=[]) => {
    const value = process.env[key];
    if(!value) return defaultValue;
    return value.split(',').map(item=>item.trim()).filter(Boolean);
}
/**
 * #### Get JSON environment variables
 * @param {string} key env variable key
 * @param {Object} defaultValue default Object value if not set
 * @returns {Object} parsed JSON env value
 * @throws {Error} if value is not a valid JSON
**/
export const getJSONEnv = (key, defaultValue=null) => {
    const value = process.env[key];
    if(!value) return defaultValue;

    try{
        return JSON.parse(value);
    }catch(err){
        throw new Error(`JSON env variable ${key} is not a valid json: ${err.message}`);
    }
}
/**
 * #### Check if running in dev environment
 * @returns {boolean} True if in development
**/
export const isDevelopment = ()=>{
    return process.env.NODE_ENV === 'development';
}
/**
 * #### Check if running in prod environment
 * @returns {boolean} True if in production
 **/
export const isProduction = ()=>{
    return process.env.NODE_ENV === 'production';
}
/**
 * #### Check if running in test environment
 * @returns {boolean} True if in testing
 **/
export const isTest = ()=>{
    return process.env.NODE_ENV === 'test';
}