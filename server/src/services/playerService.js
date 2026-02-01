// controller for player related operation trough API
import {db} from '../models/index.js';
import {passwordHash, verifyPassword} from "./authService.js";

/**
 * Register a new player by creating a new row in DB
 * @param {{playerName: String, password: String}} userData object containing basic player inputs
 * @param res response reference
 * @returns sets response status code
 **/
export const basePlayerValidation = (userData, res) => {
    const {playerName, password} = userData;

    if (!playerName || !password) {
        return res.status(400).json({message: 'Player name and password are required'});
    }
    //check password length
    if (password.length < 8) {
        return res.status(400).json({message: 'Password must be at least 8 characters long'});
    }
    //set a maximum length for playerName
    if (playerName.length > 32) {
        return res.status(400).json({message: 'Player name must be less than or 32 characters long'});
    }
}

/**
 * Returns and object containing only safe player data, excluding Sequelize's fields and player's password
 * @returns {Object} Player object containing player's safe data
 **/
export const playerSafeData = (player) => {
    const {password, ...safeData} = player.dataValues;
    return {
        ...safeData
    }
}

/**
 * Find and returns all registered players
 * @returns {Promise<Player[] || null>} Player array promise containing all players registered in DB
 **/
export const getAllPlayers = async () => {
    try {
        const {Player} = db;
        return await Player.findAll();
    } catch (err) {
        console.error('Error in DB query:', err)
        return null;
    }
}

/**
 * Execute a query searching for a player by its registered playerName Or ID
 * @param {string || number} playerIden registered player name
 * @returns {Promise<{opStatus: number, foundPlayer:Player?, message:string?}>}Player object promise or null for player not found
 **/
export const getPlayerInfo = async (playerIden) => {
    //check validity of input
    if (!playerIden) {
        console.error('No username or userID provided');
        return {opStatus: 400}; //bad request
    }
    //get Player model reference
    const {Player} = db;
    //check for type of identifier
    try {
        let foundPlayer;
        switch (typeof playerIden) {
            //search by playerName string
            case "string": {
                foundPlayer = await Player.findOne({
                    where: {
                        playerName: playerIden
                    }
                });
                break;
            }
            //search by playerID number
            case "number": {
                foundPlayer = await Player.findOne({
                    where: {
                        playerID: playerIden
                    }
                });
                break;
            }
            default: {
                console.error('Invalid player identifier type:', typeof playerIden);
                return {opStatus: 400, message: "Invalid player identifier type: " + typeof playerIden}; //bad request
            }
        }
        if (!foundPlayer) {
            return {opStatus: 404, message: "Player: " + playerIden + " could not be found"} // not found
        } else {
            return {opStatus: 200, foundPlayer: foundPlayer}; //success
        }
    } catch (err) { //unhandled errors
        console.error('Error in player query:', err)
        return {opStatus: 500, existingPlayer: null, message: "Error in player query: " + err}; //internal server error
    }
}

/**
 * Register a new player by creating a new row in DB
 * @param {String} playerName registered player name
 * @param {String} password registered password
 * @returns {Promise<{opStatus: int, newPlayer:Player? , message: string}>} object with final status and nullable Player object
 **/
export const registerNewPlayer = async (playerName, password) => {
    if (!playerName || !password) {
        return {opStatus: 400, message: 'Player name and password are required'};
    }
    try {
        //check if playerName is already taken
        const {opStatus, foundPlayer, message} = await getPlayerInfo(playerName);
        if (foundPlayer) {
            return {opStatus: 409, message: 'A Player with this name already exists'};
        } else {
            const {Player} = db;
            if(password.length < 8) {
                return {opStatus: 400, message: "Password must be at least 8 characters long"};
            }
            const hashedPassword = await passwordHash(password)
            const newPlayer = await Player.create({playerName: playerName, password: hashedPassword});
            return {opStatus: 200, newPlayer: newPlayer, message: 'Player profile created successfully'};
        }
    } catch (err) {
        console.error('Error in player registration:', err)
        return {opStatus: 500, message: `Error in player registration: ${err.message}`};
    }
}

/**
 * Login logic for system, searches existing match in DB and verify password
 * @param {String} playerName registered player name
 * @param {String} password registered password
 * @returns {Promise<{opStatus: number, loggedPlayer:Player?, message: string}>} object with final status and nullable Player object
 **/
export const loginPlayer = async (playerName, password) => {
    if (!playerName || !password) {
        return {opStatus: 400, message: 'Player name and password are required'};
    }
    try {
        //search for player by name
        const {opStatus, foundPlayer, message} = await getPlayerInfo(playerName);
        //return error code if player not found
        if (!foundPlayer) {
            return {opStatus: opStatus, message: message}; //use returned value from retrieving info operation
        }
        //match the passwords
        const isPasswordValid = await verifyPassword(password, foundPlayer.password);
        //return code 200 success if password matches
        if (isPasswordValid) {
            return {opStatus: 200, loggedPlayer: foundPlayer, message: 'Player is valid and logged in successfully'};
        } else {
            return {opStatus: 401, message: 'Wrong password'};
        }
    } catch (err) {
        console.error('Error in player login:', err);
        return {opStatus: 500, message: `Error in player login: ${err.message}`};
    }
}