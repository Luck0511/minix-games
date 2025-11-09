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

    if(!playerName || !password){
        return res.status(400).json({message: 'Player name and password are required'});
    }
    //check password length
    if(password.length < 8){
        return res.status(400).json({message: 'Password must be at least 8 characters long'});
    }
    //set a maximum length for playerName
    if(playerName.length > 32){
        return res.status(400).json({message: 'Player name must be less than or 32 characters long'});
    }
}

/**
 * Find and returns all registered players
 * @returns {Promise<Player[]> | null} Player array promise containing all players registered in DB
 **/
export const getAllPlayers = async () => {
    try{
        const {Player} = db;
        return await Player.findAll();
    }catch(err){
        console.error('Error in DB query:', err)
        return null;
    }
}

/**
 * Execute a query searching for a player by its registered playerName
 * @param {String} playerName registered player name
 * @returns Player object promise or null for player not found
 **/
export const getPlayerByName = async (playerName) => {
    if(!playerName){
        console.error('No username provided');
        return null;
    }
    try{
        const {Player} = db;
        return await Player.findOne({
            where: {
            playerName: playerName
        }});
    }catch (err){
        console.error('Error in player login:', err)
        return null;
    }
}

/**
* Register a new player by creating a new row in DB
* @param {String} playerName registered player name
* @param {String} password registered password
* @returns {Promise<{opStatus: int, newPlayer:Player?}>} object with final status and nullable Player object
**/
export const registerNewPlayer = async (playerName, password) => {
    if(!playerName || !password){
        return {opStatus: 400}; //{message: 'Player name and password are required'}
    }
    try{
        //check if playerName is already taken
        const existingPlayer = await getPlayerByName(playerName);
        if(existingPlayer){
            console.log("A player with this name already exists: ", existingPlayer);
            return {opStatus: 409} //{message: 'A Player with this name already exists'};
        }else {
            const {Player} = db;
            const hashedPassword = await passwordHash(password)
            const newPlayer = await Player.create({playerName: playerName, password: hashedPassword});
            return {opStatus: 200, newPlayer: newPlayer}
            //{message: 'Player profile created successfully', playerInfo: newPlayer});
        }
    }catch (err){
        console.error('Error in player registration:', err)
        return {opStatus: 500} //{message: 'Internal server error'};
    }
}

/**
 * Login logic for system, searches existing match in DB and verify password
 * @param {String} playerName registered player name
 * @param {String} password registered password
 * @returns {Promise<{opStatus: number, loggedPlayer:Player?}>} object with final status and nullable Player object
 **/
export const loginPlayer = async (playerName, password) => {
    if(!playerName || !password){
        return {opStatus: 400}; //{message: 'Player name and password are required'}
    }
    try{
        //search for player by name
        const player = await getPlayerByName(playerName);
        //return error code if player not found
        if(!player){
            return {opStatus: 404}; //{message: 'Player not found'};
        }
        //match the passwords
        const isPasswordValid = await verifyPassword(password, player.password);
        //return code 200 success if password matches
        if(isPasswordValid){
            return {opStatus: 200, loggedPlayer: player}
            //{message: 'Player found, credentials correct, logging into account'}
        }else{
            return {opStatus: 401}; //{message: 'Wrong password'};
        }
    }catch(err){
        console.error('Error in player login:', err)
        return {opStatus: 500} //{message: 'Internal server error'};
    }
}